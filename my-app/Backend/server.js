const express = require('express');
const path = require('path');
const sql = require('mssql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la base de datos para SQL Server
const dbConfig = {
    user: 'administrador',
    password: 'Kia_79123',
    server: 'servidorsql-kia.database.windows.net',
    database: 'KiaData',
    options: {
        encrypt: true, // Esto es necesario para Azure SQL
        enableArithAbort: true
    }
};

// Servir archivos estáticos (como CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, '..', 'public'))); // Sirve la carpeta public

// Crear una tabla hash (en este caso, un Map) para almacenar los logins activos
const loginHashTable = new Map();

// Ruta para verificar el usuario y crear una contraseña
app.post('/crear-cuenta', async (req, res) => {
    const { Id, birth_date, new_password } = req.body;

    try {
        let pool = await sql.connect(dbConfig); // Conectar a la base de datos
        const request = new sql.Request(pool);  // Crear la solicitud

        // Verificar si el usuario existe en la tabla Usuario y comparar el Id y la fecha de nacimiento
        const query = 'SELECT * FROM Usuario WHERE Id = @Id AND Birth_date = @Birth_date';
        const result = await request
            .input('Id', sql.Int, Id)
            .input('Birth_date', sql.Date, birth_date)
            .query(query);

        if (result.recordset.length > 0) {
            // El usuario fue encontrado y la fecha de nacimiento coincide
            // Insertar la nueva contraseña en la tabla ContraseñaUsuario
            const insertQuery = 'INSERT INTO ContraseñaUsuario (Id, Birth_date, Contraseña_Usuario) VALUES (@Id, @Birth_date, @Contraseña_Usuario)';
            await request
                .input('Id', sql.Int, Id)
                .input('Birth_date', sql.Date, birth_date)
                .input('Contraseña_Usuario', sql.VarChar(100), new_password)
                .query(insertQuery);

            // Redirigir a la página de éxito
            res.redirect('/crear-cuenta-exitoso');
        } else {
            // Si el usuario no existe o la fecha de nacimiento es incorrecta
            res.status(401).send('ID o fecha de nacimiento incorrectos');
        }
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).send('Error en el servidor al crear la cuenta');
    } finally {
        sql.close(); // Cerrar la conexión
    }
});

// Ruta para la página de éxito
app.get('/crear-cuenta-exitoso', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'crear-cuenta-exitoso.html'));
});


// Ruta para cerrar sesión
app.post('/CerrarSesion', async (req, res) => {
    const { IdSalida } = req.body; // Obtener el Id del usuario que va a cerrar sesión
    const now = new Date();

    console.log('Cierre de sesión para:', IdSalida);

    if (loginHashTable.has(IdSalida)) {
        try {
            let pool = await sql.connect(dbConfig); // Conectar a la base de datos
            const request = new sql.Request(pool);  // Crear la solicitud

            // Insertar la fecha de salida en la tabla Login
            const insertQuery = 'UPDATE Login SET FechaSalida = @Fecha WHERE IdLogin = @IdLogin';
            await request.input('Fecha', sql.DateTime, now).input('IdLogin', sql.Int, IdSalida).query(insertQuery);

            // Eliminar el IdLogin del Map, ya que se ha cerrado la sesión
            loginHashTable.delete(IdSalida);

            // Redirigir o enviar respuesta indicando éxito en el cierre de sesión
            res.send('Sesión cerrada exitosamente.');
        } catch (err) {
            console.error('Error en la consulta:', err);
            res.status(500).send('Error al cerrar la sesión');
        } finally {
            sql.close(); // Cerrar la conexión
        }
    } else {
        // Si el Id no está en el Map, significa que no estaba logueado
        res.status(401).send('El usuario no está logueado o ya cerró sesión');
    }
});


// Rutas para las diferentes páginas HTML
app.get('/pagina', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'Página.html'));
});


app.get('/inicio', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'inicio.html'));
});

app.get('/videojuego', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'Videojuego.html'));
});

app.get('/compensaciones', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'compensaciones.html'));
});

app.get('/calendario', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'calendario.html'));
});

app.get('/contacto', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'contacto.html'));
});

app.post('/contacto', async (req, res) => {
    const { nombre, idcontacto, areatrabajo, mensaje } = req.body;

    try {
        let pool = await sql.connect(dbConfig); // Conectar a la base de datos
        const request = new sql.Request(pool);  // Crear la solicitud

        // Consulta de inserción para guardar los datos del formulario
        const insertQuery = `
            INSERT INTO Contacto (nombreEmisor, IdContacto, AreaTrabajo, Mensaje, FechaContacto)
            VALUES (@nombreEmisor, @IdContacto, @AreaTrabajo, @Mensaje, @FechaContacto)
        `;

        const now = new Date();

        // Ejecutar la consulta de inserción
        await request
            .input('nombreEmisor', sql.VarChar, nombre)           // Nombre completo del empleado
            .input('IdContacto', sql.Int, idcontacto)             // Número de empleado
            .input('AreaTrabajo', sql.VarChar, areatrabajo)      // Área de trabajo actual
            .input('Mensaje', sql.VarChar, mensaje)       // Mensaje
            .input('FechaContacto', sql.DateTime, now)            // Fecha del mensaje
            .query(insertQuery);

        // Redirigir a una página de éxito o agradecer el envío
        res.redirect('/contacto-exitoso'); // Cambia esto a donde quieras redirigir después de enviar
    } catch (err) {
        console.error('Error al insertar los datos del formulario:', err);
        res.status(500).send('Error al enviar el formulario');
    } finally {
        sql.close(); // Cerrar la conexión
    }
});

// Ruta para la página de éxito
app.get('/contacto-exitoso', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'contacto-exitoso.html'));
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});