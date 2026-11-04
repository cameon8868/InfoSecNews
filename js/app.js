// База данных статей
const articles = [
    {
        id: "binance-hack",
        title: "Binance потеряла $6,3 млрд из-за фейкового собеседования",
        badge: "Критический инцидент",
        badgeClass: "bg-danger",
        date: "29 октября 2026",
        content: "Хакеры группировки TraderTraitor (КНДР) обманули инженера, прислав вредоносное «тестовое задание». Это позволило им получить доступ к горячим кошелькам и вывести активы всего за 20 минут. Специалисты по безопасности отмечают, что атака была тщательно спланирована и использовала методы социальной инженерии. Ведется расследование инцидента, а Binance уже пообещала компенсировать убытки пользователям."
    },
    {
        id: "php-rce",
        title: "Критические RCE-уязвимости в PHP: атаки уже в дикой природе",
        badge: "Уязвимость",
        badgeClass: "bg-warning text-dark",
        date: "21 октября 2026",
        content: "CISA подтвердила эксплуатацию двух уязвимостей (CVE-2026-109618 и CVE-2026-109619). Они позволяют неавторизованному атакующему удаленно выполнить код на сервере (RCE). Оценка CVSS — 9.2. Системным администраторам настоятельно рекомендуется срочно обновить PHP до последней версии. Если это невозможно, следует использовать межсетевые экраны веб-приложений (WAF) для блокировки попыток эксплуатации."
    },
    {
        id: "mfa-checklist",
        title: "Настройка MFA: чек-лист для компаний",
        badge: "Практика",
        badgeClass: "bg-success",
        date: "8 июня 2026",
        content: "Многофакторная аутентификация (MFA) является одним из самых эффективных способов защиты учетных записей. В этом материале мы рассмотрим пошаговое руководство по внедрению MFA в корпоративной среде. Начните с определения критически важных систем, затем выберите подходящий метод (SMS, приложения-аутентификаторы или аппаратные ключи), и обязательно обучите сотрудников правилам использования."
    },
    {
        id: "server-rce",
        title: "Критический RCE в популярном сервере",
        badge: "Уязвимость",
        badgeClass: "bg-danger",
        date: "12 июня 2026",
        content: "Исследователи сообщили об уязвимости удалённого выполнения кода. Рекомендуется срочное обновление. Проблема затрагивает популярные конфигурации серверов и позволяет злоумышленникам получить полный контроль над системой. Эксплойты уже появились в открытом доступе, поэтому промедление с установкой патча может привести к компрометации данных."
    },
    {
        id: "phishing-trends",
        title: "Рост фишинговых атак на сотрудников",
        badge: "Аналитика",
        badgeClass: "bg-warning text-dark",
        date: "10 июня 2026",
        content: "Обзор трендов социальной инженерии и рекомендации по защите персонала. Злоумышленники все чаще используют персонализированные сообщения, выдавая себя за коллег или руководство. Регулярные тренинги по кибербезопасности и внедрение строгих политик проверки входящих запросов помогут снизить риски."
    }
];

// Функция для создания краткого текста (2 предложения + троеточие)
function getExcerpt(text) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length > 2) {
        return sentences.slice(0, 2).join(' ').trim() + '...';
    } else if (sentences.length > 0) {
        return sentences.join(' ').trim();
    }
    return text;
}

// Функция для генерации HTML карточки (для главной и новостей)
function createCardHTML(article) {
    return `
    <div class="col-12 col-md-6 col-lg-4">
        <div class="border rounded h-100 p-4 d-flex flex-column">
            <span class="badge ${article.badgeClass} mb-3 align-self-start">${article.badge}</span>
            <h3 class="h5">${article.title}</h3>
            <p class="text-muted flex-grow-1">
                ${getExcerpt(article.content)}
            </p>
            <p class="fw-bold mb-3">${article.date}</p>
            <a class="btn btn-primary mt-auto align-self-start" href="product.html?id=${article.id}">
                Читать
            </a>
        </div>
    </div>
    `;
}

// Функция для генерации элемента списка (для "Читайте также")
function createListItemHTML(article) {
    return `
    <a href="product.html?id=${article.id}" class="text-decoration-none">
        <div class="border rounded p-3 list-item-hover" style="background-color: var(--surface); border-color: var(--border) !important; transition: background-color 0.2s;">
            <div class="d-flex justify-content-between align-items-center mb-1">
                <h3 class="h6 mb-0 text-primary">${article.title}</h3>
                <span class="text-muted small ms-3 text-nowrap">${article.date}</span>
            </div>
            <p class="text-muted small mb-0">${getExcerpt(article.content)}</p>
        </div>
    </a>
    `;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    // 1. Главная страница (первые 3 статьи)
    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        const container = document.getElementById('popular-articles-container');
        if (container) {
            container.innerHTML = articles.slice(0, 3).map(createCardHTML).join('');
        }
    }

    // 2. Страница новостей (все статьи)
    if (path.includes('news.html')) {
        const container = document.getElementById('catalog-container');
        if (container) {
            container.innerHTML = articles.map(createCardHTML).join('');
        }
    }

    // 3. Страница отдельной статьи
    if (path.includes('product.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');
        
        // Находим текущую статью
        const currentArticle = articles.find(a => a.id === articleId) || articles[0];

        // Заполняем страницу
        document.getElementById('article-date').textContent = currentArticle.date;
        document.getElementById('article-title').textContent = currentArticle.title;
        
        // Оборачиваем текст в тег <p>, чтобы он отображался как нормальный абзац с отступами
        document.getElementById('article-content').innerHTML = `<p>${currentArticle.content}</p>`;
        
        document.title = `${currentArticle.title} — InfoSecNews`;

        // --- Генерация блока "Читайте также" ---
        const recContainer = document.getElementById('recommended-articles-container');
        if (recContainer) {
            // Берем другие статьи (исключаем текущую) и оставляем 3
            const recommended = articles.filter(a => a.id !== currentArticle.id).slice(0, 3);
            
            // Используем функцию для списка
            recContainer.innerHTML = recommended.map(createListItemHTML).join('');
        }
    }
});