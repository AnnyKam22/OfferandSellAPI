require('dotenv').config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/inicio');
});

app.get('/inicio', (req, res) => {
  res.render('inicio');
});

app.get('/registro', (req, res) => {
  res.render('registro', { error: null });
});

app.post('/registro', (req, res) => {
  const { nombre, contacto, correo, password, password2 } = req.body;
  if (!nombre || !correo || !password || password !== password2) {
    return res.render('registro', { error: 'Datos inválidos o contraseñas no coinciden' });
  }
  return res.redirect('/inicio');
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { correo, password } = req.body;
  if (!correo || !password) {
    return res.render('login', { error: 'Ingrese correo y contraseña' });
  }
  return res.redirect('/inicio');
});

app.post('/api/usuarios', (req, res) => {
  const { nombre, contacto, correo, password } = req.body;
  if (!nombre || !correo || !password) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios (nombre, correo, password).' });
  }

  const hashed = bcrypt.hashSync(password, 10);
  const sql = 'INSERT INTO usuarios (nombre, contacto, correo, password) VALUES (?, ?, ?, ?)';

  db.query(sql, [nombre, contacto || null, correo, hashed], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ mensaje: 'El correo ya está registrado.' });
      }
      return res.status(500).json({ mensaje: 'Error al registrar usuario.', detalle: err.message });
    }
    res.status(201).json({ mensaje: 'Usuario registrado', id: result.insertId });
  });
});

app.post('/api/login', (req, res) => {
  const { correo, password } = req.body;
  if (!correo || !password) {
    return res.status(400).json({ mensaje: 'Ingrese correo y contraseña.' });
  }

  const sql = 'SELECT id, nombre, correo, password FROM usuarios WHERE correo = ? LIMIT 1';
  db.query(sql, [correo], (err, rows) => {
    if (err) return res.status(500).json({ mensaje: 'Error en el servidor.', detalle: err.message });
    if (!rows || rows.length === 0) return res.status(401).json({ mensaje: 'Credenciales inválidas.' });

    const usuario = rows[0];
    const ok = bcrypt.compareSync(password, usuario.password);
    if (!ok) return res.status(401).json({ mensaje: 'Credenciales inválidas.' });

    res.json({ mensaje: 'Login exitoso', usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo } });
  });
});

app.get('/api/usuarios', (req, res) => {
  db.query('SELECT id, nombre, contacto, correo, created_at FROM usuarios ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ mensaje: 'Error al listar usuarios.', detalle: err.message });
    res.json(rows);
  });
});

app.get('/api/usuarios/:id', (req, res) => {
  db.query('SELECT id, nombre, contacto, correo, created_at FROM usuarios WHERE id = ? LIMIT 1', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ mensaje: 'Error al consultar usuario.', detalle: err.message });
    if (!rows || rows.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    res.json(rows[0]);
  });
});

app.put('/api/usuarios/:id', (req, res) => {
  const { nombre, contacto } = req.body;
  if (!nombre && !contacto) return res.status(400).json({ mensaje: 'Nada para actualizar.' });

  const sql = 'UPDATE usuarios SET nombre = COALESCE(?, nombre), contacto = COALESCE(?, contacto) WHERE id = ?';
  db.query(sql, [nombre || null, contacto || null, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al actualizar usuario.', detalle: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    res.json({ mensaje: 'Usuario actualizado' });
  });
});

app.delete('/api/usuarios/:id', (req, res) => {
  db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al eliminar usuario.', detalle: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    res.status(204).send();
  });
});

app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});