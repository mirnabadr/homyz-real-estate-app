const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Fix InternalBytecode.js Metro symbolication errors
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Enhanced error handling for symbolication
config.server = config.server || {};
const originalEnhance = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (middleware) => {
  const base = originalEnhance ? originalEnhance(middleware) : middleware;
  return (req, res, next) => {
    try {
      if (req.url && (req.url.includes('InternalBytecode.js') || req.url.includes('symbolicate'))) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
        return;
      }
    } catch (_) {
      // no-op
    }
    return base(req, res, next);
  };
};

// Disable symbolication for better performance and to avoid InternalBytecode errors
config.symbolicator = {
  customizeFrame: () => null,
};

// Improve resolver configuration
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
config.resolver.sourceExts = Array.from(new Set([...(config.resolver.sourceExts || []), 'mjs']));

// Enhanced transformer options
config.transformer = config.transformer || {};
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

// Better caching for Metro
config.resetCache = true;

module.exports = withNativeWind(config, { input: './app/globals.css' });