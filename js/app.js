const articles = [
    {
        id: "binance-hack",
        title: "Binance потеряла $6,3 млрд из-за фейкового собеседования: подробности крупнейшей кражи",
        badge: "Критический инцидент",
        badgeClass: "bg-danger",
        date: "29 октября 2026",
        content: `Крупнейшая криптовалютная биржа Binance подтвердила потерю активов на сумму $6,3 млрд. Это крупнейшая кража в истории цифровых активов, которая потрясла весь рынок. Атака была совершена северокорейской хакерской группировкой TraderTraitor, известной своими связями с государственными структурами КНДР.

Злоумышленники использовали изощренный метод социальной инженерии. Они вышли на одного из ведущих инженеров безопасности под видом рекрутеров крупного IT-стартапа, предложив ему высокооплачиваемую должность. В ходе нескольких недель переписки инженеру было предложено выполнить «тестовое задание» — запустить код в изолированной среде для проверки его навыков.

На самом деле загруженный файл содержал вредоносное ПО, которое открыло хакерам бэкдор в корпоративную сеть. Получив доступ, группировка всего за 20 минут вывела средства с горячих кошельков, минуя системы холодного хранения. Специалисты по кибербезопасности отмечают, что это беспрецедентный случай, когда атака была настолько тщательно спланирована и использовала психологическое давление на сотрудника.

Руководство Binance уже пообещало полностью компенсировать убытки пользователям из собственных резервов и объявило о тотальном аудите внутренних систем безопасности. Компания также наняла сторонних экспертов для проверки процедур найма и тестирования сотрудников. Ведется расследование инцидента совместно с международными правоохранительными органами.`
    },
    {
        id: "php-rce",
        title: "Критические RCE-уязвимости в PHP: атаки уже в дикой природе, что делать",
        badge: "Уязвимость",
        badgeClass: "bg-warning text-dark",
        date: "21 октября 2026",
        content: `Агентство по кибербезопасности и инфраструктурной безопасности США (CISA) официально подтвердило факт активной эксплуатации двух критических уязвимостей в популярном языке программирования PHP. Уязвимости получили идентификаторы CVE-2026-109618 и CVE-2026-109619.

Обе бреши позволяют неавторизованному атакующему удаленно выполнить произвольный код на сервере (RCE — Remote Code Execution) без необходимости прохождения аутентификации. Оценка критичности по шкале CVSS составляет 9.2 из 10 возможных. Проблема затрагивает большинство современных веб-приложений, использующих фреймворки на базе PHP, включая популярные CMS.

Системным администраторам и DevOps-инженерам настоятельно рекомендуется срочно обновить PHP до последней стабильной версии. Если обновление невозможно в кратчайшие сроки, следует временно использовать межсетевые экраны веб-приложений (WAF) с правилами для блокировки известных сигнатур эксплойтов, а также ограничить доступ к уязвимым эндпоинтам по IP-адресам.

Эксперты отмечают, что злоумышленники начали сканировать интернет на наличие уязвимых серверов практически сразу после публикации информации о бреши. В некоторых случаях атаки приводили к полной компрометации сервера и установке вредоносного ПО для майнинга криптовалют или участия в бот-сетях.`
    },
    {
        id: "mfa-checklist",
        title: "Настройка MFA: подробный чек-лист для компаний на 2026 год",
        badge: "Практика",
        badgeClass: "bg-success",
        date: "8 июня 2026",
        content: `Многофакторная аутентификация (MFA) давно перестала быть просто рекомендацией и стала базовым стандартом безопасности для любой организации. В этом материале мы рассмотрим пошаговое руководство по внедрению MFA в корпоративной среде.

Первый шаг — инвентаризация. Определите критически важные системы (CRM, почта, VPN, админ-панели), к которым доступ должен быть защищен в первую очередь. Второй шаг — выбор метода аутентификации. SMS-коды уходят в прошлое из-за уязвимости к SIM-свопингу, на смену им приходят приложения-аутентификаторы (Google Authenticator, Microsoft Authenticator) и аппаратные ключи (YubiKey), обеспечивающие наивысший уровень защиты.

Третий шаг — обучение сотрудников. Важно объяснить, что MFA защищает не только компанию, но и личные данные сотрудников. Четвертый шаг — внедрение политики нулевого доверия (Zero Trust), где MFA требуется при каждом доступе к корпоративным ресурсам, а не только при входе в систему.

Не забудьте предусмотреть процедуру восстановления доступа на случай потери устройства — это частая головная боль службы поддержки. Лучшая практика — использование резервных кодов, которые хранятся в защищенном месте, и наличие второго устройства для аутентификации.`
    },
    {
        id: "server-rce",
        title: "Критический RCE в популярном сервере: экстренное обновление и меры защиты",
        badge: "Уязвимость",
        badgeClass: "bg-danger",
        date: "12 июня 2026",
        content: `Исследователи из лаборатории кибербезопасности сообщили об обнаружении уязвимости удалённого выполнения кода (RCE) в одном из самых популярных серверных решений. Проблема затрагивает широкий спектр конфигураций, используемых как в малом бизнесе, так и в крупных корпоративных сетях.

Уязвимость позволяет злоумышленникам получить полный контроль над системой, читать, изменять или удалять данные, а также использовать сервер как точку опоры для дальнейших атак внутри сети. Рекомендуется срочное обновление до последней версии. К сожалению, эксплойты для этой уязвимости уже появились в открытом доступе, а сканеры уязвимостей начали массово помечать уязвимые серверы в интернете.

Промедление с установкой патча может привести к компрометации конфиденциальных данных и финансовым потерям. Если обновление невозможно, рекомендуется временно отключить уязвимый сервис или изолировать сервер за межсетевым экраном, разрешив доступ только доверенным IP-адресам. Также стоит проверить логи на предмет подозрительной активности и сменить все пароли, которые могли быть скомпрометированы.`
    },
    {
        id: "phishing-trends",
        title: "Рост фишинговых атак на сотрудников: новые тренды 2026 года",
        badge: "Аналитика",
        badgeClass: "bg-warning text-dark",
        date: "10 июня 2026",
        content: `Ежегодный отчет по кибербезопасности показывает тревожную тенденцию: количество фишинговых атак на сотрудников выросло на 45% по сравнению с прошлым годом. Злоумышленники все чаще отходят от массовых рассылок и переходят к целевым атакам (spear phishing).

Они тщательно изучают социальные сети сотрудников, чтобы использовать персонализированные сообщения. Например, хакер может выдать себя за коллегу из соседнего отдела с просьбой срочно открыть документ по проекту. Также набирает обороты использование дипфейков — синтезированных видео и голосовых сообщений от имени руководства с требованием перевести средства или предоставить доступ.

В качестве рекомендаций эксперты советуют: регулярные тренинги по кибербезопасности с имитацией атак, внедрение строгих политик проверки входящих запросов (особенно финансовых), использование почтовых шлюзов с ИИ-фильтрацией и переход на аппаратные ключи безопасности, которые невозможно подделать фишинговыми сайтами.

Отдельно стоит упомянуть о фишинге в мессенджерах (Telegram, WhatsApp), который становится все более популярным. Злоумышленники взламывают аккаунты и рассылают сообщения от имени знакомых с просьбой одолжить денег или проголосовать в конкурсе.`
    },
    {
        id: "ai-supply-chain",
        title: "Хакеры внедряют вредоносный код в популярные AI-библиотеки: масштабная атака",
        badge: "Supply Chain",
        badgeClass: "bg-danger",
        date: "2 ноября 2026",
        content: `Крупная кампания по компрометации цепочки поставок (supply chain attack) затронула экосистему машинного обучения. Исследователи обнаружили несколько пакетов с открытым исходным кодом в репозиториях PyPI и npm, которые маскировались под популярные библиотеки для работы с нейросетями.

При установке такого пакета на компьютер разработчика скрытый скрипт собирал учетные данные, SSH-ключи и переменные окружения, после чего отправлял их на сервер злоумышленников. По оценкам экспертов, пакеты были скачаны более 50 000 раз за последние две недели.

Разработчикам настоятельно рекомендуется провести аудит зависимостей в своих проектах, проверить целостность хэш-сумм пакетов и использовать инструменты сканирования на предмет вредоносного кода (SCA), а также включить двухфакторную аутентификацию в репозиториях.

Эта атака показала, насколько уязвима современная экосистема open-source. Даже опытные разработчики могут стать жертвой злоумышленников, которые создают пакеты с похожими названиями (typosquatting) или взламывают аккаунты мейнтейнеров популярных библиотек.`
    },
    {
        id: "quantum-crypto",
        title: "NIST предупреждает: готовьтесь к постквантовому шифрованию уже сейчас",
        badge: "Будущее",
        badgeClass: "bg-info text-dark",
        date: "1 ноября 2026",
        content: `Национальный институт стандартов и технологий США (NIST) выпустил официальное предупреждение для всех организаций, использующих криптографию. В связи с быстрым прогрессом в создании квантовых компьютеров, существующие алгоритмы шифрования (RSA, ECC) могут быть взломаны в ближайшие 10-15 лет.

Особую опасность это представляет для данных, которые должны оставаться конфиденциальными длительное время (государственная тайна, медицинские записи, финансовые транзакции). Атака типа «собери сейчас — расшифруй потом» (harvest now, decrypt later) позволяет злоумышленникам скачивать зашифрованный трафик сегодня, чтобы расшифровать его, когда появятся квантовые компьютеры.

NIST рекомендует уже сейчас начинать миграцию на постквантовые алгоритмы шифрования (PQC), которые были стандартизированы в 2024 году. Крупным компаниям и государственным структурам стоит включить этот пункт в стратегию кибербезопасности на 2027–2030 годы.

Переход будет постепенным: сначала гибридные схемы (классическая криптография + PQC), затем полный переход на новые алгоритмы. Важно начать инвентаризацию криптографических систем уже сегодня, чтобы не оказаться в ситуации, когда данные уже украдены, а защитить их было нечем.`
    },
    {
        id: "zero-day-windows",
        title: "Эксплойт нулевого дня для Windows продается на теневых форумах за $2,5 млн",
        badge: "Zero-Day",
        badgeClass: "bg-danger",
        date: "4 ноября 2026",
        content: `На одном из закрытых хакерских форумов появилось объявление о продаже эксплойта нулевого дня (zero-day) для операционной системы Windows. Уязвимость якобы позволяет повысить привилегии в системе и обойти механизмы защиты, такие как Secure Boot и Device Guard.

Продавец запрашивает $2,5 млн за эксклюзивный доступ к эксплойту. Хотя независимые исследователи пока не подтвердили подлинность уязвимости, Microsoft уже начала внутреннее расследование. Эксперты по безопасности не исключают, что это может быть как реальная угроза, так и мошенничество.

В любом случае, организациям рекомендуется усилить мониторинг конечных точек (EDR), ограничить права локальных администраторов и следить за обновлениями безопасности от Microsoft. Если уязвимость будет подтверждена, она может затронуть миллионы компьютеров по всему миру.

История знает случаи, когда подобные объявления оказывались правдой. Например, в 2021 году эксплойт для Windows 10 был продан за $1,5 млн, а через несколько месяцев Microsoft выпустила экстренный патч. Поэтому игнорировать такие сигналы не стоит — лучше заранее усилить защиту.`
    }
];

// Функция для создания краткого текста (ограничение по символам)
function getExcerpt(text, maxLength = 160) {
    const trimmed = text.trim();
    if (trimmed.length <= maxLength) {
        return trimmed;
    }
    let cutIndex = trimmed.lastIndexOf(' ', maxLength);
    if (cutIndex === -1) {
        cutIndex = maxLength;
    }
    return trimmed.substring(0, cutIndex).trim() + '...';
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
        
        // Разбиваем текст по переносам строк, убираем пустые строки и оборачиваем каждую в <p>
        const rawContent = currentArticle.content.trim();
        let htmlContent = '';

        if (rawContent.includes('\n')) {
            htmlContent = rawContent
                .split('\n')
                .map(p => p.trim())
                .filter(p => p.length > 0)
                .map(p => `<p>${p}</p>`)
                .join('');
        } else {
            const sentences = rawContent.match(/[^.!?]+[.!?]+/g) || [rawContent];
            const chunks = [];
            for (let i = 0; i < sentences.length; i += 3) {
                chunks.push(sentences.slice(i, i + 3).join(' ').trim());
            }
            htmlContent = chunks.map(p => `<p>${p}</p>`).join('');
        }

        // Вставляем в HTML
        document.getElementById('article-content').innerHTML = htmlContent;

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

// ============================================================
// 1. ФУНКЦИИ ДЛЯ TF-IDF (КЛИЕНТСКИЙ ПОИСК)
// ============================================================

// Очистка и токенизация текста (поддержка кириллицы)
function tokenize(text) {
    // Приводим к нижнему регистру, оставляем только буквы и цифры
    const clean = text.toLowerCase().replace(/[^a-zа-яё0-9\s]/g, ' ');
    // Разбиваем по пробелам и убираем слова короче 2 символов
    return clean.split(/\s+/).filter(word => word.length > 1);
}

// Построение TF-IDF модели
function buildTfIdfModel(docs) {
    const vocab = new Set();
    const docTokens = docs.map(doc => {
        // Ищем по заголовку и тексту вместе
        const text = doc.title + " " + doc.content;
        const tokens = tokenize(text);
        tokens.forEach(t => vocab.add(t));
        return tokens;
    });

    const vocabArray = Array.from(vocab);
    const wordToIdx = {};
    vocabArray.forEach((word, idx) => wordToIdx[word] = idx);

    const N = docs.length; // Количество документов
    const vocabSize = vocabArray.length;

    // Считаем IDF для каждого слова (сколько документов содержат это слово)
    const df = new Array(vocabSize).fill(0);
    docTokens.forEach(tokens => {
        const uniqueTokens = new Set(tokens);
        uniqueTokens.forEach(token => {
            df[wordToIdx[token]]++;
        });
    });

    const idf = df.map(freq => Math.log(N / (freq + 1))); // +1 для сглаживания

    // Считаем TF-IDF векторы для каждого документа
    const docVectors = docTokens.map(tokens => {
        const vector = new Array(vocabSize).fill(0);
        const wordCounts = {};
        tokens.forEach(t => wordCounts[t] = (wordCounts[t] || 0) + 1);
        
        const totalWords = tokens.length || 1;
        
        for (const [word, count] of Object.entries(wordCounts)) {
            const idx = wordToIdx[word];
            const tf = count / totalWords;
            vector[idx] = tf * idf[idx];
        }
        return vector;
    });

    return { vocabArray, wordToIdx, idf, docVectors, vocabSize };
}

// Косинусное сходство
function cosineSimilarity(vecA, vecB) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Поиск
function searchTfIdf(query, model) {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    const queryVector = new Array(model.vocabSize).fill(0);
    const wordCounts = {};
    queryTokens.forEach(t => wordCounts[t] = (wordCounts[t] || 0) + 1);
    
    const totalWords = queryTokens.length;

    for (const [word, count] of Object.entries(wordCounts)) {
        const idx = model.wordToIdx[word];
        if (idx !== undefined) {
            const tf = count / totalWords;
            queryVector[idx] = tf * model.idf[idx];
        }
    }

    const results = [];
    model.docVectors.forEach((docVec, index) => {
        const score = cosineSimilarity(queryVector, docVec);
        if (score > 0) {
            results.push({ index, score });
        }
    });

    return results.sort((a, b) => b.score - a.score);
}

// ============================================================
// 2. ЛОГИКА ИНТЕРФЕЙСА ПОИСКА
// ============================================================

// Инициализируем модель при загрузке
let searchModel = null;

document.addEventListener('DOMContentLoaded', () => {
    // Строим модель на основе массива articles
    searchModel = buildTfIdfModel(articles);

    const searchInput = document.getElementById('newsSearchInput');
    const resultsContainer = document.getElementById('newsSearchResults');
    const loader = document.getElementById('newsLoader');
    
    if (!searchInput) return; // Если на странице нет поиска, выходим

    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();

        if (query.length < 2) {
            resultsContainer.classList.remove('active');
            return;
        }

        loader.style.display = 'block';
        
        // Небольшая задержка для визуального эффекта (на деле поиск мгновенный)
        debounceTimer = setTimeout(() => {
            const results = searchTfIdf(query, searchModel);
            loader.style.display = 'none';

            if (results.length === 0) {
                resultsContainer.innerHTML = `<div class="no-results">Ничего не найдено 😔</div>`;
            } else {
                // Берем топ-5 результатов
                resultsContainer.innerHTML = results.slice(0, 5).map(res => {
                    const article = articles[res.index];
                    // Переводим скор в проценты (максимальный скор берем за 100%)
                    const maxScore = results[0].score;
                    const percent = Math.round((res.score / maxScore) * 100);
                    
                    return `
                    <div class="result-item" onclick="window.location.href='product.html?id=${article.id}'">
                        <div class="result-header">
                            <span class="result-score">Совпадение: ${percent}%</span>
                        </div>
                        <div class="result-snippet">
                            <strong style="color:#2fa4b6">${article.title}</strong><br>
                            ${getExcerpt(article.content)}
                        </div>
                    </div>
                    `;
                }).join('');
            }
            resultsContainer.classList.add('active');
        }, 200);
    });

    // Закрытие при клике вне
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            resultsContainer.classList.remove('active');
        }
    });
});