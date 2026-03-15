document.addEventListener('DOMContentLoaded', () => {
  const nameInput  = document.getElementById('nameInput');
  const phoneInput = document.getElementById('phoneInput');
  const deleteBtn  = document.getElementById('deleteBtn');
  if (!deleteBtn) return;

  function lockDelete() {
    deleteBtn.disabled = true;
    deleteBtn.classList.add('disabled');
  }

  nameInput.addEventListener('input',  lockDelete);
  phoneInput.addEventListener('input', lockDelete);
});