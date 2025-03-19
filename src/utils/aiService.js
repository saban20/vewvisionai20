/**
 * AI Service
 * 
 * This service handles API calls to AI-powered endpoints for face analysis
 * and product recommendations.
 */

class AIService {
  /**
   * Get eyewear recommendations based on facial measurements
   * @param {Object} measurements - Facial measurements from face scanner
   * @returns {Promise<Object>} Recommendation data
   */
  async getEyewearRecommendations(measurements) {
    try {
      // For development/testing, return mock data
      if (process.env.NODE_ENV === 'development') {
        return this.getMockRecommendations(measurements);
      }
      
      // In production, call the actual API
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ measurements }),
      });
      
      if (!response.ok) {
        throw new Error(`AI recommendation failed with status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      // Fallback to mock data on error
      return this.getMockRecommendations(measurements);
    }
  }
  
  /**
   * Generate mock recommendation data for development/testing
   * @param {Object} measurements - Facial measurements
   * @returns {Object} Mock recommendation data
   */
  getMockRecommendations(measurements) {
    const { faceShape } = measurements;
    
    // Mock recommendations based on face shape
    const recommendations = {
      frameShapes: [],
      frameStyles: [],
      colors: [],
      confidence: 0.85,
    };
    
    // Recommend frame shapes based on face shape
    switch (faceShape) {
      case 'Round':
        recommendations.frameShapes = ['Rectangle', 'Square', 'Wayfarer'];
        recommendations.frameStyles = ['Bold', 'Angular', 'Geometric'];
        recommendations.colors = ['Black', 'Tortoise', 'Navy'];
        break;
      case 'Square':
        recommendations.frameShapes = ['Round', 'Oval', 'Aviator'];
        recommendations.frameStyles = ['Thin frame', 'Rimless', 'Semi-rimless'];
        recommendations.colors = ['Gold', 'Silver', 'Brown'];
        break;
      case 'Oval':
        recommendations.frameShapes = ['Rectangle', 'Square', 'Geometric'];
        recommendations.frameStyles = ['Bold', 'Classic', 'Modern'];
        recommendations.colors = ['Black', 'Tortoise', 'Burgundy'];
        break;
      case 'Heart':
        recommendations.frameShapes = ['Oval', 'Round', 'Butterfly'];
        recommendations.frameStyles = ['Light frame', 'Semi-rimless', 'Decorative'];
        recommendations.colors = ['Brown', 'Amber', 'Blue'];
        break;
      case 'Rectangle':
        recommendations.frameShapes = ['Round', 'Oval', 'Cat eye'];
        recommendations.frameStyles = ['Curved', 'Thin frame', 'Decorative'];
        recommendations.colors = ['Tortoise', 'Red', 'Purple'];
        break;
      case 'Diamond':
        recommendations.frameShapes = ['Cat eye', 'Oval', 'Rimless'];
        recommendations.frameStyles = ['Top-heavy', 'Decorative', 'Retro'];
        recommendations.colors = ['Clear', 'Pastel', 'Two-tone'];
        break;
      default:
        // Default recommendations
        recommendations.frameShapes = ['Rectangle', 'Round', 'Square'];
        recommendations.frameStyles = ['Classic', 'Modern', 'Minimalist'];
        recommendations.colors = ['Black', 'Brown', 'Blue'];
    }
    
    return recommendations;
  }
}

// Create and export a singleton instance
const aiService = new AIService();
export default aiService; 