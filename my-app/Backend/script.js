document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario

    // Aquí puedes poner la lógica para verificar el usuario y la contraseña
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simulación de verificación (cambiar según tu lógica real)
    const validUsername = 'usuario';
    const validPassword = 'contraseña';

    if (username !== validUsername || password !== validPassword) {
        document.getElementById('errorMessage').style.display = 'block'; // Muestra el mensaje de error
    } else {
        document.getElementById('errorMessage').style.display = 'none'; // Oculta el mensaje de error
        // Aquí puedes redirigir al usuario a la página de inicio o hacer otra acción
        alert('Inicio de sesión exitoso');
    }
});
