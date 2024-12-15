const express = require('express');
const { getItems, createItem, updateItem, deleteItem, getItemById, getItemsByUser } = require('../controllers/itemController');
const authenticate = require('../middlewares/authenticate');
const validateData = require('../middlewares/validateData');
const upload = require('../middlewares/uploadImage');
const { itemSchema } = require('../schemas/itemSchema');

const router = express.Router();

router.get('/', getItems);
router.get('/user', authenticate, getItemsByUser);
router.get('/:id', getItemById);
router.post('/', authenticate, upload.single('image'), validateData(itemSchema), createItem);
router.put('/:id', authenticate, upload.single('image'), validateData(itemSchema), updateItem);
router.delete('/:id', authenticate, deleteItem);

module.exports = router;