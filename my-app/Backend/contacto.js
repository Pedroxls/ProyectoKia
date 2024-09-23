const express = require('express');
const sql = require('mssql');
const router = express.Router();  // Crear el router en lugar de app

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
router.post('/contacto', async (req, res) => {
    const { name, IdContacto, area, message, correo } = req.body;

    try {
        // Conectar a la base de datos
        let pool = await sql.connect(dbConfig);
        const request = new sql.Request(pool);

        // Consulta para insertar los datos en la tabla Contacto
        const insertQuery = `
            INSERT INTO Contacto (nombreEmisor, IdContacto, AreaTrabajo, Mensaje, CorreoEmisor) 
            VALUES (@nombreEmisor, @IdContacto, @AreaTrabajo, @Mensaje, @CorreoEmisor)
        `;
        await request
            .input('nombreEmisor', sql.VarChar, name)
            .input('Id', sql.Int, IdContacto)
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

module.exports = router;  // Exporta el router, no app