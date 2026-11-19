/*
 * js/experts.js
 * 1) На expert.html рисует подробную страницу эксперта по ?id=...
 * 2) На index.html и team.html сам делает карточки экспертов ссылками на их страницы
 *    (сопоставление по имени в заголовке карточки — HTML править не нужно).
 * Порядок: Articles.js → articles-meta.js → experts-data.js → app.js → experts.js → effects.js
 */
(() => {
    const esc = (s) => escapeHtml(s);

    function linkExpertCards() {
        EXPERTS.forEach((e) => {
            document.querySelectorAll('h3').forEach((h) => {
                if (h.textContent.trim() !== e.name) return;
                const href = `expert.html?id=${e.id}`;
                const a = h.closest('a');
                if (a) { a.href = href; return; }               // главная: вся карточка — ссылка
                const body = h.closest('.card-body');
                if (body && !body.querySelector('.expert-more')) {
                    body.insertAdjacentHTML('beforeend',
                        `<a class="btn btn-outline-primary btn-sm mt-3 expert-more" href="${href}">Подробнее</a>`);
                }
            });
        });
    }

    function renderExpertPage(root) {
        const id = new URLSearchParams(location.search).get('id');
        const e = EXPERTS.find((x) => x.id === id);

        if (!e) {
            root.innerHTML = `
                <h2 class="page-title display-6 mb-3">Эксперт не найден</h2>
                <p class="text-secondary">Выберите эксперта из списка на странице <a href="team.html">«Наши эксперты»</a>.</p>`;
            return;
        }

        document.title = `${e.name} — InfoSecNews`;
        const works = ARTICLES.filter((a) => a.author === e.id);
        const stats = [...e.stats, { value: String(works.length), label: 'материалов на сайте' }];
        const others = EXPERTS.filter((x) => x.id !== e.id);

        root.innerHTML = `
            <nav aria-label="breadcrumb" class="mb-4">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="team.html">Наши эксперты</a></li>
                    <li class="breadcrumb-item active" aria-current="page">${esc(e.name)}</li>
                </ol>
            </nav>

            <section class="row g-4 align-items-center mb-5">
                <div class="col-12 col-md-4 col-lg-3 text-center">
                    <span class="avatar-ring mx-auto">
                        <img src="${esc(e.photo)}" alt="${esc(e.name)}" width="200" height="200"
                             class="rounded-circle object-fit-cover bg-secondary" style="object-position: top;">
                    </span>
                </div>
                <div class="col-12 col-md-8 col-lg-9">
                    <span class="badge ${esc(e.badgeClass)} mb-2">${esc(e.role)}</span>
                    <h2 class="display-5 fw-bold mb-2">${esc(e.name)}</h2>
                    <p class="lead text-secondary mb-3">${esc(e.short)}</p>
                    ${e.quote ? `<blockquote class="article-quote mb-3">${esc(e.quote)}</blockquote>` : ''}
                    <div class="d-flex flex-wrap gap-2">
                        ${e.links.map((l) => `<a class="btn btn-outline-primary btn-sm" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.title)}</a>`).join('')}
                        <a class="btn btn-primary btn-sm" href="contact.html">Написать редакции</a>
                    </div>
                </div>
            </section>

            <section class="row g-3 mb-5 text-center">
                ${stats.map((s) => `
                    <div class="col-6 col-md-3">
                        <div class="card h-100"><div class="card-body">
                            <div class="stat-number">${esc(s.value)}</div>
                            <small class="text-secondary">${esc(s.label)}</small>
                        </div></div>
                    </div>`).join('')}
            </section>

            <section class="row g-5 mb-5">
                <div class="col-12 col-lg-7">
                    <h3 class="h4 mb-3">Об эксперте</h3>
                    ${e.bio.map((p) => `<p class="fs-5 lh-lg">${p}</p>`).join('')}

                    <h3 class="h5 mt-4 mb-3">Компетенции</h3>
                    <div class="d-flex flex-wrap gap-2">
                        ${e.skills.map((s) => `<span class="badge rounded-pill text-bg-secondary fw-normal px-3 py-2">${esc(s)}</span>`).join('')}
                    </div>

                    <h3 class="h5 mt-4 mb-3">Достижения</h3>
                    <ul class="achievements">
                        ${e.achievements.map((a) => `<li><span class="ach-icon">${a.icon}</span><span>${esc(a.text)}</span></li>`).join('')}
                    </ul>
                </div>

                <div class="col-12 col-lg-5">
                    <h3 class="h4 mb-3">Путь</h3>
                    <ol class="timeline">
                        ${e.timeline.map((t) => `
                            <li>
                                <div class="timeline-year">${esc(t.year)}</div>
                                <div class="fw-semibold">${esc(t.title)}</div>
                                <small class="text-secondary">${esc(t.text)}</small>
                            </li>`).join('')}
                    </ol>
                </div>
            </section>

            <section class="mb-5">
                <h3 class="h4 mb-3">Материалы автора</h3>
                ${works.length
                    ? `<div class="row g-4">${works.map(createCardHTML).join('')}</div>`
                    : '<p class="text-secondary">Пока нет материалов, привязанных к этому эксперту.</p>'}
            </section>

            <section>
                <h3 class="h5 mb-3">Другие эксперты</h3>
                <div class="row g-3">
                    ${others.map((o) => `
                        <div class="col-12 col-md-4">
                            <a href="expert.html?id=${o.id}" class="card hover-lift text-decoration-none text-reset h-100">
                                <div class="card-body d-flex align-items-center gap-3">
                                    <img src="${esc(o.photo)}" alt="${esc(o.name)}" width="56" height="56"
                                         class="rounded-circle object-fit-cover bg-secondary" style="object-position: top;">
                                    <div><div class="fw-semibold">${esc(o.name)}</div><small class="text-secondary">${esc(o.role)}</small></div>
                                </div>
                            </a>
                        </div>`).join('')}
                </div>
            </section>`;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const root = document.getElementById('expert-root');
        if (root) renderExpertPage(root);
        else linkExpertCards();
    });
})();
