const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validateUser = require('../middleware/validateUser');
const hashPassword = require('../middleware/hashPassword');

// Create a new user
router.post('/users', validateUser, hashPassword, userController.createUser);

// Get all users
router.get('/users', userController.getAllUsers);

// Get user by id
router.get('/users/:id', userController.getUserById);

// Update user
router.put('/users/:id', validateUser, hashPassword, userController.updateUser);

// Delete user
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
