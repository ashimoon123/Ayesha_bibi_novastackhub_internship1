const News = require('../models/News');

const axios = require('axios');

exports.getNews = async (req, res) => {
  try {
    const { data } = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss');
    
    if (data && data.items) {
      const liveNews = data.items.map((item, index) => ({
        _id: index.toString(),
        slug: item.link.split('/').pop() || item.guid,
        title: item.title,
        category: item.categories && item.categories.length > 0 ? item.categories[0] : 'Market News',
        author: item.author,
        content: item.description.replace(/<[^>]+>/g, '').trim(),
        createdAt: item.pubDate,
        image: item.enclosure?.link || item.thumbnail || ''
      }));
      return res.json(liveNews);
    }
    
    // Fallback if rss fails
    const news = await News.find({}).sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    console.error('Error fetching live news', error);
    try {
      const news = await News.find({}).sort({ createdAt: -1 });
      res.json(news);
    } catch (dbError) {
      res.status(500).json({ message: dbError.message });
    }
  }
};

exports.getNewsBySlug = async (req, res) => {
  try {
    const news = await News.findOne({ slug: req.params.slug });
    if (news) res.json(news);
    else res.status(404).json({ message: 'News not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createNews = async (req, res) => {
  try {
    const news = new News(req.body);
    const createdNews = await news.save();
    res.status(201).json(createdNews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
