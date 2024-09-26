document.getElementById('cerrarSesionBtn').addEventListener('click', async function() {
    // Obtener la fecha actual
    const now = new Date();
    const userId = '12345'; // Reemplaza esto con el ID del usuario actual

    // Mostrar los datos que se enviarán
    console.log('Datos enviados:', {
        IdSalida: userId,
        FechaDeSalida: now
    });

    // Enviar la solicitud al servidor
    try {
        const response = await fetch('/cerrar-sesion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                IdSalida: userId,
                FechaDeSalida: now
            })
        });

        if (response.ok) {
            // Redirigir a la página de inicio de sesión si la respuesta es exitosa
            window.location.href = 'index.html'; 
        } else {
            // Obtener el texto del error y mostrarlo en un alert
            const errorText = await response.text(); 
            alert(`Error al cerrar sesión: ${errorText}`); 
        }
    } catch (err) {
        // Capturar cualquier error que ocurra durante la solicitud
        console.error('Error al enviar la solicitud:', err);
        alert('Error al enviar la solicitud. Verifica la consola para más detalles.');
    }
});
