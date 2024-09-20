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

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
    const { Id } = req.body;
    console.log('Valor recibido del formulario:', Id);

    try {
        // Asegúrate de que la conexión se realice correctamente antes de la consulta
        let pool = await sql.connect(dbConfig); // Establece una conexión
        const request = new sql.Request(pool);  // Crea una solicitud SQL

        const query = 'SELECT * FROM Usuario WHERE Id = @Id';
        const result = await request.input('Id', sql.VarChar, Id).query(query);

        // Procesar los resultados de la consulta
        if (result.recordset.length > 0) {
            res.status(200).send('Login exitoso');
        } else {
            res.status(401).send('Usuario no encontrado o ID incorrecto');
        }
    } catch (err) {
        console.error('Error en la consulta:', err);
        res.status(500).send('Error en el servidor');
    } finally {
        // Cerrar la conexión después de la consulta
        sql.close(); // Asegúrate de cerrar la conexión
    }
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});