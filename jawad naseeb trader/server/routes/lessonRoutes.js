const express = require('express');
const router = express.Router();
const { getLessons, createLesson } = require('../controllers/lessonController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/:courseId').get(getLessons);
router.route('/').post(protect, admin, createLesson);

module.exports = router;
