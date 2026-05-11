const express = require('express');
const { register, login, getCurrentUser, refreshToken } = require('../controllers/auth.controller');
const auth = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getCurrentUser);
router.post('/refresh', auth, refreshToken);
router.post('/logout', auth, (req, res) => res.json({ success: true, message: 'Logged out' }));

module.exports = router;
