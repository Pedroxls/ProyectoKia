document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const usernameInput = document.getElementById('Id');

    if (form && usernameInput) {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Evita el comportamiento predeterminado del formulario
        
            const Id = usernameInput.value.trim(); // Elimina espacios en blanco
        
            console.log('Valor de username enviado:', Id); // Verifica el valor que se envía
        
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Id }),
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
    } else {
        console.error('El formulario o el campo username no existen en el DOM');
    }
});
