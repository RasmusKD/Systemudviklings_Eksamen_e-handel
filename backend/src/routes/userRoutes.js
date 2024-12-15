const express = require('express');
const { register, login, getProfile, updateProfile, getUserById } = require('../controllers/userController');
const validateData = require('../middlewares/validateData');
const { registerSchema, loginSchema } = require('../schemas/userSchema');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.post('/register', validateData(registerSchema), register);
router.post('/login', validateData(loginSchema), login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/:userId', authenticate, getUserById);

module.exports = router;

