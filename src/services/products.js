import Joi from '@hapi/joi';
import { MISSING_DATA, NOT_FOUND, VALIDATION_ERROR } from '../constants/error';
import { idSchema } from '../constants/validation';
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../db/products';

export default class Products {
  idSchema = idSchema;

  productUpdateSchema = Joi.object().keys({
    _id: this.idSchema.required(),
    name: Joi.string(),
    brand: Joi.string(),
    available: Joi.number(),
    lastOrderDate: Joi.date().optional(),
    unitPrice: Joi.number(),
    supplierName: Joi.string(),
    expirationDate: Joi.date(),
    categories: Joi.array().items(
      Joi.string().valid('coffee'),
      Joi.string().valid('food'),
      Joi.string().valid('accessories'),
      Joi.string().valid('equipment'),
      Joi.string().valid('premium')
    ),
  });

  productSchema = this.productUpdateSchema.options({ presence: 'required' });

  addProductSchema = this.productSchema.keys({
    _id: Joi.any().strip().optional(),
  });

  async addProduct(productData) {
    if (!productData) {
      throw new Error(MISSING_DATA);
    }

    try {
      await this.addProductSchema.validateAsync(productData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    return addProduct(productData);
  }

  async deleteProduct(productId) {
    try {
      await this.idSchema.validateAsync(productId);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    const deletedCount = await deleteProduct(productId);
    if (deletedCount === 0) {
      throw new Error(NOT_FOUND);
    }

    return true;
  }

  async getProducts(productId, additionalParams) {
    return getProducts(productId, additionalParams);
  }

  async updateProduct(productData) {
    // Throw when there is nothing to update
    if (!productData || Object.keys(productData).length <= 1) {
      throw new Error(MISSING_DATA);
    }

    try {
      await this.productUpdateSchema.validateAsync(productData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    return updateProduct(productData);
  }
}