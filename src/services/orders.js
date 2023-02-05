import Joi from '@hapi/joi';

import { addOrder, deleteOrder, getOrders, updateOrder } from '../db/orders';
import {
  MISSING_DATA,
  NOT_FOUND,
  PEER_ERROR,
  VALIDATION_ERROR,
} from '../constants/error';
import { idSchema } from '../constants/validation';
import { getEmployees } from '../db/staff';
import { getProducts } from '../db/products';

export default class Orders {
  idSchema = idSchema;

  productOrderSchema = Joi.object().keys({
    productId: this.idSchema.required(),
    name: Joi.string().required(),
    amount: Joi.number().greater(0).required(),
    unitPrice: Joi.number().greater(0).required(),
  });

  orderUpdateSchema = Joi.object().keys({
    _id: this.idSchema.required(),
    date: Joi.date(),
    location: Joi.string(),
    paidIn: Joi.string().valid('cash', 'card'),
    staffId: Joi.string().length(24),
    products: Joi.array().items(this.productOrderSchema).min(1),
    total: Joi.number().greater(0),
  });

  orderSchema = this.orderUpdateSchema.options({ presence: 'required' });

  addOrderSchema = this.orderSchema.keys({
    _id: Joi.any().strip().optional(),
  });

  static async _checkIfEmployeeExists(employeeId) {
    const existingEmployee = await getEmployees(employeeId);
    if (!existingEmployee) {
      const error = new Error(PEER_ERROR);
      error.reason = 'Missing related employee';
      throw error;
    }
  }

  static async _checkIfProductsExist(products) {
    const productIds = products.map((product) => product.productId);
    const dbProducts = await getProducts(productIds);
    if (dbProducts.length !== productIds.length) {
      const missingIds = productIds.filter(
        (productId) =>
          dbProducts.findIndex((product) => product._id === productId) === -1
      );
      const error = new Error(PEER_ERROR);
      error.reason = `Missing following products: ${missingIds.join(', ')}`;
      throw error;
    }
  }

  async addOrder(orderData) {
    if (!orderData) {
      throw new Error(MISSING_DATA);
    }

    try {
      await this.addOrderSchema.validateAsync(orderData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    await Orders._checkIfEmployeeExists(orderData.staffId);
    await Orders._checkIfEmployeeExists(orderData.products);

    return addOrder(orderData);
  }

  async deleteOrder(orderId) {
    try {
      await this.idSchema.validateAsync(orderId);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    const deletedCount = await deleteOrder(orderId);
    if (deletedCount === 0) {
      throw new Error(NOT_FOUND);
    }

    return true;
  }

  async getOrders(orderId, additionalParams) {
    return getOrders(orderId, additionalParams);
  }

  async updateOrder(orderData) {
    if (!orderData || Object.keys(orderData).length <= 1) {
      throw new Error(MISSING_DATA);
    }

    try {
      await this.orderUpdateSchema.validateAsync(orderData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    if (orderData.staffId) {
      await Orders._checkIfEmployeeExists(orderData.staffId);
    }
    if (orderData.products) {
      await Orders._checkIfProductsExist(orderData.products);
    }

    return updateOrder(orderData);
  }
}