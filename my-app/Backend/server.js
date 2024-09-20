const express = require('express');
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
app.use(express.static('public')); // Servir la carpeta public

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
    const { Id } = req.body;
    console.log('Valor recibido del formulario:', Id);

    try {
        let pool = await sql.connect(dbConfig); // Conectar a la base de datos
        const request = new sql.Request(pool);  // Crear la solicitud

        const query = 'SELECT * FROM Usuario WHERE Id = @Id';
        const result = await request.input('Id', sql.VarChar, Id).query(query);

        if (result.recordset.length > 0) {
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

// Ruta que sirve la página principal después del login
app.get('/pagina', (req, res) => {
    res.sendFile('C:/Users/Nukat/CONSTRUCCIÓN/ProyectoKia/my-app/public/Página.html');
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});