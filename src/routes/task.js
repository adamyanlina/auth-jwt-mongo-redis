const router = require('express').Router();
const { verifyAccessToken } = require('../helpers/jwt');
const { getAll, getById, remove, create, update } = require('../controllers/task');

// localhost:5000/api/tasks/...
router.get('/', verifyAccessToken, getAll)
      .get('/:id', verifyAccessToken, getById)
      .post('/create', verifyAccessToken, create)
      .patch('/update/:id', verifyAccessToken, update)
      .delete('/delete/:id', verifyAccessToken, remove);

module.exports = router;
