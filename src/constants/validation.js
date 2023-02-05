import Joi from '@hapi/joi';

export const idSchema = Joi.string().length(24);

export default {idSchema,};