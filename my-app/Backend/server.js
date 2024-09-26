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

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
    const { Id } = req.body;
    console.log('Valor recibido del formulario:', Id);

    try {
        let pool = await sql.connect(dbConfig); // Conectar a la base de datos
        const request = new sql.Request(pool);  // Crear la solicitud

        // Verificar si el usuario existe en la tabla Usuario
        const query = 'SELECT * FROM Usuario WHERE Id = @Id';
        const result = await request.input('Id', sql.Int, Id).query(query);

        if (result.recordset.length > 0) {
            const insertQuery = 'INSERT INTO Login (IdLogin, FechaInicio) VALUES (@IdLogin, @Fecha)';
            const now = new Date();
            await request.input('Fecha', sql.DateTime, now).input('IdLogin', sql.Int, Id).query(insertQuery);

            // Si el usuario existe, redirigir a la página deseada
            res.redirect('/pagina'); // Cambia esto por la URL a la que deseas redirigir
        } else {
            // Si el usuario no existe
            res.status(401).send('Usuario no encontrado o ID incorrecto');
        }
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).send('Error en el servidor');
    } finally {
        sql.close(); // Cerrar la conexión
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