const axios = require("axios");

exports.getMarketData = async (req, res) => {
  try {
    const { data } = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 20,
        page: 1,
        sparkline: false
      }
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching market data from CoinGecko" });
  }
};

exports.getMarketChart = async (req, res) => {
  try {
    const { id, days } = req.params;
    
    // Convert CoinGecko ID to Binance Symbol
    let symbol = 'BTCUSDT';
    if (id.toLowerCase() === 'ethereum') symbol = 'ETHUSDT';
    if (id.toLowerCase() === 'solana') symbol = 'SOLUSDT';
    if (id.toLowerCase() === 'binancecoin') symbol = 'BNBUSDT';
    
    // Fetch from Binance
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=24`;
    const { data } = await axios.get(url);
    
    // Format Binance data to match expected CoinGecko structure: { prices: [ [timestamp, price] ] }
    const formattedPrices = data.map(candle => [
      candle[0], // Timestamp
      parseFloat(candle[4]) // Close price
    ]);

    res.json({ prices: formattedPrices });
  } catch (error) {
    console.error('Binance API Error:', error.message);
    res.status(500).json({ message: "Error fetching chart data" });
  }
};