const express = require("express")
const db = require("./config/db")
const path = require("path")
const cookieParser = require("cookie-parser")
require('./helpers/helpers') // Funções usadas no front-end.

const app = express();
const publicDir = path.join(__dirname, './public')

app.use(express.static(publicDir)) // Configura o arquivo estático style.
app.use(express.urlencoded({ extended: false})) // Processa os dados codificados em URL, como os enviados por formulários HTML.
app.use(express.json()) // Garante que os dados dos formularios sejam JSONs.
app.use(cookieParser())

// Configura o mecanismo de visualização, neste caso o Handlebars.
app.set('view engine', 'hbs')

// Define as rotas.
app.use('/', require('./routes/pagesRoutes'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/post', require('./routes/postRoutes'))
app.use((req, res) =>  res.status(404).redirect('/error')) // Lidando com as páginas que não existem.

// Define a porta em que iremos escutar as requisições.
const port = 3000
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}.`)
})