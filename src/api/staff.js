import express from 'express';
import Staff from '../services/staff';
import errorResponse from '../utils/errorResponse';

const { Router } = express;
const router = Router();

const staff = new Staff();

router.get('/', (req, res) => {
  res.json({
    availableMethods: [
      'GET /:id?ratingAbove&ratingBelow&page&position',
      'POST /:id',
      'PUT',
      'DELETE /:id',
    ],
  });
});

router.get('/:id?', async (req, res) => {
  console.log(`GET STAFF ${req.params.id}`, req.query);

  try {
    const employeeData = await staff.getEmployees(req.params.id, {
      ratingAbove: req.query.ratingAbove,
      ratingBelow: req.query.ratingBelow,
      page: req.query.page,
      position: req.query.position,
    });

    return res.json({
      employees: employeeData,
    });
  } catch (err) {
    return errorResponse(err, res);
  }
});

router.post('/:id?', async (req, res) => {
  const employee = { _id: req.params.id, ...req.body };
  console.log('POST STAFF', employee);

  try {
    const updatedCount = await staff.updateEmployee(employee);
    return res.json({
      updated: updatedCount,
    });
  } catch (err) {
    return errorResponse(err, res);
  }
});

router.put('/:id?', async (req, res) => {
  const employee = { _id: req.params.id, ...req.body };
  console.log(`PUT STAFF`, employee);

  try {
    const employeeId = await staff.addEmployee(employee);
    return res.json({
      id: employeeId,
    });
  } catch (err) {
    return errorResponse(err, res);
  }
});

router.delete('/:id', async (req, res) => {
  console.log(`DELETE STAFF ${req.params.id}`);

  try {
    await staff.deleteEmployee(req.params.id);
    return res.json({
      ok: true,
    });
  } catch (err) {
    return errorResponse(err, res);
  }
});

export default router;