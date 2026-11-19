/*
 * js/search.js — поиск по статьям: TF-IDF, SBERT, гибрид.
 * Подключать на news.html ПОСЛЕ app.js.
 *
 * SBERT работает прямо в браузере через Transformers.js (ONNX, WebAssembly).
 * Модель — многоязычная (понимает русский): paraphrase-multilingual-MiniLM-L12-v2.
 * Она скачивается при первом выборе режима SBERT/Гибрид (десятки–сотня МБ)
 * и дальше кэшируется браузером. Эмбеддинги статей кэшируются в localStorage.
 */
(() => {
    const MODEL_ID = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2';
    const TRANSFORMERS_URL = 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';
    const MIN_COS = 0.3;            // ниже этого косинуса SBERT считает документ нерелевантным
    const CACHE_KEY = 'sbert-index-v1';
    const MODE_KEY = 'search-mode';
    const WEIGHT_KEY = 'search-weight';

    /* ================= TF-IDF ================= */

    // Грубый «стемминг»: режем длинные слова до 5 символов — «уязвимости/уязвимость» совпадут
    const stem = (w) => (w.length > 5 ? w.slice(0, 5) : w);

    function tokenize(text) {
        return text
            .toLowerCase()
            .replace(/[^a-zа-яё0-9\s]/g, ' ')
            .split(/\s+/)
            .filter((w) => w.length > 1)
            .map(stem);
    }

    const docText = (a) => `${a.title} ${a.title} ${a.tags.join(' ')} ${articlePlainText(a)}`;

    function buildTfIdf(docs) {
        const docTokens = docs.map((d) => tokenize(docText(d)));
        const df = new Map();
        docTokens.forEach((tokens) => new Set(tokens).forEach((t) => df.set(t, (df.get(t) || 0) + 1)));
        const N = docs.length;
        const idf = new Map();
        df.forEach((f, t) => idf.set(t, Math.log((N + 1) / (f + 1)) + 1)); // сглаженный IDF, всегда > 0

        const vectors = docTokens.map((tokens) => {
            const counts = new Map();
            tokens.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1));
            const v = new Map();
            counts.forEach((c, t) => v.set(t, (c / tokens.length) * idf.get(t)));
            return v;
        });
        return { idf, vectors };
    }

    function cosineSparse(a, b) {
        let dot = 0, na = 0, nb = 0;
        a.forEach((x, k) => { na += x * x; if (b.has(k)) dot += x * b.get(k); });
        b.forEach((x) => { nb += x * x; });
        return na && nb ? dot / Math.sqrt(na * nb) : 0;
    }

    let tfidfModel = null;
    function tfidfScores(query) {
        if (!tfidfModel) tfidfModel = buildTfIdf(ARTICLES);
        const tokens = tokenize(query);
        if (!tokens.length) return ARTICLES.map(() => 0);
        const counts = new Map();
        tokens.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1));
        const q = new Map();
        counts.forEach((c, t) => { if (tfidfModel.idf.has(t)) q.set(t, (c / tokens.length) * tfidfModel.idf.get(t)); });
        return tfidfModel.vectors.map((v) => cosineSparse(q, v));
    }

    /* ================= SBERT ================= */

    let statusEl = null;
    const setStatus = (t) => { if (statusEl) statusEl.textContent = t; };

    let extractorPromise = null;
    function getExtractor() {
        if (!extractorPromise) {
            extractorPromise = (async () => {
                const { pipeline, env } = await import(TRANSFORMERS_URL);
                env.allowLocalModels = false;
                const progress = {};
                return pipeline('feature-extraction', MODEL_ID, {
                    progress_callback: (p) => {
                        if (p.status === 'progress' && p.file) {
                            progress[p.file] = p.progress;
                            setStatus(`Загрузка модели SBERT… ${Math.round(Math.max(...Object.values(progress)))}%`);
                        }
                    }
                });
            })();
            extractorPromise.catch(() => { extractorPromise = null; });
        }
        return extractorPromise;
    }

    async function embed(texts) {
        const ex = await getExtractor();
        const out = await ex(texts, { pooling: 'mean', normalize: true });
        return out.tolist(); // векторы уже нормализованы → косинус = скалярное произведение
    }

    // Модель видит ~128 токенов, поэтому статью режем на куски по ~280 символов
    function chunkArticle(a) {
        const chunks = [a.title];
        const sentences = articlePlainText(a).replace(/\n/g, ' ').match(/[^.!?]+[.!?]*/g) || [];
        let cur = '';
        for (const s of sentences) {
            if (cur && (cur + s).length > 280) { chunks.push(cur.trim()); cur = ''; }
            cur += s + ' ';
        }
        if (cur.trim()) chunks.push(cur.trim());
        return chunks;
    }

    const hash = (str) => { let h = 5381; for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0; return String(h); };

    const loadCache = () => { try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch { return {}; } };
    const saveCache = (c) => { try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch { /* квота — не страшно */ } };

    let docIndex = null; // docIndex[i] = массив векторов-кусков статьи i
    let indexPromise = null;

    async function buildIndex() {
        const old = loadCache();
        const next = {};
        const result = [];
        for (const a of ARTICLES) {
            const chunks = chunkArticle(a);
            const h = hash(chunks.join('|') + MODEL_ID);
            let vecs = old[a.id] && old[a.id].hash === h ? old[a.id].vecs : null;
            if (!vecs) {
                setStatus(`Индексация: ${a.title.slice(0, 32)}…`);
                vecs = (await embed(chunks)).map((v) => v.map((x) => +x.toFixed(4)));
            }
            next[a.id] = { hash: h, vecs };
            result.push(vecs);
        }
        saveCache(next);
        return result;
    }

    async function ensureSbert() {
        await getExtractor();
        if (!docIndex) {
            if (!indexPromise) indexPromise = buildIndex();
            try { docIndex = await indexPromise; } catch (e) { indexPromise = null; throw e; }
        }
        setStatus('');
    }

    const dot = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; };

    async function sbertScores(query) {
        const [q] = await embed([query]);
        // оценка статьи = лучший по сходству кусок (заголовок тоже считается куском)
        return docIndex.map((vecs) => Math.max(...vecs.map((v) => dot(v, q))));
    }

    /* ================= Режимы и объединение ================= */

    let mode = localStorage.getItem(MODE_KEY) || 'tfidf';
    let weight = +(localStorage.getItem(WEIGHT_KEY) || 50) / 100; // вес SBERT в гибриде

    async function runSearch(query) {
        const t = tfidfScores(query);
        const s = mode === 'tfidf' ? null : await sbertScores(query);
        const maxT = Math.max(...t, 0);
        const maxS = s ? Math.max(...s.filter((x) => x >= MIN_COS), 0) : 0;

        const res = [];
        ARTICLES.forEach((a, index) => {
            let score = 0;
            if (mode === 'tfidf') {
                score = maxT ? t[index] / maxT : 0;
            } else if (mode === 'sbert') {
                score = s[index] >= MIN_COS ? s[index] : 0; // реальный косинус
            } else {
                const tn = maxT ? t[index] / maxT : 0;
                const sn = s[index] >= MIN_COS && maxS ? s[index] / maxS : 0;
                score = weight * sn + (1 - weight) * tn;
            }
            if (score > 0) res.push({ index, score });
        });
        return res.sort((x, y) => y.score - x.score);
    }

    /* ================= Интерфейс ================= */

    document.addEventListener('DOMContentLoaded', () => {
        const input = document.getElementById('newsSearchInput');
        const box = document.getElementById('newsSearchResults');
        const loader = document.getElementById('newsLoader');
        const container = document.querySelector('.search-container');
        if (!input || !box || !container) return;

        // Переключатель режимов — над строкой поиска
        container.insertAdjacentHTML('beforebegin', `
            <div class="search-modes d-flex flex-wrap align-items-center gap-3 mb-2">
                <div class="btn-group btn-group-sm" role="group" aria-label="Режим поиска">
                    <button type="button" class="btn btn-outline-primary" data-mode="tfidf">TF-IDF</button>
                    <button type="button" class="btn btn-outline-primary" data-mode="sbert">SBERT</button>
                    <button type="button" class="btn btn-outline-primary" data-mode="hybrid">Гибрид</button>
                </div>
                <label id="hybridWeightWrap" class="small text-secondary align-items-center gap-2 d-none">
                    TF-IDF
                    <input type="range" id="hybridWeight" class="form-range" min="0" max="100" step="5" style="width:130px">
                    SBERT
                </label>
                <small id="searchStatus" class="text-secondary"></small>
            </div>`);
        statusEl = document.getElementById('searchStatus');
        const modeBtns = document.querySelectorAll('.search-modes [data-mode]');
        const weightWrap = document.getElementById('hybridWeightWrap');
        const weightInput = document.getElementById('hybridWeight');
        weightInput.value = Math.round(weight * 100);

        const MODE_LABEL = { tfidf: 'TF-IDF', sbert: 'SBERT', hybrid: 'Гибрид' };
        let timer, seq = 0;

        function paintMode() {
            modeBtns.forEach((b) => b.classList.toggle('active', b.dataset.mode === mode));
            weightWrap.classList.toggle('d-none', mode !== 'hybrid');
            weightWrap.classList.toggle('d-flex', mode === 'hybrid');
        }

        async function perform() {
            const query = input.value.trim();
            if (query.length < 2) { box.classList.remove('active'); return; }
            const my = ++seq;
            loader.style.display = 'block';
            try {
                if (mode !== 'tfidf') await ensureSbert();
            } catch (err) {
                console.error('SBERT недоступен:', err);
                mode = 'tfidf';
                paintMode();
                setStatus('Не удалось загрузить SBERT — включён TF-IDF.');
            }
            const results = await runSearch(query);
            if (my !== seq) return; // пришёл более свежий запрос
            loader.style.display = 'none';

            box.innerHTML = results.length
                ? results.slice(0, 5).map((r) => {
                    const a = ARTICLES[r.index];
                    return `
                    <div class="result-item" data-href="product.html?id=${encodeURIComponent(a.id)}">
                        <div class="result-header">
                            <span class="result-score">${MODE_LABEL[mode]} · совпадение: ${Math.round(r.score * 100)}%</span>
                        </div>
                        <div class="result-snippet">
                            <strong style="color:#2fa4b6">${escapeHtml(a.title)}</strong><br>
                            ${escapeHtml(articleExcerpt(a))}
                            ${a.tags.length ? `<div class="mt-1">${a.tags.map((t) => `<span class="tag-chip">#${escapeHtml(t)}</span>`).join(' ')}</div>` : ''}
                        </div>
                    </div>`;
                }).join('')
                : '<div class="no-results">Ничего не найдено 😔</div>';
            box.classList.add('active');
        }

        const schedule = () => { clearTimeout(timer); timer = setTimeout(perform, 250); };

        modeBtns.forEach((b) => b.addEventListener('click', async () => {
            mode = b.dataset.mode;
            localStorage.setItem(MODE_KEY, mode);
            paintMode();
            if (mode !== 'tfidf') {
                loader.style.display = 'block';
                try { await ensureSbert(); } catch (e) { setStatus('Не удалось загрузить SBERT.'); mode = 'tfidf'; paintMode(); }
                loader.style.display = 'none';
            }
            perform();
        }));

        weightInput.addEventListener('input', () => {
            weight = weightInput.value / 100;
            localStorage.setItem(WEIGHT_KEY, weightInput.value);
            schedule();
        });

        input.addEventListener('input', schedule);
        box.addEventListener('click', (e) => {
            const item = e.target.closest('.result-item');
            if (item) location.href = item.dataset.href;
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) box.classList.remove('active');
        });

        paintMode();
        if (mode !== 'tfidf') ensureSbert().catch(() => { mode = 'tfidf'; paintMode(); setStatus('SBERT недоступен — включён TF-IDF.'); });
    });
})();
