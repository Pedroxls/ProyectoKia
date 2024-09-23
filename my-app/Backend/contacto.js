const express = require('express');
const sql = require('mssql');

const router = express.Router();

// Configuración de la base de datos (puedes compartirla desde otro archivo si es necesario)
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
    const { name, id, area, message, correo } = req.body;

    try {
        let pool = await sql.connect(dbConfig); // Conectar a la base de datos
        const request = new sql.Request(pool);

        // Insertar los datos en la tabla Contacto
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

        // Enviar respuesta de éxito
        res.status(200).send('Mensaje enviado exitosamente');
    } catch (err) {
        console.error('Error al guardar en la base de datos:', err);
        res.status(500).send('Error en el servidor');
    } finally {
        sql.close(); // Cerrar la conexión
    }
});

module.exports = router;