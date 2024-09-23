const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');

const app = express();

// Middleware para analizar los datos del formulario
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la base de datos
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

// Ruta para manejar el formulario de contacto
app.post('/contacto', async (req, res) => {
    const { name, id, area, message, correo } = req.body;

    try {
        // Conectar a la base de datos
        let pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);

        // Consulta para insertar los datos en la tabla Contacto
        const insertQuery = `
            INSERT INTO Contacto (nombreEmisor, Id, AreaTrabajo, Mensaje, CorreoEmisor) 
            VALUES (@nombreEmisor, @Id, @AreaTrabajo, @Mensaje, @CorreoEmisor)
        `;
        await request
            .input('nombreEmisor', sql.VarChar, name)
            .input('Id', sql.Int, id)
            .input('AreaTrabajo', sql.VarChar, area)
            .input('Mensaje', sql.VarChar, message)
            .input('CorreoEmisor', sql.VarChar, correo)
            .query(insertQuery);

        // Responder al cliente
        res.status(200).send('Mensaje enviado exitosamente');
    } catch (err) {
        console.error('Error al guardar en la base de datos:', err);
        res.status(500).send('Error en el servidor');
    } finally {
        sql.close(); // Cerrar la conexión
    }
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});