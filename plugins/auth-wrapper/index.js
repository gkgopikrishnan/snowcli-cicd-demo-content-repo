module.exports = function authWrapperPlugin(context, options) {
    return {
      name: 'auth-wrapper-plugin',
      configureWebpack() {
        return {
          resolve: {
            fallback: {
              assert: false,
              util: false,
            },
          },
        };
      },
      async contentLoaded() {
        // noop - optional: later can build SSR logic
      },
    };
  };
  