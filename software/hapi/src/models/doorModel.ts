import * as Joi from "joi";

export const createDoorModel = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required()
});

export const updateDoorModel = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    completed: Joi.boolean()
});


export const doorModel = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    completed: Joi.boolean(),
    createdDate: Joi.date(),
    updatedAt: Joi.date()
}).label("Door Model").description("Json body that represents a door.");
