const express = require('express');
const router = express.Router();
const { getMarketData, getMarketChart } = require('../controllers/marketController');

router.get('/', getMarketData);
router.get('/:id/chart/:days', getMarketChart);

module.exports = router;
