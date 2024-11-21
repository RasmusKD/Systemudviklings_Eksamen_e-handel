const Joi = require('joi');

const itemSchema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    price: Joi.number().positive().required(),
    category: Joi.string().required(),
    canBeSent: Joi.boolean().required(),
    image: Joi.string().uri().optional(),
});

module.exports = { itemSchema };
