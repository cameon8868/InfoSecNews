/*
 * Метаданные статей. Ключ — id статьи из js/Articles.js.
 * Любое поле здесь ПЕРЕКРЫВАЕТ поле статьи (можно переопределить даже content).
 *
 * Поля:
 *   tags       — массив тегов (для фильтров и карточек)
 *   author     — id эксперта из js/experts-data.js
 *   cover      — путь к обложке (карточка + начало статьи)
 *   coverAlt   — alt для обложки
 *   excerpt    — своё краткое описание для карточки (иначе берётся начало текста)
 *   links      — блок «Источники»: [{ title, url }]
 *   extraHtml  — любой HTML, который выводится ПОСЛЕ основного текста
 *                (картинки, <figure>, <blockquote>, ссылки, видео-iframe и т. д.)
 *
 * В самом content тоже можно писать HTML: если в тексте есть теги,
 * он выводится как есть, иначе — как обычный текст по абзацам.
 */
window.ARTICLE_META = {
    "binance-hack": {
        tags: ["Инциденты", "Криптовалюты", "Социальная инженерия"],
        author: "anna",
        excerpt: "Северокорейская группировка TraderTraitor вывела $6,3 млрд за 20 минут — через фейковое собеседование.",
        links: [
            { title: "Заявление Binance (пример ссылки)", url: "https://www.binance.com/" },
            { title: "CISA: северокорейские APT", url: "https://www.cisa.gov/" }
        ],
        extraHtml: `
            <blockquote class="article-quote">
                «Самое слабое звено — не код, а человек, которому предлагают работу мечты».
                <footer>Комментарий эксперта</footer>
            </blockquote>
            <p>Подробнее о приёмах группировки — в <a href="news.html?tag=Социальная%20инженерия">материалах по социальной инженерии</a>.</p>
        `
    },
    "php-rce": {
        tags: ["Уязвимости", "RCE", "CISA"],
        author: "yan"
    },
    "mfa-checklist": {
        tags: ["Практика", "MFA", "Гайды"],
        author: "ruslan"
    },
    "server-rce": {
        tags: ["Уязвимости", "RCE"],
        author: "linus"
    },
    "phishing-trends": {
        tags: ["Фишинг", "Аналитика", "Социальная инженерия"],
        author: "anna"
    },
    "ai-supply-chain": {
        tags: ["Supply Chain", "Open Source", "Инциденты"],
        author: "yan"
    },
    "quantum-crypto": {
        tags: ["Криптография", "NIST", "Аналитика"],
        author: "linus"
    },
    "zero-day-windows": {
        tags: ["Уязвимости", "Zero-Day", "Windows"],
        author: "yan"
    }
};
