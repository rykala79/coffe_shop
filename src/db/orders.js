import Mongo from 'mongodb';
import { db } from '.';
import { PAGE_SIZE } from '../constants/db';
import { getDate } from '../utils/date';

const { ObjectID } = Mongo;
const getCollection = () => db.collection('orders');

export const addOrder = async (order) => {
  const result = await getCollection().insertOne(order);
  return result.insertedId;
};

export const deleteOrder = async (orderId) => {
  const result = await getCollection().deleteOne({
    _id: new ObjectID(orderId),
  });
  return result.deletedCount;
};

export const getOrders = async (
  orderId,
  { dateFrom, dateTo, page = 0 } = {}
) => {
  const query = {};

  if (orderId !== 'all') {
    query._id = new ObjectID(orderId);
  }

  if (dateFrom || dateTo) {
    query.$and = [];

    if (dateFrom) {
      query.$and.push({
        date: {
          $gte: getDate(dateFrom),
        },
      });
    }

    if (dateTo) {
      query.$and.push({
        date: {
          $lte: getDate(dateTo),
        },
      });
    }
  }

  return getCollection()
    .find(query)
    .limit(PAGE_SIZE)
    .skip(Number(page) * PAGE_SIZE)
    .toArray();
};

export const updateOrder = async (orderData) => {
  const dataToUpdate = { ...orderData };
  delete dataToUpdate._id; // Delete ID before update

  const result = await getCollection().updateOne(
    {
      _id: new ObjectID(orderData._id),
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
