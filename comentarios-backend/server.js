const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// CONEXIÓN A MongoDB
mongoose.connect('mongodb://localhost:27017/comentariosDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Modelo de Comentario
const comentarioSchema = new mongoose.Schema({
    username: String, // Nuevo campo para el nombre del usuario
    text: String,
    rating: Number,
    createdAt: { type: Date, default: Date.now },
});

const Comentario = mongoose.model('Comentario', comentarioSchema);

// Endpoints
// Guardar un comentario
app.post('/api/comentarios', async (req, res) => {
    try {
        const { username, text, rating } = req.body;
        const nuevoComentario = new Comentario({ username, text, rating });
        await nuevoComentario.save();
        res.status(201).json(nuevoComentario);
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar el comentario' });
    }
});

// Obtener todos los comentarios
app.get('/api/comentarios', async (req, res) => {
    try {
        const comentarios = await Comentario.find().sort({ createdAt: -1 });
        res.status(200).json(comentarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los comentarios' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});