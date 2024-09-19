document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

        const username = document.getElementById('username').value;

        // Enviar la solicitud al servidor
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = 'Página.html'; // Redirige al usuario
                } else {
                    alert('Usuario no encontrado o ID incorrecto');
                }
            })
            .catch(error => console.error('Error:', error));
    });
});
