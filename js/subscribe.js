/*
 * js/subscribe.js — модальное окно подписки на любой странице.
 * Окно создаётся скриптом, копировать HTML-разметку в каждую страницу не нужно.
 * Открывается любым элементом с data-bs-target="#subscribeModal" (как ссылка в футере)
 * или с атрибутом data-subscribe.
 * Подключать после bootstrap.bundle.min.js.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Если на странице осталась старая копия окна (privacy.html) — убираем её
    document.querySelectorAll('#subscribeModal').forEach((el) => el.remove());

    const BODY_HTML = `
        <div class="alert alert-info" role="alert">
            Заполните форму, чтобы получать дайджест угроз.
        </div>
        <form id="subscribeForm" novalidate>
            <div class="row g-3">
                <div class="col-12 col-md-6">
                    <label for="sub-name" class="form-label">Имя *</label>
                    <input id="sub-name" name="name" type="text" class="form-control" autocomplete="name" required>
                    <div class="invalid-feedback">Укажите имя.</div>
                </div>
                <div class="col-12 col-md-6">
                    <label for="sub-email" class="form-label">E-mail *</label>
                    <input id="sub-email" name="email" type="email" class="form-control" autocomplete="email" required>
                    <div class="invalid-feedback">Укажите корректный e-mail.</div>
                </div>
                <div class="col-12 col-md-6">
                    <label for="sub-phone" class="form-label">Телефон</label>
                    <div class="input-group">
                        <span class="input-group-text">+7</span>
                        <input id="sub-phone" name="phone" type="tel" class="form-control" placeholder="900 000-00-00" autocomplete="tel-national">
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <label for="sub-plan" class="form-label">Тип подписки</label>
                    <select id="sub-plan" name="plan" class="form-select">
                        <option value="basic" selected>Базовый (раз в неделю)</option>
                        <option value="premium">Премиум (каждый день)</option>
                    </select>
                </div>
                <div class="col-12">
                    <div class="form-check">
                        <input id="sub-agree" name="agree" class="form-check-input" type="checkbox" required>
                        <label class="form-check-label" for="sub-agree">
                            Я согласен на <a href="personal-data.html" target="_blank" rel="noopener">обработку персональных данных</a> *
                        </label>
                        <div class="invalid-feedback">Необходимо согласие.</div>
                    </div>
                </div>
            </div>
        </form>`;

    const FOOTER_HTML = `
        <button class="btn btn-outline-secondary" type="button" data-bs-dismiss="modal">Отмена</button>
        <button class="btn btn-primary" type="submit" form="subscribeForm">Подписаться</button>`;

    document.body.insertAdjacentHTML('beforeend', `
        <div class="modal fade" id="subscribeModal" tabindex="-1" aria-labelledby="subscribeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title h4" id="subscribeModalLabel">Подписка на дайджест</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                    </div>
                    <div class="modal-body">${BODY_HTML}</div>
                    <div class="modal-footer">${FOOTER_HTML}</div>
                </div>
            </div>
        </div>`);

    const modalEl = document.getElementById('subscribeModal');
    const bodyEl = modalEl.querySelector('.modal-body');
    const footerEl = modalEl.querySelector('.modal-footer');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    // Любая кнопка/ссылка с data-subscribe открывает окно (href="order.html" при этом не срабатывает)
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-subscribe]');
        if (trigger) { e.preventDefault(); modal.show(); }
    });

    // Отправка (делегирование: форма пересоздаётся после успешной отправки)
    modalEl.addEventListener('submit', (e) => {
        if (e.target.id !== 'subscribeForm') return;
        e.preventDefault();
        const form = e.target;

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const data = Object.fromEntries(new FormData(form).entries());
        // TODO: реальная отправка, например:
        // fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        console.log('Подписка:', data);

        bodyEl.innerHTML = `
            <div class="text-center py-4">
                <div class="display-6 mb-2">✅</div>
                <p class="mb-0">Спасибо, ${escapeHtmlSafe(data.name)}! Вы подписаны на дайджест.</p>
            </div>`;
        footerEl.innerHTML = '<button class="btn btn-primary" type="button" data-bs-dismiss="modal">Закрыть</button>';
    });

    // После закрытия возвращаем форму в исходный вид (без перезагрузки страницы)
    modalEl.addEventListener('hidden.bs.modal', () => {
        bodyEl.innerHTML = BODY_HTML;
        footerEl.innerHTML = FOOTER_HTML;
    });

    function escapeHtmlSafe(s) {
        return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }
});
