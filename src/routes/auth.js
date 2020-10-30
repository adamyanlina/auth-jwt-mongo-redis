const router = require('express').Router();
const { login, register, refreshToken, logout } = require('../controllers/auth');

// localhost:5000/api/auth/...
router.post('/login', login)
router.post('/register', register)
      .post('/refresh-token', refreshToken)
      .delete('/logout', logout);

module.exports = router;
