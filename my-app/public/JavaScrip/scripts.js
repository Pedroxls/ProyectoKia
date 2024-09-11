// Capturar los elementos de los enlaces
const forgotPasswordLink = document.getElementById('forgot-password-link');
const createAccountLink = document.getElementById('create-account-link');
const backToLoginLinks = document.querySelectorAll('#back-to-login-link, #back-to-login-link-2');

// Formularios
const loginForm = document.getElementById('login-form');
const recoverForm = document.getElementById('recover-form');
const createForm = document.getElementById('create-form');

// Mostrar el formulario de recuperación de cuenta
forgotPasswordLink.addEventListener('click', () => {
    loginForm.classList.remove('active');
    recoverForm.classList.add('active');
});

// Mostrar el formulario de crear cuenta
createAccountLink.addEventListener('click', () => {
    loginForm.classList.remove('active');
    createForm.classList.add('active');
});

// Volver al inicio de sesión desde crear cuenta o recuperar cuenta
backToLoginLinks.forEach(link => {
    link.addEventListener('click', () => {
        recoverForm.classList.remove('active');
        createForm.classList.remove('active');
        loginForm.classList.add('active');
    });
});
