#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ARFaceTracker, RCTEventEmitter)

RCT_EXTERN_METHOD(startTracking)
RCT_EXTERN_METHOD(stopTracking)

- (NSArray<NSString *> *)supportedEvents {
  return @[@"arFrameUpdate", @"arError"];
}

@end 