/**
 * Primeiramente importamos o roteador do express, e os controladores
 */
const router = require('express').Router();
const UserListController = require('../../controllers/UserListController');

router.get('/users', UserListController.read);

module.exports = router;
