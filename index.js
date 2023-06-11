import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import conectardb from "./config/db.js";
import veterinarioroutes from "./routes/veterinarioroutes.js";
import pacienteroutes from "./routes/pacienteroutes.js";

const app = express();
app.use(express.json());

dotenv.config();

conectardb();

const dominiospermitidos = [process.env.FRONTEND_URL];

const corsoptions = {
    origin: function(origin, callback) {
        if(dominiospermitidos.indexOf(origin) !== -1) {
            //El origen del request esta permitido
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'))
        }
    }
}

app.use(cors(corsoptions))

app.use("/api/veterinarios", veterinarioroutes);
app.use("/api/pacientes", pacienteroutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando desde el puerto ${PORT}`)
    console.log('Se conecto bien')
})