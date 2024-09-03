document.addEventListener('DOMContentLoaded', () => {
    const loggedIn = localStorage.getItem('loggedIn');

    if (loggedIn !== 'true') {
        window.location.href = 'Página.html'; // Redirige a la página de inicio de sesión si no está autenticado
    }
});
