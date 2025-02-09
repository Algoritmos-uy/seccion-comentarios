const mongoose = require('mongoose');

// Conectar a la base de datos
mongoose.connect('mongodb://localhost:27017/comentariosDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Definir el esquema y modelo de Comentario
const comentarioSchema = new mongoose.Schema({
    username: String,
    text: String,
    rating: Number,
    createdAt: { type: Date, default: Date.now },
});

const Comentario = mongoose.model('Comentario', comentarioSchema);

// Eliminar comentarios de prueba
async function eliminarComentariosDePrueba() {
    try {
        // Eliminar todos los comentarios
        await Comentario.deleteMany({});
        console.log('Todos los comentarios han sido eliminados.');

        // O eliminar solo los comentarios de prueba
         await Comentario.deleteMany({ username: "test" });
         console.log('Comentarios de prueba eliminados.');
    } catch (error) {
        console.error('Error al eliminar comentarios:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Ejecutar la función
eliminarComentariosDePrueba();