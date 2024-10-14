const db = require("../config/db")

exports.create = (req, res) => {
    if (!req.user) return res.redirect('/login') // Se o jwt expirar ele manda para o login.
        
    const { content } = req.body;
    const { id: userId, name, lastname } = req.user

    // Verifica o maior post_id
    db.query('SELECT MAX(post_id) AS maxPostId FROM posts WHERE user_id = ?', [userId], async (error, results) => {
        if(error) console.error(error)

        let newPostId = 1 //Por padrão cria a primeira postagem (post_id = 1).

        if (results.length > 0) newPostId = results[0].maxPostId + 1 // Se já existir posts, pega o maximo post_id e incrementa.

        // Cria um novo post no banco de dados.
        db.query('INSERT INTO posts (post_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())', [newPostId, userId, content], (error, results) => {
            if(error) console.error(error)
            res.redirect('/profile')
        })
    })

}

exports.delete = (req, res) => {
    if (!req.user) return res.redirect('/login')

    const postId = parseInt(req.params.postId)
    const { id: userId } = req.user
    
    // Deleta o post.
    db.query('DELETE FROM posts WHERE post_id = ? AND user_id = ?', [postId, userId], (error) => {
        if (error) {
            console.error(error)
            return res.status(500).send('Erro ao deletar o post');
        }

        // Seleciona todos os posts do usuário com post_id maior que o post deletado.
        db.query('SELECT post_id FROM posts WHERE user_id = ? AND post_id > ? ORDER BY post_id', [userId, postId], (error, results) => {
            if (error) {
                console.error(error)
                return res.status(500).send('Erro ao atualizar os IDs dos posts')
            }

            // Atualiza todos os post_id maiores que o deletado.
            results.forEach(post => {
                const newPostId = post.post_id - 1
                db.query('UPDATE posts SET post_id = ? WHERE user_id = ? AND post_id = ?', [newPostId, userId, post.post_id], (error) => {
                    if (error) console.error(error);
                });
            });

            // Redireciona após a operação ser concluída
            res.redirect('/profile');
        });
    });
};
