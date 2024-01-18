const express = require("express")

const { register, login, logout, getProfile } = require('./../controllers/user.controller.js')
const router = express.Router();
router.post('/regiter', register)
router.post('/login', login);
router.get('/logout'.logout);
router.get('/me', getProfile)

module.exports = router;