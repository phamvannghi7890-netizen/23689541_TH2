/**
 * @format
 */

import 'react-native-gesture-handler';

// Polyfill globalThis.expo for Expo Modules in React Native CLI when native JSI is absent
if (!globalThis.expo) {
  class SimpleEventEmitter {
    constructor() {
      this.listeners = new Map();
    }
    addListener(event, listener) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, new Set());
      }
      this.listeners.get(event).add(listener);
      return {
        remove: () => this.removeListener(event, listener),
      };
    }
    removeListener(event, listener) {
      const set = this.listeners.get(event);
      if (set) set.delete(listener);
    }
    emit(event, ...args) {
      const set = this.listeners.get(event);
      if (set) set.forEach((fn) => fn(...args));
    }
  }

  const mockModuleProxy = new Proxy({}, {
    get: (_target, prop) => {
      if (prop === 'addListener' || prop === 'removeListeners') {
        return () => {};
      }
      if (prop === 'name') return 'MockExpoModule';
      return async () => ({
        granted: true,
        status: 'granted',
        canAskAgain: true,
        coords: {
          latitude: 10.8275,
          longitude: 106.6912,
          altitude: 10,
          accuracy: 5,
          altitudeAccuracy: 5,
          heading: 0,
          speed: 0,
        },
        timestamp: Date.now(),
      });
    },
  });

  const modulesProxy = new Proxy({}, {
    get: (_target, _prop) => mockModuleProxy,
  });

  globalThis.expo = {
    EventEmitter: SimpleEventEmitter,
    modules: modulesProxy,
    requireNativeModule: (_name) => mockModuleProxy,
    requireOptionalNativeModule: (_name) => mockModuleProxy,
  };
}

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
