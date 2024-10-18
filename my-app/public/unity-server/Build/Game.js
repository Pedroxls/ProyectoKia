import React from 'react';

 

const Game = () => {

  return (

    <div>

      <h1>Juego de Unity</h1>

      <iframe

        title="Unity Game"

        src="http://localhost:3001"

        style={{ width: '100%', height: '600px', border: 'none' }}

      ></iframe>

    </div>

  );

};