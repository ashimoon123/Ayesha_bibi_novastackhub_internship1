const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/rbac');

// GET /api/v1/users → SuperAdmin only
router.get(
  '/',
  authenticate,
  checkRole(['SuperAdmin']),
  getAllUsers
);

// PATCH /api/v1/users/:id/role → SuperAdmin only
router.patch(
  '/:id/role',
  authenticate,
  checkRole(['SuperAdmin']),
  updateUserRole
);

// DELETE /api/v1/users/:id → SuperAdmin only
router.delete(
  '/:id',
  authenticate,
  checkRole(['SuperAdmin']),
  deleteUser
);

module.exports = router;
