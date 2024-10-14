const express = require("express")
const authController = require("../controllers/authController")
const db = require("../config/db")

const router = express.Router()

router.get('/', authController.isLoggedIn,  (req, res) => {
   return res.render('index', { user: req.user, posts: req.posts });
})

router.get('/register',  (req, res) => {
    res.render('register')
}) 

router.get('/login',  (req, res) => {
    res.render('login')
})

// As proximas rotas são um pouco diferentes, já que antes o middleware é chamado.
router.get('/profile', authController.isLoggedIn,  (req, res) => {
    if (req.user){
        const sortedPosts = req.posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Ordena os posts pela data de criação (created_at)
        return res.render('profile', { user: req.user, posts: req.posts });
    } 
    else res.redirect('/login') // Redireciona para a página de login caso não esteja autenticado.
})

router.get('/error', authController.isLoggedIn, (req, res) => {
    res.render('error', { user: req.user});
});

router.get('/users/:id', authController.isLoggedIn, (req, res) => {
    const userId = req.params.id;
    if (userId == req.user.id) return res.redirect('/profile')

    db.query('SELECT * FROM users WHERE id = ?', [userId], (error, usersResults) => {
        if (error) return res.status(500).send('Erro ao buscar usuário');

        db.query('SELECT * FROM posts WHERE user_id = ?', [userId], (error, postsResults) => {
            if (error) return res.status(500).send('Erro ao buscar posts');
            const user = usersResults[0];
            const posts = postsResults
            return res.render('user', { user, posts }); // Renderiza a página com os dados do usuário e seus posts
        });
    });
});

module.exports = router