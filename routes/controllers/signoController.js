const fs = require('fs').promises;
const path = require('path');

const getAllSignos = async (req, res)=>{
    const signo = await fs.readFile(path.join(__dirname,'../../db/signos.json'));
    const signosJson = JSON.parse(signo)
    res.json(signosJson);
}

const getOneSigno = async (req, res)=>{
    const oneSigno = req.params.signo;
    const allSignos = await fs.readFile(path.join(__dirname,'../../db/signos.json'));
    const objSignos = JSON.parse(allSignos);
    const result = objSignos[oneSigno];
    res.json(result)
}

const updateSigno = async (req, res)=>{
    const signoEditar = req.params.signoEditar;
    const {textoEditar} = req.body;
    const allSignos = await fs.readFile(path.join(__dirname,'../../db/signos.json'));
    const objSignos = JSON.parse(allSignos);

    const objUpdate = {
        ...objSignos,
        [signoEditar]: textoEditar
    }

    // console.log(objUpdate);
    await fs.writeFile(path.join(__dirname,'../../db/signos.json'), JSON.stringify(objUpdate, null, 2), {encoding: 'utf-8'})

    res.json({
        message: "Updated"
    })
}

const CryptoJS = require('crypto-js'); // Asegúrate de tener CryptoJS para el hash de la contraseña
const moment = require('moment-timezone'); // Para manejar la fecha y hora
const { MongoClient } = require('mongodb'); // MongoDB client

const uri = "your-mongodb-uri"; // Tu conexión a MongoDB
const client = new MongoClient(uri);

const loginCompare = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Conexión a la base de datos MongoDB
        await client.connect();
        const db = client.db('horoscopo');
        const usersCollection = db.collection('users');
        const adminsCollection = db.collection('admins');

        // Hashear la contraseña
        const hashedPassword = CryptoJS.SHA256(password, process.env.CODE_SECRET_DATA).toString();

        // Buscar al administrador
        const admin = await adminsCollection.findOne({ username, password: hashedPassword });
        if (admin) {
            // Almacenar log de inicio de sesión del admin
            const currentDateTime = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
            await db.collection('user_info').insertOne({ username, role: 'Admin', date: currentDateTime });

            return res.json({ status: 'Admin', user: username });
        }

        // Buscar al usuario
        const user = await usersCollection.findOne({ username, password: hashedPassword });
        if (user) {
            // Almacenar log de inicio de sesión del usuario
            const currentDateTime = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
            await db.collection('user_info').insertOne({ username, role: 'User', date: currentDateTime });

            return res.json({ status: 'User', user: username });
        }

        return res.status(401).json({ status: 'Error', message: 'Usuario o contraseña incorrectos' });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ status: 'Error', message: 'Error en el servidor' });
    } finally {
        await client.close(); // Cerrar la conexión a la base de datos
    }
};


module.exports = {
    getAllSignos,
    getOneSigno,
    updateSigno,
    loginCompare
}