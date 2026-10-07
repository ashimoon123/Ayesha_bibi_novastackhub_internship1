const express = require('express');
const router = express.Router();
const { approvePayroll, getPayrollStatus } = require('../controllers/payrollController');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/rbac');

// POST /api/v1/payroll/approve → Manager and SuperAdmin only
router.post(
  '/approve',
  authenticate,
  checkRole(['SuperAdmin', 'Manager']),
  approvePayroll
);

// GET /api/v1/payroll/status → All authenticated roles
router.get(
  '/status',
  authenticate,
  checkRole(['SuperAdmin', 'Manager', 'Employee']),
  getPayrollStatus
);

module.exports = router;
