const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/employeeController');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/rbac');

// All authenticated users can access their profile
router.get(
  '/profile',
  authenticate,
  checkRole(['SuperAdmin', 'Manager', 'Employee']),
  getProfile
);

router.put(
  '/profile',
  authenticate,
  checkRole(['SuperAdmin', 'Manager', 'Employee']),
  updateProfile
);

module.exports = router;
