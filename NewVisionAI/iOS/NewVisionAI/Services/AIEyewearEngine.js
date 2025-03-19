/**
 * AIEyewearEngine
 * 
 * This module processes face tracking data from ARKit to generate eyewear recommendations
 * based on facial measurements, dynamics, and other factors.
 */

// Sample eyewear database (in production, this would come from an API or backend)
const EYEWEAR_DATABASE = [
  { 
    id: 'qp-001', 
    name: 'Quantum Pulse', 
    styles: ['modern', 'tech', 'angular'],
    faceShapeAffinity: { oval: 0.9, round: 0.7, square: 0.8, heart: 0.6, diamond: 0.7 },
    idealPdRange: [58, 70],
    idealFaceWidth: [135, 150],
  },
  { 
    id: 'eo-002', 
    name: 'Ethereal Orbit', 
    styles: ['round', 'vintage', 'artistic'],
    faceShapeAffinity: { oval: 0.8, round: 0.9, square: 0.5, heart: 0.8, diamond: 0.7 },
    idealPdRange: [60, 68],
    idealFaceWidth: [130, 145],
  },
  { 
    id: 'vr-003', 
    name: 'Void Runner', 
    styles: ['sporty', 'sleek', 'durable'],
    faceShapeAffinity: { oval: 0.7, round: 0.6, square: 0.9, heart: 0.5, diamond: 0.6 },
    idealPdRange: [62, 72],
    idealFaceWidth: [138, 155],
  },
  { 
    id: 'cr-004', 
    name: 'Cosmic Ray', 
    styles: ['bold', 'geometric', 'futuristic'],
    faceShapeAffinity: { oval: 0.7, round: 0.5, square: 0.7, heart: 0.8, diamond: 0.9 },
    idealPdRange: [59, 69],
    idealFaceWidth: [132, 148],
  },
  { 
    id: 'ns-005', 
    name: 'Nebula Shift', 
    styles: ['oversized', 'gradient', 'statement'],
    faceShapeAffinity: { oval: 0.8, round: 0.7, square: 0.6, heart: 0.9, diamond: 0.6 },
    idealPdRange: [61, 71],
    idealFaceWidth: [136, 152],
  },
];

class AIEyewearEngine {
  /**
   * Process face tracking data and generate recommendations
   * @param {Object} faceData - Data from ARKit face tracking 
   * @returns {Object} - Processed data with recommendations
   */
  static processData(faceData) {
    if (!faceData) return null;
    
    // Extract relevant data
    const { measurements, dynamics, faceShape } = faceData;
    
    // Generate visual aura based on dynamics and expressions
    const visualAura = this.calculateVisualAura(dynamics);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(
      measurements, 
      dynamics, 
      faceShape
    );
    
    // Return the processed data
    return {
      measurements,
      dynamics,
      faceShape,
      visualAura,
      recommendations
    };
  }
  
  /**
   * Calculate visual aura based on facial dynamics
   * @param {Object} dynamics - Facial dynamics data
   * @returns {Array} - RGB values representing visual aura
   */
  static calculateVisualAura(dynamics) {
    if (!dynamics) return [0.5, 0.5, 0.5];
    
    // This is a simplified algorithm - in production this would be more sophisticated
    const { blinkRate, smileIntensity, headTilt, movementEnergy } = dynamics;
    
    // Calculate RGB values based on facial dynamics
    const r = 0.3 + (smileIntensity * 0.5);  // Smile increases red
    const g = 0.3 + (movementEnergy * 0.5);  // Movement increases green
    const b = 0.3 + (Math.abs(headTilt) / 30 * 0.5);  // Head tilt increases blue
    
    return [r, g, b];
  }
  
  /**
   * Generate eyewear recommendations based on face data
   * @param {Object} measurements - Facial measurements
   * @param {Object} dynamics - Facial dynamics
   * @param {Object} faceShape - Face shape confidence values
   * @returns {Array} - Array of recommendations with resonance scores
   */
  static generateRecommendations(measurements, dynamics, faceShape) {
    if (!measurements || !faceShape) {
      return EYEWEAR_DATABASE.slice(0, 3).map(frame => ({
        name: frame.name,
        resonance: 0.7 + (Math.random() * 0.2)  // Fallback random resonance
      }));
    }
    
    // Calculate resonance scores for each frame in the database
    const scoredFrames = EYEWEAR_DATABASE.map(frame => {
      let score = 0;
      
      // Score based on face shape compatibility
      let shapeScore = 0;
      let totalShapeWeight = 0;
      Object.entries(faceShape).forEach(([shape, confidence]) => {
        const affinity = frame.faceShapeAffinity[shape] || 0.5;
        shapeScore += affinity * confidence;
        totalShapeWeight += confidence;
      });
      shapeScore = totalShapeWeight > 0 ? shapeScore / totalShapeWeight : 0.5;
      
      // Score based on measurements
      let measurementScore = 0;
      
      // PD compatibility
      if (measurements.pd >= frame.idealPdRange[0] && measurements.pd <= frame.idealPdRange[1]) {
        measurementScore += 0.2;
      }
      
      // Face width compatibility
      if (measurements.faceWidth >= frame.idealFaceWidth[0] && measurements.faceWidth <= frame.idealFaceWidth[1]) {
        measurementScore += 0.2;
      }
      
      // Personality factor based on dynamics
      let personalityScore = 0;
      if (dynamics) {
        // Smile intensity suggests preference for more stylish frames
        if (dynamics.smileIntensity > 0.6 && frame.styles.includes('artistic')) {
          personalityScore += 0.1;
        }
        
        // High movement energy might suggest active lifestyle
        if (dynamics.movementEnergy > 0.7 && frame.styles.includes('sporty')) {
          personalityScore += 0.1;
        }
      }
      
      // Calculate final score (weighted combination)
      score = (shapeScore * 0.5) + (measurementScore * 0.3) + (personalityScore * 0.2);
      
      // Add slight randomization to avoid identical scores
      score = Math.min(0.99, Math.max(0.1, score + (Math.random() * 0.1 - 0.05)));
      
      return {
        name: frame.name,
        resonance: score
      };
    });
    
    // Sort by resonance score and return top recommendations
    return scoredFrames.sort((a, b) => b.resonance - a.resonance).slice(0, 3);
  }
}

export default AIEyewearEngine; 