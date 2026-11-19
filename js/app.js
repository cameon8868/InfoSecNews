/*
 * js/app.js — рендер карточек, фильтры по тегам, страница статьи.
 * Порядок подключения: Articles.js → articles-meta.js → (experts-data.js) → app.js
 * Массив `articles` лежит в js/Articles.js (вынесен из старого app.js без изменений).
 */

const escapeHtml = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Статьи + метаданные (теги, обложка, автор, ссылки…)
const ARTICLES = articles.map((a) => ({
    tags: [],
    ...a,
    ...((window.ARTICLE_META && window.ARTICLE_META[a.id]) || {})
}));

/* ---------- Текст ---------- */

const isHtml = (s) => /<\/?[a-z][\s\S]*>/i.test(s);

// HTML → простой текст (DOMParser не исполняет скрипты и не грузит картинки)
function stripHtml(html) {
    const prepared = html.replace(/<\/(p|div|li|h[1-6]|blockquote|figure|figcaption)>/gi, '$&\n');
    const doc = new DOMParser().parseFromString(prepared, 'text/html');
    return (doc.body.textContent || '').replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n').trim();
}

// Чистый текст статьи (для поиска и превью): основной текст + extraHtml
function articlePlainText(a) {
    if (a._plain === undefined) {
        const main = isHtml(a.content) ? stripHtml(a.content) : a.content;
        const extra = a.extraHtml ? stripHtml(a.extraHtml) : '';
        a._plain = (main + '\n' + extra).trim();
    }
    return a._plain;
}

function getExcerpt(text, maxLength = 160) {
    const trimmed = text.trim();
    if (trimmed.length <= maxLength) return trimmed;
    let cut = trimmed.lastIndexOf(' ', maxLength);
    if (cut === -1) cut = maxLength;
    return trimmed.substring(0, cut).trim() + '...';
}

const articleExcerpt = (a) => a.excerpt || getExcerpt(articlePlainText(a));

// Тело статьи → HTML
function renderArticleBody(a) {
    const raw = a.content.trim();
    let html;
    if (isHtml(raw)) {
        html = raw; // автор сам написал HTML — выводим как есть
    } else if (raw.includes('\n')) {
        html = raw.split('\n').map((p) => p.trim()).filter(Boolean).map((p) => `<p>${escapeHtml(p)}</p>`).join('');
    } else {
        const sentences = raw.match(/[^.!?]+[.!?]+/g) || [raw];
        const chunks = [];
        for (let i = 0; i < sentences.length; i += 3) chunks.push(sentences.slice(i, i + 3).join(' ').trim());
        html = chunks.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
    }
    return html + (a.extraHtml || '');
}

/* ---------- Карточки ---------- */

const tagChipsHTML = (tags) =>
    (tags || [])
        .map((t) => `<a class="tag-chip" data-tag="${escapeHtml(t)}" href="news.html?tag=${encodeURIComponent(t)}">#${escapeHtml(t)}</a>`)
        .join('');

const coverHTML = (a, classes = '') =>
    a.cover
        ? `<div class="ratio ratio-16x9 ${classes}">
               <img src="${escapeHtml(a.cover)}" alt="${escapeHtml(a.coverAlt || a.title)}" loading="lazy"
                    class="object-fit-cover" onerror="this.closest('.ratio').remove()">
           </div>`
        : '';

function createCardHTML(a) {
    const url = `product.html?id=${encodeURIComponent(a.id)}`;
    return `
    <div class="col-12 col-md-6 col-lg-4">
        <article class="card hover-lift blog-card h-100 overflow-hidden">
            ${a.cover ? `<a href="${url}" tabindex="-1" aria-hidden="true">${coverHTML(a)}</a>` : ''}
            <div class="card-body d-flex flex-column">
                <span class="badge ${a.badgeClass} mb-3 align-self-start">${escapeHtml(a.badge)}</span>
                <h3 class="h5"><a class="text-reset text-decoration-none" href="${url}">${escapeHtml(a.title)}</a></h3>
                <p class="text-secondary flex-grow-1">${escapeHtml(articleExcerpt(a))}</p>
                ${a.tags.length ? `<div class="d-flex flex-wrap gap-1 mb-3">${tagChipsHTML(a.tags)}</div>` : ''}
                <div class="d-flex justify-content-between align-items-center mt-auto">
                    <small class="fw-bold">${escapeHtml(a.date)}</small>
                    <a class="btn btn-primary btn-sm" href="${url}">Читать</a>
                </div>
            </div>
        </article>
    </div>`;
}

function createListItemHTML(a) {
    return `
    <a href="product.html?id=${encodeURIComponent(a.id)}" class="text-decoration-none">
        <div class="border rounded p-3 list-item-hover" style="border-color: var(--bs-border-color) !important;">
            <div class="d-flex justify-content-between align-items-center mb-1">
                <h3 class="h6 mb-0 text-primary">${escapeHtml(a.title)}</h3>
                <span class="text-secondary small ms-3 text-nowrap">${escapeHtml(a.date)}</span>
            </div>
            <p class="text-secondary small mb-0">${escapeHtml(articleExcerpt(a))}</p>
        </div>
    </a>`;
}

/* ---------- Главная ---------- */

function initHome() {
    const box = document.getElementById('popular-articles-container');
    if (box) box.innerHTML = ARTICLES.slice(0, 3).map(createCardHTML).join('');
}

/* ---------- Блог + фильтры по тегам ---------- */

function initCatalog() {
    const box = document.getElementById('catalog-container');
    if (!box) return;

    const panel = document.getElementById('catalog-filters') || box.parentNode;
    const controls = document.createElement('div');
    controls.className = 'row g-2 align-items-end mb-3';
    panel.prepend(controls);

    let filters = document.getElementById('tag-filters');
    if (!filters) {
        filters = document.createElement('div');
        filters.id = 'tag-filters';
        panel.appendChild(filters);
    }
    filters.className = 'tag-filters d-flex flex-wrap gap-2';

    const counts = {};
    ARTICLES.forEach((a) => a.tags.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    const tags = Object.keys(counts).sort((x, y) => counts[y] - counts[x] || x.localeCompare(y, 'ru'));
    const authors = [...new Set(ARTICLES.map((a) => a.author).filter(Boolean))];
    let searchResultIds = null;
    const authorName = (id) => {
        const expert = typeof EXPERTS !== 'undefined' ? EXPERTS.find((e) => e.id === id) : null;
        return expert ? expert.name : id;
    };

    const monthIndex = {
        января: 0, февраля: 1, марта: 2, апреля: 3, мая: 4, июня: 5,
        июля: 6, августа: 7, сентября: 8, октября: 9, ноября: 10, декабря: 11
    };
    const parseArticleDate = (value) => {
        const match = value.match(/^(\d{1,2})\s+([а-яё]+)\s+(\d{4})$/i);
        if (!match) return null;
        const month = monthIndex[match[2].toLowerCase()];
        if (month === undefined) return null;
        return new Date(+match[3], month, +match[1]);
    };
    const validDate = (value) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
        const [year, month, day] = value.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    };
    const params = new URLSearchParams(location.search);

    let active = params.get('tag') || '';
    if (active && !counts[active]) active = '';
    let author = params.get('author') || '';
    if (author && !authors.includes(author)) author = '';
    let from = params.get('from') || '';
    let to = params.get('to') || '';
    if (!validDate(from)) from = '';
    if (!validDate(to)) to = '';
    let sort = params.get('sort') === 'oldest' ? 'oldest' : 'newest';

    controls.innerHTML = `
        <div class="col-12">
            <label class="form-label mb-1" for="catalog-author">Автор</label>
            <select class="form-select form-select-sm" id="catalog-author">
                <option value="">Все авторы</option>
                ${authors.map((id) => `<option value="${escapeHtml(id)}">${escapeHtml(authorName(id))}</option>`).join('')}
            </select>
        </div>
        <div class="col-6">
            <label class="form-label mb-1" for="catalog-date-from">С даты</label>
            <input class="form-control form-control-sm" type="date" id="catalog-date-from">
        </div>
        <div class="col-6">
            <label class="form-label mb-1" for="catalog-date-to">По дату</label>
            <input class="form-control form-control-sm" type="date" id="catalog-date-to">
        </div>
        <div class="col-12">
            <label class="form-label mb-1" for="catalog-sort">Сортировка</label>
            <select class="form-select form-select-sm" id="catalog-sort">
                <option value="newest">Сначала новые</option>
                <option value="oldest">Сначала старые</option>
            </select>
        </div>
        <div class="col-12">
            <button type="button" class="btn btn-outline-secondary btn-sm w-100" id="catalog-reset">Сбросить фильтры</button>
        </div>
        <div class="col-12">
            <small class="text-secondary" id="catalog-result-count" aria-live="polite"></small>
        </div>`;

    const authorSelect = controls.querySelector('#catalog-author');
    const fromInput = controls.querySelector('#catalog-date-from');
    const toInput = controls.querySelector('#catalog-date-to');
    const sortSelect = controls.querySelector('#catalog-sort');
    const resetButton = controls.querySelector('#catalog-reset');
    const resultCount = controls.querySelector('#catalog-result-count');
    authorSelect.value = author;
    fromInput.value = from;
    toInput.value = to;
    sortSelect.value = sort;

    function draw() {
        const startDate = from ? new Date(`${from}T00:00:00`) : null;
        const endDate = to ? new Date(`${to}T23:59:59.999`) : null;
        const candidates = ARTICLES.filter((a) => {
            if (searchResultIds && !searchResultIds.has(a.id)) return false;
            if (author && a.author !== author) return false;
            const date = parseArticleDate(a.date);
            if (startDate && (!date || date < startDate)) return false;
            if (endDate && (!date || date > endDate)) return false;
            return true;
        });
        const visibleCounts = {};
        candidates.forEach((a) => a.tags.forEach((tag) => (visibleCounts[tag] = (visibleCounts[tag] || 0) + 1)));
        const shown = candidates.filter((a) => !active || a.tags.includes(active)).sort((a, b) => {
            const dateA = parseArticleDate(a.date);
            const dateB = parseArticleDate(b.date);
            if (!dateA || !dateB) return 0;
            return sort === 'oldest' ? dateA - dateB : dateB - dateA;
        });

        filters.innerHTML =
            `<button type="button" class="tag-filter ${active ? '' : 'active'}" data-tag="">Все <span>${candidates.length}</span></button>` +
            tags
                .map(
                    (t) =>
                        `<button type="button" class="tag-filter ${t === active ? 'active' : ''}" data-tag="${escapeHtml(t)}">#${escapeHtml(t)} <span>${visibleCounts[t] || 0}</span></button>`
                )
                .join('');

        box.innerHTML = shown.length
            ? shown.map(createCardHTML).join('')
            : '<p class="text-secondary">По выбранным фильтрам ничего не найдено.</p>';
        resultCount.textContent = `Показано ${shown.length} из ${ARTICLES.length} материалов`;

        const url = new URL(location.href);
        active ? url.searchParams.set('tag', active) : url.searchParams.delete('tag');
        author ? url.searchParams.set('author', author) : url.searchParams.delete('author');
        from ? url.searchParams.set('from', from) : url.searchParams.delete('from');
        to ? url.searchParams.set('to', to) : url.searchParams.delete('to');
        sort === 'oldest' ? url.searchParams.set('sort', sort) : url.searchParams.delete('sort');
        history.replaceState(null, '', url);
    }

    document.addEventListener('article-search-results', (e) => {
        searchResultIds = e.detail.ids ? new Set(e.detail.ids) : null;
        draw();
    });

    const setTag = (t) => {
        active = t === active ? '' : t; // повторный клик снимает фильтр
        draw();
    };

    controls.addEventListener('change', (e) => {
        if (e.target === authorSelect) author = authorSelect.value;
        if (e.target === fromInput) from = fromInput.value;
        if (e.target === toInput) to = toInput.value;
        if (e.target === sortSelect) sort = sortSelect.value;
        draw();
    });
    resetButton.addEventListener('click', () => {
        active = '';
        author = '';
        from = '';
        to = '';
        sort = 'newest';
        authorSelect.value = '';
        fromInput.value = '';
        toInput.value = '';
        sortSelect.value = sort;
        draw();
    });

    filters.addEventListener('click', (e) => {
        const btn = e.target.closest('.tag-filter');
        if (btn) setTag(btn.dataset.tag);
    });
    // клик по тегу внутри карточки — тоже фильтр, без перезагрузки
    box.addEventListener('click', (e) => {
        const chip = e.target.closest('a.tag-chip');
        if (!chip) return;
        e.preventDefault();
        active = chip.dataset.tag;
        draw();
        filters.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    draw();
}

/* ---------- Страница статьи ---------- */

function initArticle() {
    const titleEl = document.getElementById('article-title');
    const contentEl = document.getElementById('article-content');
    if (!titleEl || !contentEl) return;

    const id = new URLSearchParams(location.search).get('id');
    const a = ARTICLES.find((x) => x.id === id) || ARTICLES[0];

    document.title = `${a.title} — InfoSecNews`;
    document.getElementById('article-date').textContent = a.date;
    titleEl.textContent = a.title;

    // Обложка и теги — над заголовком
    titleEl.insertAdjacentHTML('beforebegin', a.cover ? coverHTML(a, 'article-cover rounded mb-4') : '');
    if (a.tags.length) titleEl.insertAdjacentHTML('afterend', `<div class="d-flex flex-wrap gap-1 mb-4">${tagChipsHTML(a.tags)}</div>`);

    contentEl.innerHTML = renderArticleBody(a);

    // Ссылки на источники и автор — под текстом
    let after = '';
    if (a.links && a.links.length) {
        after += `<div class="article-sources mb-4"><h2 class="h5">Источники</h2><ul>` +
            a.links.map((l) => `<li><a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.title)}</a></li>`).join('') +
            `</ul></div>`;
    }
    const author = typeof EXPERTS !== 'undefined' ? EXPERTS.find((e) => e.id === a.author) : null;
    if (author) {
        after += `
        <a href="expert.html?id=${author.id}" class="author-box d-flex align-items-center gap-3 text-decoration-none text-reset">
            <img src="${escapeHtml(author.photo)}" alt="${escapeHtml(author.name)}" width="64" height="64"
                 class="rounded-circle object-fit-cover bg-secondary" style="object-position: top;">
            <div><div class="small text-secondary">Автор</div><div class="fw-semibold">${escapeHtml(author.name)}</div>
            <small class="text-secondary">${escapeHtml(author.role)}</small></div>
        </a>`;
    }
    contentEl.insertAdjacentHTML('afterend', after);

    const rec = document.getElementById('recommended-articles-container');
    if (rec) {
        // сначала статьи с общими тегами, затем остальные
        const shared = (x) => x.tags.filter((t) => a.tags.includes(t)).length;
        const others = ARTICLES.filter((x) => x.id !== a.id).sort((x, y) => shared(y) - shared(x));
        rec.innerHTML = others.slice(0, 3).map(createListItemHTML).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initHome();
    initCatalog();
    initArticle();
});
