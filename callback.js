const CALLBACK_MODAL_ID = 'callbackModal';

function createCallbackModal() {
  if (document.getElementById(CALLBACK_MODAL_ID)) return;

  const modal = document.createElement('div');
  modal.id = CALLBACK_MODAL_ID;
  modal.className = 'callback-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="callback-backdrop" data-callback-close></div>
    <section class="callback-dialog" role="dialog" aria-modal="true" aria-labelledby="callbackTitle">
      <button class="callback-close" type="button" aria-label="Закрыть окно" data-callback-close>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      </button>
      <p class="callback-label">Обратный звонок</p>
      <h3 id="callbackTitle">Оставьте номер телефона</h3>
      <p class="callback-text">Менеджер FORMA свяжется с вами в течение рабочего дня.</p>
      <form class="callback-form" novalidate>
        <label for="callbackPhone">Телефон</label>
        <input id="callbackPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (999) 123-45-67" required />
        <span class="callback-error" aria-live="polite"></span>
        <button class="btn-primary callback-submit" type="submit">Заказать звонок</button>
      </form>
      <div class="callback-success" hidden>
        <div class="callback-success-icon">✓</div>
        <h3>Заявка принята</h3>
        <p>Мы сохранили номер и скоро перезвоним.</p>
        <button class="btn-secondary" type="button" data-callback-close>Готово</button>
      </div>
    </section>
  `;

  document.body.appendChild(modal);
  bindCallbackModal(modal);
}

function bindCallbackModal(modal) {
  const form = modal.querySelector('.callback-form');
  const phoneInput = modal.querySelector('#callbackPhone');
  const error = modal.querySelector('.callback-error');
  const success = modal.querySelector('.callback-success');

  modal.querySelectorAll('[data-callback-close]').forEach((button) => {
    button.addEventListener('click', closeCallbackWindow);
  });

  phoneInput.addEventListener('input', () => {
    phoneInput.value = formatCallbackPhone(phoneInput.value);
    error.textContent = '';
    phoneInput.removeAttribute('aria-invalid');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const digits = phoneInput.value.replace(/\D/g, '');

    if (digits.length < 10) {
      error.textContent = 'Введите корректный номер телефона.';
      phoneInput.setAttribute('aria-invalid', 'true');
      phoneInput.focus();
      return;
    }

    form.hidden = true;
    success.hidden = false;
    success.querySelector('button').focus();
  });
}

function formatCallbackPhone(value) {
  const digits = value.replace(/\D/g, '').replace(/^8/, '7').slice(0, 11);
  if (!digits) return '';

  const normalized = digits.startsWith('7') ? digits : `7${digits}`;
  const part1 = normalized.slice(1, 4);
  const part2 = normalized.slice(4, 7);
  const part3 = normalized.slice(7, 9);
  const part4 = normalized.slice(9, 11);

  let result = '+7';
  if (part1) result += ` (${part1}`;
  if (part1.length === 3) result += ')';
  if (part2) result += ` ${part2}`;
  if (part3) result += `-${part3}`;
  if (part4) result += `-${part4}`;
  return result;
}

function openCallbackWindow() {
  createCallbackModal();

  const modal = document.getElementById(CALLBACK_MODAL_ID);
  const form = modal.querySelector('.callback-form');
  const phoneInput = modal.querySelector('#callbackPhone');
  const error = modal.querySelector('.callback-error');
  const success = modal.querySelector('.callback-success');

  form.hidden = false;
  success.hidden = true;
  error.textContent = '';
  phoneInput.value = '';
  phoneInput.removeAttribute('aria-invalid');

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('callback-lock');
  setTimeout(() => phoneInput.focus(), 80);
}

function closeCallbackWindow() {
  const modal = document.getElementById(CALLBACK_MODAL_ID);
  if (!modal) return;

  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('callback-lock');
}

document.addEventListener('DOMContentLoaded', createCallbackModal);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeCallbackWindow();
});
