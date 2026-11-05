// Подключай в конце <body> ПОСЛЕ app.js:
// <script src="js/effects.js"></script>
document.addEventListener('DOMContentLoaded', () => {

    // 1. Полоса прогресса прокрутки
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.appendChild(bar);

    // 2. Кнопка «Наверх»
    const topBtn = document.createElement('button');
    topBtn.id = 'back-to-top';
    topBtn.type = 'button';
    topBtn.setAttribute('aria-label', 'Наверх');
    topBtn.textContent = '^';
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(topBtn);

    window.addEventListener('scroll', () => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
        topBtn.classList.toggle('show', h.scrollTop > 400);
    }, { passive: true });

    // 3. Плавное появление блоков с классом .reveal
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });
        reveals.forEach((el, i) => {
            el.style.transitionDelay = (i % 4) * 80 + 'ms'; // лёгкая «лесенка»
            io.observe(el);
        });
    } else {
        reveals.forEach(el => el.classList.add('visible'));
    }

    // 4. Счётчики: <span data-count="120">0</span>
    const counters = document.querySelectorAll('[data-count]');
    const countIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const target = +el.dataset.count;
            const start = performance.now();
            const dur = 1200;
            const tick = (now) => {
                const p = Math.min((now - start) / dur, 1);
                el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            countIO.unobserve(el);
        });
    }, { threshold: 0.5 });
    counters.forEach(c => countIO.observe(c));
});