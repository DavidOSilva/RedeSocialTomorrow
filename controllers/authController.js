const db = require("../config/db")
require('dotenv').config();
const jwt = require("jsonwebtoken")
const bcrypt = require("dcryptjs")
const {promisify} = require("util")

exports.register = (req, res) => {

    const { name, lastname, email, password, passConfirm } = req.body // Captura todos os dados.
    
    // Vamos tratar alguns erros, por exemplo se o usuario já foi cadastrado.
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error) console.log(error)
            
        if (results.length > 0) return res.render('register', {
            errorMsg: 'Este e-mail já foi cadastrado em nosso banco de dados!'
        })

        else if(password.length < 8) return res.render('register', {
            errorMsg: 'A senha precisa conter pelo menos 8 caracteres!'
        })

        else if(passConfirm !== password) return res.render('register', {
            errorMsg: 'As senhas digitadas são diferentes!'
        })

        else {
            // Precisamos salvar a senha criptografada, mas este é processo assíncrono. (leva alguns segundos)
            let hashedPassword = await bcrypt.hash(password, 8)
            db.query('INSERT INTO users SET ?', {name: name, lastname:lastname, email:email, password:hashedPassword}, (error, results) => {
                if(error) console.log(error)
                else return res.render('register', { 
                    successMsg: 'Usuário registrado!'
                })
            })
        }
    })
}

exports.login = (req, res) => {
    
    const {email, password} = req.body
    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if(error) console.log(error)

        else if (results.length == 0) return res.status(404).render('login', {
            errorMsg: 'Este e-mail ainda não foi cadastrado!'
        })

        else if (!(await bcrypt.compare(password, results[0].password))) return res.status(401).render('login', {
            errorMsg: 'Senha incorreta. Tente novamente!'
        })

        else {
            const {id, name, lastname} = results[0] // Resgata os dados do banco de dados.
            const token = jwt.sign({ id, name, lastname }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRATION // Criando o JWT.
            })
            const cookieOptions = {
                expires: new Date(Date.now() + parseInt(process.env.JWT_EXPIRATION, 10) * 1000), // Convertendo para ms.
                httpOnly: true, // Pelo o que entendi é uma medida de segurança.
            }
            res.cookie('jwt', token, cookieOptions) // Cria o cookie.
            res.status(200).redirect('/')
        }
    }) 

}

// Middleware para checar se o usuário já fez o login.
exports.isLoggedIn = async (req, res, next) => {
    if(req.cookies.jwt){
        try {
            // 1. Verifica se existe um token.
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET) // promisify transforma jwt.verify em uma Promise, permitindo o uso de await para simplificar a verificação do token.
            
            // 2. Verifica se usuário ainda existe.
            db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, users) => {
                if(!users) next()

                // Busca os posts do usuário.
                db.query('SELECT * FROM posts WHERE user_id = ?', [users[0].id], (error, posts) => {
                    if (error) return next();
                    req.user = users[0]
                    req.posts = posts
                    return next();
                });
            })
        }
        catch(error) {
            console.log(error)
            return next()
        }
    }
    else next()
}

exports.logout = async (req, res) => {
    res.cookie('jwt', '', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly:true}
    ) // Sobrescreve o cookie jwt que é criado no login.
    res.status(200).redirect('/')
}