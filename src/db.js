const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'AnnyAnya2211.',
    database: 'offersell'
});

connection.connect(err => {
    if (err) {
        console.error('Error al conectar con MySQL:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});

module.exports = connection;
