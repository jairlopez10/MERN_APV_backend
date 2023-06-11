import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import generarid from "../helpers/generarid.js";

const veterinarioschema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null,
    },
    token: {
        type: String,
        default: generarid(),
    },
    confirmado: {
        type: Boolean,
        default: false
    }
})

veterinarioschema.pre('save', async function(next) {

    if(!this.isModified("password")){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)

});

veterinarioschema.methods.comprobarpassword = async function(passwordformulario) {
    return await bcrypt.compare(passwordformulario, this.password)
}

const Veterinario = mongoose.model("Veterinario", veterinarioschema)

export default Veterinario;