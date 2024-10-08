const express = require('express');
const {urlencoded, json} = require('express');
const router = require('./routes/signos.routes.js');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

app.use('/v1/signos', router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
