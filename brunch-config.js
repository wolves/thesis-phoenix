exports.config = {
  sourceMaps: false,
  production: true,
  npm: {
    enabled: true
  },

  files: {
    javascripts: {
      joinTo: 'thesis-editor.js'
    }
  },

  // Phoenix paths configuration
  paths: {
    // Which directories to watch
    watched: ['web/static'],

    // Where to compile files to
    public: 'priv/static'
  },

  modules: {
    autoRequire: {
      'thesis-editor.js': ['web/static/thesis-editor']
    }
  },

  // Configure your plugins
  plugins: {
    babel: {
      // Do not use ES6 compiler in vendor code
      ignore: [/^(web\/static\/vendor)/],
      presets: ['es2015', 'react']
    }
  }
}
