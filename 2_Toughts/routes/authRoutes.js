const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');


router.get('/login', AuthController.login);
router.post('/login', AuthController.loginSave);
router.get('/register', AuthController.register);
router.post('/register', AuthController.registerSave);
router.get('/logout', AuthController.logout);

module.exports = router;