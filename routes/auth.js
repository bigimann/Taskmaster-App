const { Router } = require('express');


const router = Router();
const userController = require('../controllers/user.controller')
router.post('/login', userController.login)
router.post('/users', userController.create)




module.exports = router;