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
        cover: "image/covers/binance-hack.svg",
        coverAlt: "Кража криптовалюты после фейкового собеседования",
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
        author: "yan",
        cover: "image/covers/php-rce.svg",
        coverAlt: "Критическая уязвимость PHP"
    },
    "mfa-checklist": {
        tags: ["Практика", "MFA", "Гайды"],
        author: "ruslan",
        cover: "image/covers/mfa-checklist.svg",
        coverAlt: "Многофакторная аутентификация"
    },
    "server-rce": {
        tags: ["Уязвимости", "RCE"],
        author: "linus",
        cover: "image/covers/server-rce.svg",
        coverAlt: "Атака RCE на сервер"
    },
    "phishing-trends": {
        tags: ["Фишинг", "Аналитика", "Социальная инженерия"],
        author: "anna",
        cover: "image/covers/phishing-trends.svg",
        coverAlt: "Фишинговое письмо сотруднику"
    },
    "ai-supply-chain": {
        tags: ["Supply Chain", "Open Source", "Инциденты"],
        author: "yan",
        cover: "image/covers/ai-supply-chain.svg",
        coverAlt: "Компрометация цепочки поставок AI-библиотек"
    },
    "quantum-crypto": {
        tags: ["Криптография", "NIST", "Аналитика"],
        author: "linus",
        cover: "image/covers/quantum-crypto.svg",
        coverAlt: "Постквантовое шифрование"
    },
    "zero-day-windows": {
        tags: ["Уязвимости", "Zero-Day", "Windows"],
        author: "yan",
        cover: "image/covers/zero-day-windows.svg",
        coverAlt: "Уязвимость нулевого дня в Windows"
    }
};
