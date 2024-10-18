const express = require('express');

const path = require('path');

const app = express();

 

// Servir los archivos estáticos de la carpeta de Unity

app.use(express.static(path.join(__dirname, 'Build')));

 

app.get('/', (req, res) => {

  res.sendFile(path.join(__dirname, 'Build', 'index.html'));

});

 

const port = process.env.PORT || 3001;

app.listen(port, () => {

  console.log(`Server running on port ${port}`);

});