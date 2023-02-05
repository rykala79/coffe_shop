import Joi from '@hapi/joi';

import { MISSING_DATA, NOT_FOUND, VALIDATION_ERROR } from '../constants/error';
import { idSchema } from '../constants/validation';
import {
  addEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from '../db/staff';

export default class Staff {
  idSchema = idSchema;

  employeeUpdateSchema = Joi.object().keys({
    _id: this.idSchema.required(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    startedAt: Joi.date(),
    rating: Joi.number().min(0).max(10),
    position: Joi.array().items(
      Joi.string().valid('waiter'),
      Joi.string().valid('waitress'),
      Joi.string().valid('barista'),
      Joi.string().valid('cleaning'),
      Joi.string().valid('temp')
    ),
    monthlySalary: Joi.number().min(2000), // Optimistically setting this one :)
  });

  addEmployeeSchema = this.employeeUpdateSchema
    .options({ presence: 'required' })
    .keys({
      _id: Joi.any().strip().optional(),
    });

  async addEmployee(employeeData) {
    if (!employeeData) {
      throw new Error(MISSING_DATA);
    }

    try {
      await this.addEmployeeSchema.validateAsync(employeeData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    return addEmployee(employeeData);
  }

  async deleteEmployee(employeeId) {
    try {
      await this.idSchema.validateAsync(employeeId);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    const deletedCount = await deleteEmployee(employeeId);
    if (deletedCount === 0) {
      throw new Error(NOT_FOUND);
    }

    return true;
  }

  async getEmployees(employeeId, additionalParams) {
    return getEmployees(employeeId, additionalParams);
  }

  async updateEmployee(employeeData) {
    // Throw when there is nothing to update
    if (!employeeData || Object.keys(employeeData).length <= 1) {
      throw new Error(MISSING_DATA);
    }

    try {
      await this.employeeUpdateSchema.validateAsync(employeeData);
    } catch (err) {
      const error = new Error(VALIDATION_ERROR);
      error.reason = err.message;
      throw error;
    }

    return updateEmployee(employeeData);
  }
}