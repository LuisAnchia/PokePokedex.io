// Importar las dependencias
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

// Configurar el servidor Express
const app = express();
const port = 3500; // Puedes cambiar el puerto si es necesario

// Configurar la conexión a MongoDB
const uri = 'mongodb+srv://anchiaprogram1:' + encodeURIComponent('hw85jSFpdTgDPW1J') + '@cluster0.tdratzf.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useUnifiedTopology: true });
let cardsCollection;

(async () => {
  try {
    await client.connect();
    console.log('Conexión a MongoDB Atlas establecida');
    const db = client.db('Pickachu'); // Cambia 'Pickachu' por el nombre correcto de tu base de datos
    cardsCollection = db.collection('pokemones'); // Cambia 'pokemones' por el nombre correcto de tu colección
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error al conectar con MongoDB Atlas', error);
  }
})();

// Middleware para permitir el análisis de JSON en las solicitudes
app.use(express.json());
app.use(express.static('public'));

// Ruta para registrar un nuevo pokémon
app.post('/pokemon', async (req, res) => {
  try {
    const newPokemon = req.body;
    const result = await cardsCollection.insertOne(newPokemon);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el pokémon' });
  }
});

// Ruta para obtener todos los pokémones registrados
app.get('/pokemon', async (req, res) => {
  try {
    const pokemons = await cardsCollection.find().toArray();
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pokémones' });
  }
});

// Ruta para obtener un pokémon por su ID
app.get('/pokemon/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const pokemon = await cardsCollection.findOne({ _id: ObjectId(id) });
    if (!pokemon) {
      return res.status(404).json({ message: 'Pokémon no encontrado' });
    }
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el pokémon' });
  }
});

// Ruta para actualizar un pokémon por su ID
app.put('/pokemon/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedPokemon = req.body;
    const result = await cardsCollection.updateOne({ _id: ObjectId(id) }, { $set: updatedPokemon });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Pokémon no encontrado' });
    }
    res.json({ message: 'Pokémon actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el pokémon' });
  }
});

// Ruta para eliminar un pokémon por su ID
app.delete('/pokemon/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await cardsCollection.deleteOne({ _id: ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Pokémon no encontrado' });
    }
    res.json({ message: 'Pokémon eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el pokémon' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
