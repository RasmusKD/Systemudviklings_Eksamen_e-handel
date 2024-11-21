const express = require('express');
const { getItems, createItem } = require('../controllers/itemController');
const validateData = require('../middlewares/validateData');
const upload = require('../middlewares/uploadImage');
const { itemSchema } = require('../schemas/itemSchema');

const router = express.Router();

router.get('/', getItems);
router.post('/', upload.single('image'), validateData(itemSchema), createItem);

module.exports = router;
