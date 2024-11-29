const { Router } = require('express');
const userController = require('../controllers/user.controller');
const router = Router();

router.post('/', userController.create); // Route to create a new user
router.post('/login', userController.login); // Route for user login
router.get('/', userController.getAll); // Route to get all users

module.exports = router;
