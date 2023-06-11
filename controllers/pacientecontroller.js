import Paciente from "../models/Paciente.js";

const agregarpaciente = async (req, res) => {

    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id

    try {
        const pacienteguardado = await paciente.save();
        res.json(pacienteguardado);
    } catch (error) {
        console.log(error);
    }

}


const obtenerpacientes = async (req, res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);

    res.json(pacientes);
}

const obtenerpaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if (!paciente){
        return res.status(404).json({msg: "Mensaje no encontrado"})
    }

    //Evita que se acceda a un paciente que no es de ese veterinario que se autentico
    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: "Accion no valida"});
    }

    res.json(paciente);

}

const actualizarpaciente = async (req, res) => {
    
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if (!paciente){
        return res.status(404).json({msg: "Mensaje no encontrado"})
    }

    //Evita que se acceda a un paciente que no es de ese veterinario que se autentico
    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: "Accion no valida"});
    }

    //Actualizar paciente
    paciente.nombre = req.body.nombre
    paciente.propietario = req.body.propietario
    paciente.email = req.body.email
    paciente.fecha = req.body.fecha
    paciente.sintomas = req.body.sintomas

    try {
        const pacienteactualizado = await paciente.save();
        res.json(pacienteactualizado);
    } catch (error) {
        console.log(error)
    }

}

const eliminarpaciente = async (req, res) => {
    
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if (!paciente){
        return res.status(404).json({msg: "Mensaje no encontrado"})
    }

    //Evita que se acceda a un paciente que no es de ese veterinario que se autentico
    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: "Accion no valida"});
    }

    try {
        await paciente.deleteOne();
        res.json({msg: 'Paciente eliminado'});
    } catch (error) {
        console.log(error)
    }

}

export {
    agregarpaciente,
    obtenerpacientes,
    obtenerpaciente,
    actualizarpaciente,
    eliminarpaciente
}