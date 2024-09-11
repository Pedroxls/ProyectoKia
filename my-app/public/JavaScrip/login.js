document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Aquí deberías agregar la lógica para autenticar al usuario
        // Para el propósito de este ejemplo, usaremos un simple almacenamiento local para la autenticación

        if (username === '2' && password === '1') {
            localStorage.setItem('loggedIn', 'true');
            window.location.href = 'Página.html'; // Redirige al usuario a la página principal
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    });
});
