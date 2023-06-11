import mongoose from 'mongoose';

const conectardb = async () => {
    try {
        
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        const url = `${db.connection.host}: ${db.connection.port}`
        console.log(`MongoDB conectado en ${url}`);

    } catch (error) {
        console.log(`error: ${error.message}`);
        console.log('Es error de la db');
        process.exit(1);
    }
}

export default conectardb;