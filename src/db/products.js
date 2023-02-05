import Mongo from 'mongodb';
import { db } from '.';
import { PAGE_SIZE } from '../constants/db';

const { ObjectID } = Mongo;
const getCollection = () => db.collection('products');

export const addProduct = async (productData) => {
  const result = await getCollection().insertOne(productData);
  return result.insertedId;
};

export const deleteProduct = async (productId) => {
  const result = await getCollection().deleteOne({
    _id: new ObjectID(productId),
  });
  return result.deletedCount;
};

export const getProducts = (
  productIds,
  { amountAtLeast, brand, categories, page = 0 } = {}
) => {
  const query = {};

  if (productIds !== 'all') {
    query._id = { $in: productIds.map((productId) => new ObjectID(productId)) };
  }

  if (amountAtLeast) {
    query.available = { $gte: Number(amountAtLeast) };
  }

  if (brand) {
    query.brand = brand;
  }

  // Uses "and"!
  if (categories) {
    query.categories = { $all: categories.split(',') };
  }

  return getCollection()
    .find(query)
    .limit(PAGE_SIZE)
    .skip(Number(page) * PAGE_SIZE)
    .toArray();
};

export const updateProduct = async (productData) => {
  const dataToUpdate = { ...productData };
  delete dataToUpdate._id; // Delete ID before update

  const result = await getCollection().updateOne(
    {
      _id: new ObjectID(productData._id),
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