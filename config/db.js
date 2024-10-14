require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no banco de dados:', err);
    return;
  }
  console.log('Conectado ao MySQL.');

  const createDatabase = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`;

  connection.query(createDatabase, (err) => {
    if (err) {
      console.error('Erro ao criar a base de dados:', err);
    } else {
      console.log('Base de dados verificada/criada!');

      // Agora conecte-se à base de dados
      connection.changeUser({ database: process.env.DB_NAME }, (err) => {
        if (err) {
          console.error('Erro ao mudar para a base de dados:', err);
          return;
        }
        
        // Criação das tabelas
        const createUsersTable = `
          CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            lastname VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE
          )
        `;

        const createPostsTable = `
        CREATE TABLE IF NOT EXISTS posts (
          user_id INT NOT NULL,
          post_id INT NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (user_id, post_id)
        )
      `;

        connection.query(createUsersTable, (err) => {
          if (err) {
            console.error('Erro ao criar a tabela de usuários:', err);
          } else {
            console.log('Tabela de usuários verificada/criada!');
          }
        });

        connection.query(createPostsTable, (err) => {
          if (err) {
            console.error('Erro ao criar a tabela de postagens:', err);
          } else {
            console.log('Tabela de postagens verificada/criada!');
          }
        });
      });
    }
  });
});

module.exports = connection;
