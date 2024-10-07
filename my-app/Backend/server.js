const express = require('express');
const path = require('path');
const sql = require('mssql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la base de datos para SQL Server
const dbConfig = {
    user: 'administrador',
    password: 'Kia_79123',
    server: 'servidorsql-kia.database.windows.net',
    database: 'KiaData',
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// Crear un Map para almacenar los logins activos
const loginHashTable = new Map();

// Ruta para el inicio de sesión
app.post('/login', async (req, res) => {
    const { Id, password } = req.body;
    console.log('Valores recibidos del formulario:', Id, password);

    try {
        let pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);

        // Verificar si el usuario y contraseña existen
        const query = 'SELECT * FROM ContraseñaUsuario WHERE Id_Usuario = @Id_Usuario AND Crear_Contraseña = @Crear_Contraseña';
        const result = await request
            .input('Id_Usuario', sql.Int, Id)
            .input('Crear_Contraseña', sql.VarChar(100), password)
            .query(query);

        if (result.recordset.length > 0) {
            const now = new Date();
            const insertQuery = 'INSERT INTO Login (IdLogin, FechaInicio) VALUES (@IdLogin, @Fecha)';
            await request.input('Fecha', sql.DateTime, now).input('IdLogin', sql.Int, Id).query(insertQuery);
            loginHashTable.set(Id, { fechaInicio: now });

            res.redirect('/pagina');
        } else {
            res.status(401).send('ID o contraseña incorrecta');
        }
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).send('Error en el servidor');
    } finally {
        sql.close();
    }
});

// Ruta para verificar ID y fecha de nacimiento
app.post('/crear-cuenta', async (req, res) => {
    const { Id, birth_date } = req.body;
    console.log('Valores recibidos del formulario:', Id, birth_date);

    try {
        let pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);

        const query = 'SELECT * FROM Usuario WHERE Id = @Id AND Birth_date = @Birth_date';
        const result = await request
            .input('Id', sql.Int, Id)
            .input('Birth_date', sql.Date, birth_date)
            .query(query);

        if (result.recordset.length > 0) {
            res.status(200).json({ success: true, message: 'Datos verificados correctamente' });
        } else {
            res.status(401).json({ success: false, message: 'ID o fecha de nacimiento incorrectos' });
        }
    } catch (err) {
        console.error('Error en la verificación de usuario:', err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    } finally {
        sql.close();
    }
});

// Ruta para crear una nueva contraseña y realizar login automático
app.post('/crear-contraseña', async (req, res) => {
    const { Id, new_password } = req.body;

    // Log para verificar que la función fue llamada
    console.log('Ruta /crear-contraseña fue llamada');
    console.log('ID recibido:', Id);
    console.log('Contraseña recibida:', new_password);

    try {
        let pool = await sql.connect(dbConfig);
        console.log('Conexión a la base de datos exitosa');

        const request = new sql.Request(pool);

        // Consulta simplificada de inserción
        const insertQuery = 'INSERT INTO ContraseñaUsuario (Id_Usuario, Crear_Contraseña) VALUES (@Id_Usuario, @Crear_Contraseña);';
        
        await request
            .input('Id_Usuario', sql.Int, parseInt(Id,10))
            .input('Crear_Contraseña', sql.VarChar(100), new_password)
            .query(insertQuery);

        res.redirect('/pagina');

        } catch (err) {
            console.error('Error al crear la contraseña:', err.message);
            console.error('Detalle completo del error:', err);
            res.status(500).send('Error en el servidor');
        } finally {
            sql.close();
            console.log('Conexión a la base de datos cerrada');
        }
});

// Ruta para cerrar sesión
app.post('/CerrarSesion', async (req, res) => {
    const { IdSalida } = req.body;
    const now = new Date();

    if (loginHashTable.has(IdSalida)) {
        try {
            let pool = await sql.connect(dbConfig);
            const request = new sql.Request(pool);

            const insertQuery = 'UPDATE Login SET FechaSalida = @Fecha WHERE IdLogin = @IdLogin';
            await request.input('Fecha', sql.DateTime, now).input('IdLogin', sql.Int, IdSalida).query(insertQuery);

            loginHashTable.delete(IdSalida);
            res.send('Sesión cerrada exitosamente.');
        } catch (err) {
            console.error('Error en la consulta:', err);
            res.status(500).send('Error al cerrar la sesión');
        } finally {
            sql.close();
        }
    } else {
        res.status(401).send('El usuario no está logueado o ya cerró sesión');
    }
});

// Rutas para las páginas HTML
app.get('/pagina', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'Página.html'));
});

// Otras rutas de páginas...
app.get('/inicio', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'inicio.html')));
app.get('/videojuego', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'Videojuego.html')));
app.get('/compensaciones', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'compensaciones.html')));
app.get('/calendario', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'calendario.html')));
app.get('/contacto', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'contacto.html')));

app.post('/contacto', async (req, res) => {
    const { nombre, idcontacto, areatrabajo, mensaje } = req.body;

    try {
        let pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);

        const insertQuery = 'INSERT INTO Contacto (nombreEmisor, IdContacto, AreaTrabajo, Mensaje, FechaContacto) VALUES (@nombreEmisor, @IdContacto, @AreaTrabajo, @Mensaje, @FechaContacto)';
        const now = new Date();

        await request
            .input('nombreEmisor', sql.VarChar, nombre)
            .input('IdContacto', sql.Int, idcontacto)
            .input('AreaTrabajo', sql.VarChar, areatrabajo)
            .input('Mensaje', sql.VarChar, mensaje)
            .input('FechaContacto', sql.DateTime, now)
            .query(insertQuery);

        res.redirect('/contacto-exitoso');
    } catch (err) {
        console.error('Error al insertar los datos del formulario:', err);
        res.status(500).send('Error al enviar el formulario');
    } finally {
        sql.close();
    }
});

app.get('/contacto-exitoso', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'contacto-exitoso.html'));
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});