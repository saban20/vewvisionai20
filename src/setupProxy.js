const { createProxyMiddleware } = require('http-proxy-middleware');
const { fetchProducts, getRecommendedProducts } = require('./mocks/api');

/**
 * Configure the development server to handle our mock API endpoints
 */
module.exports = function(app) {
  // Mock API middleware
  app.use('/api', async (req, res, next) => {
    // Mock 100ms network latency
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      // Handle GET /api/products endpoint
      if (req.method === 'GET' && req.path === '/products') {
        const filters = req.query;
        const products = await fetchProducts(filters);
        return res.json(products);
      }
      
      // Handle POST /api/products/recommended endpoint
      if (req.method === 'POST' && req.path === '/products/recommended') {
        const { measurements, recommendations } = req.body;
        const recommendedProducts = await getRecommendedProducts(measurements, recommendations);
        return res.json(recommendedProducts);
      }
      
      // Handle POST /api/ai/recommend endpoint
      if (req.method === 'POST' && req.path === '/ai/recommend') {
        const { measurements } = req.body;
        
        // Mock AI service recommendation response
        const mockRecommendation = {
          frameShapes: ['Rectangle', 'Square', 'Wayfarer'],
          frameStyles: ['Bold', 'Angular', 'Geometric'],
          colors: ['Black', 'Tortoise', 'Navy'],
          confidence: 0.85
        };
        
        return res.json(mockRecommendation);
      }
      
      // If no mock endpoint matched, pass to next middleware
      next();
    } catch (error) {
      console.error('Mock API error:', error);
      res.status(500).json({ error: 'Mock API error' });
    }
  });
  
  // For any other requests, proxy to actual backend in production
  if (process.env.NODE_ENV === 'production') {
    app.use('/api', createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || 'http://localhost:5000',
      changeOrigin: true,
    }));
  }
}; 