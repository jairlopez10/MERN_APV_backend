import Veterinario from '../models/Veterinario.js'
import generarJWT from '../helpers/generarJWT.js';
import generarid from '../helpers/generarid.js';
import emailregistro from '../helpers/emailregistro.js';
import emailolvidepassword from '../helpers/emailolvidepassword.js';

const registrar = async (req, res) => {
    const {email, nombre} = req.body

    //Prevenir usuarios duplicados
    const existeusuario = await Veterinario.findOne({email: email});

    if (existeusuario){
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({msg: error.message});
    }


    try {
        //Guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioguardado = await veterinario.save()

        //Enviar el email
        emailregistro({
            email,
            nombre,
            token: veterinarioguardado.token
        });

        res.json(veterinarioguardado);

    } catch (error) {
        console.log(error);
    }
};

const perfil =  (req, res) => {

    const { veterinario } = req;

    res.json(veterinario);
};


const confirmar = async (req, res) => {

    const {token} = req.params;

    const usuarioconfirmar = await Veterinario.findOne({token: token})

    if(!usuarioconfirmar) {
        const error = new Error('Token no valido');
        return res.status(404).json({msg: error.message});
    }

    try {
        usuarioconfirmar.token = null;
        usuarioconfirmar.confirmado = true;
        await usuarioconfirmar.save()

        res.json({msg: "Usuario confirmado correctamente"})
    } catch (error) {
        console.log(error);
    }

    
}

const autenticar = async (req, res) => {

    const { email, password } = req.body;

    //Comprobar si el usurio existe
    const usuario = await Veterinario.findOne({email});

    if(!usuario) {
        const error = new Error('Usuario no existe');
        return res.status(404).json({msg: error.message});
    }

    //Comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada")
        return res.status(403).json({msg: error.message});
    }

    //Revisar password
    if (await usuario.comprobarpassword(password)){
        //Autenticar 
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        })
    } else {
        const error = new Error("El password es incorrecto")
        return res.status(403).json({msg: error.message});
    }
    
    
}

const olvidepassword = async (req, res) => {

    const { email } = req.body;

    console.log(email);

    const existeveterinario = await Veterinario.findOne({email})
    
    if (!existeveterinario){
        const error = new Error("El usuario no existe");
        return res.status(400).json({msg: error.message});
    }

    try {
        existeveterinario.token = generarid();
        await existeveterinario.save();

        //Enviar email con instrucciones
        emailolvidepassword({
            email,
            nombre: existeveterinario.nombre,
            token: existeveterinario.token
        })


        res.json({msg: "Hemos enviado un email con las instrucciones"});
    } catch (error) {
        console.log(error);
    }

}

const comprobartoken = async (req, res) => {

    const { token } = req.params

    const tokenvalido = await Veterinario.findOne({token});

    if (tokenvalido) {
        //El token es valido el usuario existe
        res.json({msg: "Token valido y el usuario existe"})
    } else {
        const error = new Error("Token no valido");
        return res.status(400).json({msg: error.message})
    }

}

const nuevopassword = async (req, res) => {

    const { token } = req.params;
    const { password } =req.body;

    const veterinario = await Veterinario.findOne({token});
    if (!veterinario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinario.token = null;
        veterinario.password = password
        await veterinario.save();
        res.json({msg: "Password modificado correctamente"});
    } catch (error) {
        console.log(error);
    }


}

const actualizarperfil = async (req, res) => {

    const veterinario = await Veterinario.findById(req.params.id);

    if (!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    
    if (veterinario.email !== req.body.email) {
        const { email } = req.body
        const existemail = await Veterinario.findOne({email});

        if (existemail) {
            const error = new Error('Ese email ya esta en uso');
            return res.status(400).json({msg: error.message});
        }

    }

    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioactualizado = await veterinario.save();
        res.json(veterinarioactualizado);

    } catch (error) {
        console.log(error);
    }

}

const actualizarpassword = async (req, res) => {
    
    //Leer los datos
    const { pwd_actual, pwd_nuevo } = req.body;
    const { id } = req.veterinario;

    //Comprobar que el veterinario existe
    const veterinario = await Veterinario.findById(id);

    if (!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    //Comprobar su password
    if (await veterinario.comprobarpassword(pwd_actual)){
        //Almacenar nuevo password
        console.log('Correcto')
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({msg: 'Password guardado correctamente'})
    } else {
        const error = new Error('Password actual incorrecto');
        return res.status(400).json({msg: error.message});
    }


    


    


}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidepassword,
    comprobartoken,
    nuevopassword,
    actualizarperfil,
    actualizarpassword
}