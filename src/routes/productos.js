const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/publicar', (req, res) => {
  if (!req.session.usuario) return res.redirect('/login');
  res.render('publicar');
});

router.post('/publicar', (req, res) => {
  if (!req.session.usuario) return res.status(401).send('No autorizado');
  const { titulo, descripcion, precio, estado } = req.body;
  db.query(
    'INSERT INTO producto (id_usuario, id_categoria, titulo, descripcion, precio, estado) VALUES (?, 1, ?, ?, ?, ?)',
    [req.session.usuario.id_usuario, titulo, descripcion, precio, estado],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al publicar producto');
      }
      res.redirect('/productos/lista');
    }
  );
});

router.get('/lista', (req, res) => {
  db.query('SELECT * FROM producto', (err, productos) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al obtener productos');
    }
    res.render('lista_productos', { productos });
  });
});

module.exports = router;
