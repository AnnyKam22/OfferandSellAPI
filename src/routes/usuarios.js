const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => res.render('inicio'));

router.get('/registro', (req, res) => res.render('registro'));

router.post('/registro', async (req, res) => {
  const { nombre, correo, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO usuario (nombre, correo, password) VALUES (?, ?, ?)',
      [nombre, correo, hash],
      (err) => {
        if (err) {
          if (req.accepts('json')) {
            return res.status(500).json({ error: 'Error al registrar usuario' });
          }
          return res.status(500).send('Error al registrar usuario');
        }
        if (req.accepts('json')) {
          return res.status(201).json({ mensaje: 'Usuario registrado con éxito' });
        }
        res.redirect('/login');
      }
    );
  } catch (error) {
    if (req.accepts('json')) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    res.status(500).send('Error en el servidor');
  }
});

router.get('/login', (req, res) => res.render('login'));

router.post('/login', (req, res) => {
  const { correo, password } = req.body;
  db.query('SELECT * FROM usuario WHERE correo = ?', [correo], async (err, results) => {
    if (err) {
      if (req.accepts('json')) {
        return res.status(500).json({ error: 'Error en la base de datos' });
      }
      return res.status(500).send('Error en la base de datos');
    }
    if (results.length > 0) {
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.usuario = user;
        if (req.accepts('json')) {
          return res.json({
            mensaje: 'Login exitoso',
            usuario: {
              id_usuario: user.id_usuario,
              nombre: user.nombre,
              correo: user.correo
            }
          });
        }
        return res.redirect('/productos/lista');
      }
    }
    if (req.accepts('json')) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    res.status(401).send('Usuario o contraseña incorrectos');
  });
});

module.exports = router;


