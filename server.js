/* 
{
        "id": 1,
        "nombre": "Daniela",
        "fechaInicio": "22-11-2024",
        "fechaFin": "31-12-2024",
        "hora": "11-11",
        "salaId": 1
    },
    {
        "id": 2,
        "nombre": "Suanny",
        "fechaInicio": "17-11-2024",
        "fechaFin": "01-01-2025",
        "hora": "10:40",
        "salaId": 2
    }
] */

// importamos las modulos como express -- o cros

// importamos espress y le decimos que es requerido 
const express = require('express');
const cors = require('cors');


const corsOptions = {
    origin: 'http://127.0.0.1:5501', // Cambia esto si usas otro puerto u origen
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Headers permitidos
};
//crear la instancia de la aplicación express
const app = express();
app.use(cors(corsOptions));

//configurar el puerto  
const PORT = 3000;

//------- > middleware para procesar los datos JSON en la peticiones
app.use(express.json());  // le indica a la instacia que va a utilizar un objeto json y permite recibir y procesar datos en json

//bd almacenado en memoria y creamos un array vacío
const reservas = [];
let salasDisponibles = [
    { id: 101, nombre: "Sala1", capacidad: 25, estado: "Activa" },
    { id: 102, nombre: "Sala2", capacidad: 50, estado: "Activa" },
    { id: 103, nombre: "Sala3", capacidad: 75, estado: "Activa" },
    { id: 104, nombre: "Sala4", capacidad: 100, estado: "Activa" },
];
const salas = [];



//-------------- RUTA GET RESERVAS  --- Leer o mostrar datos de la variable 


app.get('/reservas', (req, res) => {
    res.json(reservas);//respuesta json de las reservar, lo que hace es traer y mostarrme todos los libros almacenados 
});


// -------------- RUTA GET POR ID --- para que me muestre el json que qiero mostrar 

app.get('/reservas/:id', (req, res) => {
    const idReserva = parseInt(req.params.id); // obtiene el valor del parametro id de la url y que sea un ID
    const reserva = reservas.find(r => r.id === idReserva); //Busca en el arreglo reservas el primer objeto que tenga un ID

    if (reserva) {
        res.json(reserva);
    } else {
        res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }
});


//POST RESERVAS -- guardar datos 
app.post('/reservas', (req, res) => {
    const nuevaReserva = req.body; // crea la informacion de la solicitud 
    if (!nuevaReserva.id || !nuevaReserva.nombre || !nuevaReserva.fechaInicio || !nuevaReserva.fechaFin || !nuevaReserva.salaId) { // si no se cumple esta solicitud mandame un mensaje o error
        res.status(400).json({ mensaje: "Todos los campos son requeridos" }); // mensaje con es estado del error
        return;
    }
    reservas.push(nuevaReserva); // todos los datos me lo guardan en esta variable reservas 
    res.json({ mensaje: 'Reservas añadidas corretamente', reserva: nuevaReserva });
});


//PUT  RESERVA para actualizar los datos 

app.put('/reservas/:id', (req, res) => {
    const idReserva = parseInt(req.params.id);  //guarda parametros id 
    const indice = reservas.findIndex(reserva => reserva.id === idReserva); //busca el indice y compara que sea totalmete igual
    if (indice == -1) { // si indice no existe mandar un error
        res.status(404).json({ mensaje: 'No se encontro la reserva' });
        return;
    }

    // Actualizar con el indice 
    reservas[indice] = req.body;
    res.json({ mensaje: 'Reserva actualizar correctamente' });

});

//DELETE RESERVAS 

app.delete('/reservas/:id', (req, res) => {
    const idReserva = parseInt(req.params.id);  //guarda parametros id 
    const indice = reservas.findIndex(reserva => reserva.id === idReserva); //busca el indice y compara que sea totalmete igual
    if (indice == -1) { // si indice no existe mandar un error
        res.status(404).json({ mensaje: 'No se encontro la reserva' });
        return;
    }

    // Elimina con el indice del elemento  --- esl splice elimina 
    const reservaEliminada = reservas.splice(indice, 1) //con el 1 le decimos que agarre un elemnto 
    res.json({ mensaje: 'Reserva actualizar correctamente', reserva: reservaEliminada });

});


//----------------------------- SALAS CRUD ----------------

//Salas disponibles

app.get('/salas/disponibles', (req, res) => {
    res.json(salasDisponibles);
});
app.get('/salas/disponibles/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const salaId = salasDisponibles.find((sala) => sala.id === id);
    if (!salaId) {
        return res.status(404).json({ mensaje: "No se pudo encontrar la sala" });
    }
    res.json(salaId);
});
app.put('/salas/disponibles/:id', (req, res) => {
    const idsala = parseInt(req.params.id);
    const indice = salasDisponibles.findIndex(sala => sala.id === idsala);
    if (indice == -1) {
        res.status(404).json({ mensaje: 'No se encontró la sala' });
        return;
    }
    salasDisponibles[indice] = req.body;
    res.json({ mensaje: 'sala actualizada correctamente' });
});

//RUTA GET 
app.get('/salas', (req, res) => {
    res.json(salas);
});

//RUTA GET POR ID 

app.get('/salas/:id', (req, res) => {
    const idSala = parseInt(req.params.id); // obtiene el valor del parametro id de la url y que sea un ID
    const sala = salas.find(s => s.id === idSala); //Busca en el arreglo reservas el primer objeto que tenga un ID

    if (sala) {
        res.json(sala);
    } else {
        res.status(404).json({ mensaje: 'Sala no encontrada' });
    }
});

//POST SALAS 
app.post('/salas', (req, res) => {
    const nuevaSala = req.body; // crea la informacion de la solicitud 
    if (!nuevaSala.id || !nuevaSala.nombre || !nuevaSala.capacidad || !nuevaSala.Estado) { // si no se cumple esta solicitud mandame un mensaje o error
        res.status(400).json({ mensaje: "Todos los campos son requeridos" }); // mensaje con es estado del error
        return;
    }
    salas.push(nuevaSala); // todos los datos me lo guardan en esta variable reservas 
    res.json({ mensaje: 'sala añadidas corretamente', salas: nuevaSala });
});

//PUT SALAS 

app.put('/salas/:id', (req, res) => {
    const idSala = parseInt(req.params.id);  //guarda parametros id 
    const indice = reservas.findIndex(sala => sala.id === idSala); //busca el indice y compara que sea totalmete igual
    if (indice == -1) { // si indice no existe mandar un error
        res.status(404).json({ mensaje: 'No se encontro la Sala' });
        return;
    }

    // Actualizar con el indice 
    salas[indice] = req.body;
    res.json({ mensaje: 'Actualizar salas correctamente' });

});

//DELETE SALAS 

app.delete('/salas/:id', (req, res) => {
    const idSala = parseInt(req.params.id);  //guarda parametros id 
    const indice = salas.findIndex(sala => sala.id === idSala); //busca el indice y compara que sea totalmete igual
    if (indice == -1) { // si indice no existe mandar un error
        res.status(404).json({ mensaje: 'No se encontro la sala' });
        return;
    }

    // Elimina con el indice del elemento  --- esl splice elimina 
    const salaEliminada = salas.splice(indice, 1) //con el 1 le decimos que agarre un elemnto 
    res.json({ mensaje: 'Actualizar la salas correctamente', sala: salaEliminada });

});


// REINICIAR SALAS
app.post('/reiniciar', (req,res) =>{
    salasDisponibles = [
      {id: 101, nombre: "Sala1", capacidad: 25, estado: "Activa"},
      {id: 102, nombre: "Sala2", capacidad: 50, estado: "Activa"},
      {id: 103, nombre: "Sala3", capacidad: 75, estado: "Activa"},
      {id: 104, nombre: "Sala4", capacidad: 100, estado: "Activa"},
    ];
    salas = [];
    reservas = [];
    res.status(200).send("Salas reiniciadas");
  });
  //LLAMAR AL PUERTO
  app.listen(PORT, ()=>{
    console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
  });




app.listen(PORT, () => {
    console.log(`servidor ejecutandose en http://localhost:${PORT}`);

});

