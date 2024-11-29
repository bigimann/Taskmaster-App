const {Router} = require('express');
const taskController = require('../controllers/task.controller')
const router = Router();

router.post('/', taskController.create)
router.get('/', taskController.getAll)
router.put('/:id', taskController.update)
router.delete('/:id', taskController.delete)

router.get('/title/:title', taskController.getTaskByTitle);

module.exports = router;