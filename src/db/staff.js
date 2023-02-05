import Mongo from 'mongodb';
import { db } from '.';
import { PAGE_SIZE } from '../constants/db';

const { ObjectID } = Mongo;
const getCollection = () => db.collection('staff');

export const addEmployee = async (employee) => {
  const result = await getCollection().insertOne(employee);
  return result.insertedId;
};

export const deleteEmployee = async (employeeId) => {
  const result = await getCollection().deleteOne({
    _id: new ObjectID(employeeId),
  });

  return result.deletedCount;
};

export const getEmployees = async (
  employeeId,
  { ratingAbove, ratingBelow, page = 0, position } = {}
) => {
  const query = {};

  if (employeeId !== 'all') {
    query._id = new ObjectID(employeeId);
  }

  if (ratingAbove || ratingBelow) {
    query.$and = [];

    if (ratingAbove) {
      query.$and.push({
        rating: {
          $gte: Number(ratingAbove),
        },
      });
    }

    if (ratingBelow) {
      query.$and.push({
        rating: {
          $lte: Number(ratingBelow),
        },
      });
    }
  }

  if (position) {
    query.position = position;
  }

  return getCollection()
    .find(query)
    .limit(PAGE_SIZE)
    .skip(Number(page) * PAGE_SIZE)
    .toArray();
};

export const updateEmployee = async (employeeData) => {
  const dataToUpdate = { ...employeeData };
  delete dataToUpdate._id; // Delete ID before update

  const result = await getCollection().updateOne(
    {
      _id: new ObjectID(employeeData._id),
    },
    {
      $set: dataToUpdate,
    },
    {
      upsert: false,
    }
  );

  return result.modifiedCount;
};