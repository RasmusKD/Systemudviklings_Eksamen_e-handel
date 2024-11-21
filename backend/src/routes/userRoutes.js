const express = require('express');
const { register, login } = require('../controllers/userController');
const validateData = require('../middlewares/validateData');
const { registerSchema, loginSchema } = require('../schemas/userSchema');

const router = express.Router();

router.post('/register', validateData(registerSchema), register);
router.post('/login', validateData(loginSchema), login);

module.exports = router;
