import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db.js';

await pool.query(`
    create table if not exists movies (id integer primary key auto_increment, title varchar(255), year integer, genre varchar(255))
`);

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json()); //middlewares
app.use(cors());



app.get('/', (req, res) => {
  res.json({ message: 'Servidor corriendo perfectamente' });
});

app.get('/movies', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM movies');
    res.json({ rows });
  } catch (err) {
    res.status(500).json({ message: 'tenemos un error', error: err });
  }
});

app.post('/movies', async (req, res) => {
  const { title, year, genre } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO movies (title, year, genre) VALUES (?, ?, ?)',
      [title, year, genre] // Placeholders!
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ msg: 'Falló', err: error });
  }
});

app.delete('/movies/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM movies WHERE id=?', [id]);

    //Verifique si eliminamos algo
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pelicula no encontrada' });
    }

    res.status(200).json({ message: 'Pelicula eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor al eliminar', err: error });
  }
});

app.listen(PORT, () => {
  console.log('servidor corriendo en el puerto 3000 🎇');
});