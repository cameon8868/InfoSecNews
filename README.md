# InfoSecNews

Учебный сайт о новостях и практиках информационной безопасности. Интерфейс адаптирован для мобильных устройств и оформлен в тёмной теме на Bootstrap 5.

> Контрольная работа №2. Тема: «CSS-фреймворки: разработка интерфейса на Bootstrap или альтернативном CSS-фреймворке».

<p align="center">
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img alt="Bootstrap 5" src="https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white">
</p>
<p align="center">
  <img alt="Transformers.js" src="https://img.shields.io/badge/Transformers.js-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black">
  <img alt="ONNX Runtime Web" src="https://img.shields.io/badge/ONNX_Runtime_Web-005CED?style=for-the-badge&logo=onnx&logoColor=white">
</p>

## Возможности

- Главная страница с подборкой материалов, информацией о проекте и FAQ.
- Блог с адаптивными карточками, локальными SVG-обложками и отдельными страницами статей.
- Поиск по статьям в режимах **TF-IDF**, **SBERT** и **Гибрид**.
- Выдвижная панель фильтров по тегам, автору и датам, сортировка по дате и сброс фильтров.
- Карточки и страницы экспертов.
- Модальное окно подписки и отдельная страница формы подписки.
- Страницы контактов, обработки персональных данных и политики конфиденциальности.

## Страницы

| Файл | Назначение |
|---|---|
| `index.html` | Главная страница и FAQ |
| `news.html` | Каталог материалов, поиск и фильтры |
| `product.html?id=<id>` | Страница статьи; идентификатор берётся из каталога |
| `team.html` | Список экспертов |
| `expert.html?id=<id>` | Страница эксперта |
| `order.html` | Форма подписки |
| `contact.html` | Контакты и форма сообщения |
| `Personal.html` | Обработка персональных данных |
| `Privacy.html` | Политика конфиденциальности |

## Обложки статей

Локальные SVG-обложки для карточек блога и страниц материалов находятся в `image/covers/`. Пути к изображениям и их альтернативные описания задаются в `js/articles-meta.js`.

## Данные и поиск

Тексты статей находятся в `js/Articles.js`. Теги, авторы, обложки и ссылки на источники хранятся отдельно в `js/articles-meta.js`; данные экспертов — в `js/experts-data.js`. Материалы загружаются из файлов проекта: новостная лента не подключена к RSS, API или внешним новостным сайтам.

`js/search.js` добавляет к каталогу три режима поиска:

- **TF-IDF** — поиск по совпадению слов;
- **SBERT** — семантический поиск с мультиязычной моделью;
- **Гибрид** — объединение результатов TF-IDF и SBERT с настраиваемым весом.

Режим TF-IDF работает без загрузки модели. Модель SBERT загружается с CDN при первом выборе SBERT или гибридного режима; после загрузки браузер может кэшировать её и векторы статей.

## Запуск

Это статический сайт: сборка и установка npm-пакетов не требуются. Для локального запуска из корневой папки проекта используйте Python:

```powershell
py -m http.server 8000
```

Затем откройте <http://localhost:8000>. Если команда `py` недоступна, можно запустить проект через расширение VS Code Live Server.

Bootstrap подключается с jsDelivr. Для загрузки модели SBERT также требуется доступ к CDN; остальной каталог статей хранится локально в проекте.

## Технологии

- **HTML5, CSS3 и JavaScript (ES6+)** — разметка, стили и логика сайта без сборщика;
- **Bootstrap 5.3.3** — адаптивная сетка и UI-компоненты;
- **Transformers.js** — загрузка и применение мультиязычной модели для SBERT-поиска;
- **ONNX Runtime Web** — выполнение модели непосредственно в браузере;
- **SVG** — масштабируемые локальные иллюстрации для материалов.

## Структура проекта

```text
InfoSecNews/
├── css/
│   ├── custom.css
│   ├── effects.css
│   └── extra.css
├── image/
│   └── covers/         # SVG-обложки статей
├── js/
│   ├── Articles.js
│   ├── app.js
│   ├── articles-meta.js
│   ├── effects.js
│   ├── experts-data.js
│   ├── experts.js
│   ├── search.js
│   └── subscribe.js
├── index.html
├── news.html
├── product.html
├── team.html
├── expert.html
├── order.html
├── contact.html
├── Personal.html
└── Privacy.html
```
