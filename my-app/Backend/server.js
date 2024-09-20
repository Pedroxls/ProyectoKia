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
    database: 'DataKia',
    options: {
        encrypt: true, // Esto es necesario para Azure SQL
        enableArithAbort: true
    }
};

// Conexión a la base de datos SQL Server
sql.connect(dbConfig, (err) => {
    if (err) {
        console.log('Error conectando a la base de datos:', err);
    } else {
        console.log('Conexión exitosa a la base de datos');
    }
});

// Ruta de inicio de sesión
app.post('/login', (req, res) => {
    const { Id } = req.body;
    console.log('Valor recibido del formulario:', Id);

    // Consulta para verificar el ID del empleado
    const query = 'SELECT * FROM Usuario WHERE Id = @Id';

    const request = new sql.Request();
    request.input('Id', sql.Int, parseInt(Id)) // Asegúrate de que sea un número si el campo es INT
        .query(query, (err, result) => {
            if (err) {
                console.log('Error en la consulta:', err);
                res.status(500).send('Error en el servidor');
            } else {
                if (result.recordset.length > 0) {
                    res.status(200).send('Login exitoso');
                } else {
                    res.status(401).send('Usuario no encontrado');
                }
            }
        });
});

// Servir archivos estáticos (como tu HTML, CSS y JS)
app.use(express.static('public'));

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});