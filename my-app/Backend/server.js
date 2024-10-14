const express = require('express');
const path = require('path');
const sql = require('mssql');
const bodyParser = require('body-parser');

const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la base de datos para SQL Server
const dbConfig = {
    user: 'Administracion',
    password: 'Kia12345',
    server: 'kia-data.database.windows.net',
    database: 'KiaDataBase',
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

// Ruta para verificar ID y contraseña de administrador
app.post('/admin_login', async (req, res) => {
    const { adminId, adminPassword } = req.body;
    console.log('Valores recibidos del formulario:', adminId, adminPassword);

    try {
        let pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);

        const query = 'SELECT * FROM UsuarioAdministrador WHERE Id_Administracion = @Id_Administracion AND Contraseña = @Contraseña';
        const result = await request
            .input('Id_Administracion', sql.Int, adminId)
            .input('Contraseña', sql.VarChar(100), adminPassword)
            .query(query);

        if (result.recordset.length > 0) {
            res.redirect('/admin_dashboard.html'); // Redirigir a la página de administración
        } else {
            res.status(401).json({ success: false, message: 'ID o contraseña incorrectos' });
        }
    } catch (err) {
        console.error('Error en la verificación de usuario:', err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    } finally {
        sql.close();
    }
});

// Ruta para crear una nueva contraseña y realizar login automático
app.post('/crear-contrasena', async (req, res) => {
    console.log('Cuerpo de la solicitud:', req.body);
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

// Ruta para actualizar la contraseña (Olvidar Contraseña)
app.post('/reset_password', async (req, res) => {
    const { Id, newPassword } = req.body;
    console.log('Valores recibidos del formulario:', Id, newPassword);

    try {
        let pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);

        // Actualizar la contraseña para el ID especificado
        const updateQuery = 'UPDATE ContraseñaUsuario SET Crear_Contraseña = @Crear_Contraseña WHERE Id_Usuario = @Id_Usuario';
        await request
            .input('Id_Usuario', sql.Int, Id)
            .input('Crear_Contraseña', sql.VarChar(100), newPassword)
            .query(updateQuery);

        // Redirigir al inicio de sesión
        res.redirect('/pagina'); // Asegúrate de que esta ruta sea la correcta para tu inicio de sesión.
    } catch (err) {
        console.error('Error al actualizar la contraseña:', err);
        res.status(500).send('Error al actualizar la contraseña');
    } finally {
        sql.close();
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

// Ruta para obtener todos los usuarios de la base de datos
app.get('/get-users', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);

        // Consulta para obtener todos los usuarios
        const query = 'SELECT Id_Usuario, Crear_Contraseña FROM ContraseñaUsuario';
        const result = await request.query(query);

        // Enviar la lista de usuarios como respuesta en formato JSON
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener los usuarios:', err);
        res.status(500).send('Error en el servidor');
    } finally {
        sql.close();
    }
});

// Ruta para eliminar un usuario de la base de datos por su ID
app.delete('/delete-user/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        let pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);

        // Consulta para eliminar el usuario
        const query = 'DELETE FROM ContraseñaUsuario WHERE Id_Usuario = @Id_Usuario';
        await request.input('Id_Usuario', sql.Int, userId).query(query);

        res.status(200).send('Usuario eliminado correctamente');
    } catch (err) {
        console.error('Error al eliminar el usuario:', err);
        res.status(500).send('Error en el servidor');
    } finally {
        sql.close();
    }
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});