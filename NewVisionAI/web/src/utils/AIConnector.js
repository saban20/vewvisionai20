import AIEyewearEngine from './AIEyewearEngine';

/**
 * AIConnector - A singleton interface for connecting the AI eyewear engine 
 * with both frontend components and backend services.
 */
class AIConnector {
  constructor() {
    this.engine = null;
    this.initialized = false;
    this.listeners = {
      measurements: [],
      faceShape: [],
      styleRecommendations: []
    };
    this.currentMeasurements = null;
    this.currentFaceShape = null;
    this.currentRecommendations = null;
  }

  /**
   * Initialize the AI engine with video and canvas elements
   */
  async initialize(videoElement, canvasElement) {
    if (this.initialized) {
      console.warn('AI Engine already initialized');
      return this;
    }

    try {
      this.engine = new AIEyewearEngine(videoElement, canvasElement);
      await this.engine.initialize();
      
      // Set up listeners
      this.engine.onMeasurementsUpdated = (measurements) => {
        this.currentMeasurements = measurements;
        this._notifyListeners('measurements', measurements);
      };
      
      this.engine.onFaceShapeDetected = (faceShape) => {
        this.currentFaceShape = faceShape;
        this._notifyListeners('faceShape', faceShape);
      };
      
      this.engine.onStyleRecommended = (style) => {
        this.currentRecommendations = style;
        this._notifyListeners('styleRecommendations', style);
      };
      
      this.initialized = true;
      console.log('AI Connector initialized successfully');
      return this;
    } catch (error) {
      console.error('Failed to initialize AI Connector:', error);
      throw error;
    }
  }

  /**
   * Subscribe to measurement updates
   */
  onMeasurementsUpdated(callback) {
    this.listeners.measurements.push(callback);
    // Immediately call with current data if available
    if (this.currentMeasurements) {
      callback(this.currentMeasurements);
    }
    return this;
  }

  /**
   * Subscribe to face shape detection updates
   */
  onFaceShapeDetected(callback) {
    this.listeners.faceShape.push(callback);
    // Immediately call with current data if available
    if (this.currentFaceShape) {
      callback(this.currentFaceShape);
    }
    return this;
  }

  /**
   * Subscribe to style recommendation updates
   */
  onStyleRecommendationUpdated(callback) {
    this.listeners.styleRecommendations.push(callback);
    // Immediately call with current data if available
    if (this.currentRecommendations) {
      callback(this.currentRecommendations);
    }
    return this;
  }

  /**
   * Unsubscribe from all events
   */
  unsubscribe(callback) {
    for (const eventType in this.listeners) {
      this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== callback);
    }
    return this;
  }

  /**
   * Get current measurements
   */
  getMeasurements() {
    return this.currentMeasurements || {};
  }

  /**
   * Get current face shape analysis
   */
  getFaceShape() {
    return this.currentFaceShape || { shape: 'unknown', confidence: 0 };
  }

  /**
   * Get current style recommendations
   */
  getRecommendations() {
    return this.currentRecommendations || { style: null, frameRecommendations: [] };
  }

  /**
   * Sync all data with backend
   */
  async syncWithBackend() {
    if (!this.initialized || !this.engine) {
      throw new Error('AI Engine not initialized');
    }
    
    return await this.engine.syncWithBackend();
  }

  /**
   * Stop the AI engine
   */
  stop() {
    if (this.initialized && this.engine) {
      this.engine.stop();
      this.initialized = false;
    }
  }

  /**
   * Notify all listeners for a particular event type
   */
  _notifyListeners(eventType, data) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${eventType} listener:`, error);
        }
      });
    }
  }
}

// Export a singleton instance
const aiConnector = new AIConnector();
export default aiConnector; 