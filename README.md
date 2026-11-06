# InfoSecNews

Учебный новостной сайт по информационной безопасности, разработанный на CSS-фреймворке Bootstrap 5. Сайт оформлен в кастомной тёмной теме, стилизованной под современные порталы о кибербезопасности.

> Контрольная работа №2. Тема: «CSS-фреймворки: разработка интерфейса на Bootstrap или альтернативном CSS-фреймворке».

## Страницы

| Файл | Описание |
|------|----------|
| `index.html` | Главная страница: hero-блок, преимущества, свежие материалы |
| `news.html` | Список новостей (карточки) |
| `product.html` | Страница отдельной статьи (характеристики, аккордеон) |
| `order.html` | Форма подписки на новости |
| `team.html` | Команда проекта |
| `contact.html` | Контакты |
| `Personal.html` | Обработка персональных данных |
| `Privacy.html` | Политика конфиденциальности |

## Реализовано

- единая Bootstrap-навигация на всех страницах (с выпадающим меню);
- компонент `card` для отображения новостей;
- метки статусов через `badge` (Уязвимость, Инцидент и т. д.);
- кнопки `btn` (primary, outline-primary);
- информационные сообщения `alert`;
- модальное окно `modal` для быстрой подписки;
- формы с классами `form-control`, `form-select`, `input-group`, `form-check`;
- `accordion` на странице статьи;
- «хлебные крошки» `breadcrumb`;
- адаптивные таблицы `table-responsive`;
- кастомные скрипты в папке `js/` (опишите, что именно делают).

## Тёмная тема

Тема построена на CSS-переменных (`--header-bg`, `--surface`, `--border` и др.). Стандартные компоненты Bootstrap (карточки, формы, таблицы, модальные окна, аккордеон) переопределены под единую палитру в `css/custom.css`.

## Технологии

- HTML5
- Bootstrap 5.3.3 (CDN)
- CSS3 (Custom Properties)
- JavaScript
- Git и GitHub

Bootstrap подключён через CDN:

- `bootstrap@5.3.3/dist/css/bootstrap.min.css`
- `bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js`

Файл `css/custom.css` подключается после Bootstrap для переопределения стилей.

## Структура проекта

​```
InfoSecNews/
├── css/
│   └── custom.css
├── js/
├── image/
├── index.html
├── news.html
├── product.html
├── order.html
├── team.html
├── contact.html
├── Personal.html
├── Privacy.html
├── README.md
└── .gitignore
​```
