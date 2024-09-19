const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la base de datos
const dbConfig = {
    user: 'administrador',
    password: 'Kia_79123',
    server: 'servidorsql-kia.database.windows.net', // O la IP de tu servidor
    database: 'KiaData',
    options: {
        encrypt: true, // Usar SSL
        enableArithAbort: true
    }
};

// Conexión a la base de datos
sql.connect(dbConfig, (err) => {
    if (err) {
        console.log('Error conectando a la base de datos:', err);
    } else {
        console.log('Conexión exitosa a la base de datos');
    }
});

// Ruta de inicio de sesión
app.post('/login', (req, res) => {
    // Extraer el Id del cuerpo de la solicitud (proveniente del formulario)
    const { Id } = req.body;

    // Consulta SQL para verificar si el Id existe en la tabla 'Usuario'
    const query = `SELECT * FROM Usuario WHERE id = @Id`;

    // Crear una nueva solicitud de SQL
    new sql.Request()
        .input('Id', sql.VarChar, Id)  // Pasar el Id como parámetro a la consulta
        .query(query, (err, result) => {
            if (err) {
                // Si hay un error en la consulta
                console.log('Error en la consulta:', err);
                res.status(500).send('Error en el servidor');
            } else {
                // Si la consulta tiene resultados
                if (result.recordset.length > 0) {
                    res.status(200).send('Login exitoso');  // El Id existe
                } else {
                    res.status(401).send('Usuario no encontrado');  // El Id no existe
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