const axios = require('axios');

exports.getMarketData = async (req, res) => {
  try {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 20,
        page: 1,
        sparkline: false
      }
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching market data' });
  }
};

exports.getMarketChart = async (req, res) => {
  try {
    const { id, days } = req.params;
    const { data } = await axios.get(https://api.coingecko.com/api/v3/coins//market_chart, {
      params: {
        vs_currency: 'usd',
        days: days || 1
      }
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chart data' });
  }
};
