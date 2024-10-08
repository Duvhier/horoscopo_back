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

const loginCompare = async (req, res)=>{
    try {
        const { username, password } = req.body;
    
        const usersData = await fs.readFile(path.join(__dirname, '../../db/users.json'), 'utf8');
        const users = JSON.parse(usersData).users;
    
        const adminsData = await fs.readFile(path.join(__dirname, '../../db/admins.json'), 'utf8');
        const admins = JSON.parse(adminsData).admins;
    
        const admin = admins.find(admin => admin.username === username && admin.password === password);
        if (admin) {
            return res.json({ status: 'Admin'});
        }
    
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            return res.json({ status: 'User'});
        }
    
        return res.status(401).json({ status: 'Error', message: 'Usuario o contraseña incorrectos'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'Error', message: 'Error en el servidor'});
    }
};

module.exports = {
    getAllSignos,
    getOneSigno,
    updateSigno,
    loginCompare
}