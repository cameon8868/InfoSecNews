document.addEventListener('DOMContentLoaded', () => {
  const modalEl = document.getElementById('subscribeModal');
  if (!modalEl) return;

  const form = document.getElementById('subscribeForm');
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Встроенная валидация Bootstrap
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    console.log('Отправка:', data);

    // Успех
    const body = modalEl.querySelector('.modal-body');
    const footer = modalEl.querySelector('.modal-footer');
    body.innerHTML = `
      <div class="text-center py-4">
        <div class="display-6 mb-2">✅</div>
        <p class="mb-0">Спасибо! Вы подписаны на дайджест.</p>
      </div>`;
    footer.innerHTML = `<button class="btn btn-primary" data-bs-dismiss="modal">Закрыть</button>`;

    // Сброс формы после закрытия
    modalEl.addEventListener('hidden.bs.modal', function reset() {
      modalEl.removeEventListener('hidden.bs.modal', reset);
      location.reload(); // или аккуратный сброс без перезагрузки
    }, { once: true });
  });
});