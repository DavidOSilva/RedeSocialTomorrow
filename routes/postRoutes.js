const express = require("express")
const postController = require("../controllers/postController")
const authController = require("../controllers/authController")
const router = express.Router()

router.post('/create', authController.isLoggedIn, postController.create)
router.post('/delete/:postId', authController.isLoggedIn, postController.delete)

module.exports = router