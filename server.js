require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
//const path = require("path");
const {
    newEntry,
    deleteEntry,
    updateEntry,
    validateUser,
    loginUser,
}= require("./controllers/entradas");

const { PORT } = process.env;

// Creo la app de express
const app = express();
// Aplico middlewares

// Logger
app.use(morgan("dev"));

// Body parser (body en JSON)
app.use(bodyParser.json());

app.post("/insertar",newEntry);
app.delete("/borrar/:id",deleteEntry);
app.delete("/modificar/:id",updateEntry);
app.get("/validar/:registrationCode",validateUser); //NOTA: el nombre "registrationCode" es importante, 
                                                    //si lo cambio no ejecuta la sql, asocia el req.params

app.post("/login",loginUser);
//...de error, llega si next(algo)
app.use((error,req,res,next)=>{
    res.status(error.httpStatus || 500).send({error: error.message,})
});


//...de NOT FOUND
app.use((req,res) => {
    res.status(404).send({
        error:"Not found",
    });
}

);

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT} 🚀`);
  });