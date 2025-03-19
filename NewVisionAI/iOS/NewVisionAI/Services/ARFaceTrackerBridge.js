import { NativeEventEmitter, NativeModules } from 'react-native';

const { ARFaceTracker } = NativeModules;
const ARFaceTrackerEmitter = new NativeEventEmitter(ARFaceTracker);

class ARFaceTrackerBridge {
  static startTracking() {
    return ARFaceTracker.startTracking();
  }

  static stopTracking() {
    return ARFaceTracker.stopTracking();
  }

  static addFaceUpdateListener(callback) {
    return ARFaceTrackerEmitter.addListener('arFrameUpdate', callback);
  }

  static addErrorListener(callback) {
    return ARFaceTrackerEmitter.addListener('arError', callback);
  }

  static getEmitter() {
    return ARFaceTrackerEmitter;
  }
}

export default ARFaceTrackerBridge; 