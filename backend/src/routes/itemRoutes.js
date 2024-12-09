const express = require('express');
const { getItems, createItem, updateItem, deleteItem } = require('../controllers/itemController');
const validateData = require('../middlewares/validateData');
const upload = require('../middlewares/uploadImage');
const authenticate = require('../middlewares/authenticate');
const { itemSchema } = require('../schemas/itemSchema');

const router = express.Router();

router.get('/', getItems);
router.post('/', authenticate, upload.single('image'), validateData(itemSchema), createItem);
router.put('/:id', authenticate, upload.single('image'), validateData(itemSchema), updateItem);
router.delete('/:id', authenticate, deleteItem); // Use deleteItem here

module.exports = router;
