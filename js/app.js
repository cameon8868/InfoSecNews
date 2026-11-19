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

    let filters = document.getElementById('tag-filters');
    if (!filters) {
        filters = document.createElement('div');
        filters.id = 'tag-filters';
        box.parentNode.insertBefore(filters, box);
    }
    filters.className = 'tag-filters d-flex flex-wrap gap-2 mb-4';

    const counts = {};
    ARTICLES.forEach((a) => a.tags.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    const tags = Object.keys(counts).sort((x, y) => counts[y] - counts[x] || x.localeCompare(y, 'ru'));

    let active = new URLSearchParams(location.search).get('tag') || '';
    if (active && !counts[active]) active = '';

    function draw() {
        const shown = active ? ARTICLES.filter((a) => a.tags.includes(active)) : ARTICLES;

        filters.innerHTML =
            `<button type="button" class="tag-filter ${active ? '' : 'active'}" data-tag="">Все <span>${ARTICLES.length}</span></button>` +
            tags
                .map(
                    (t) =>
                        `<button type="button" class="tag-filter ${t === active ? 'active' : ''}" data-tag="${escapeHtml(t)}">#${escapeHtml(t)} <span>${counts[t]}</span></button>`
                )
                .join('');

        box.innerHTML = shown.length
            ? shown.map(createCardHTML).join('')
            : '<p class="text-secondary">По этому тегу пока ничего нет.</p>';

        const url = new URL(location.href);
        active ? url.searchParams.set('tag', active) : url.searchParams.delete('tag');
        history.replaceState(null, '', url);
    }

    const setTag = (t) => {
        active = t === active ? '' : t; // повторный клик снимает фильтр
        draw();
    };

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
