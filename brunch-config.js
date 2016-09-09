exports.config = {
  sourceMaps: false,
  production: true,
  npm: {
    enabled: true
  },

  files: {
    stylesheets: {
      joinTo: 'thesis.css'
    }
  },

  // Phoenix paths configuration
  paths: {
    // Which directories to watch
    watched: ['web/elm'],
  },

  modules: {
    autoRequire: {
      'thesis-editor.js': ['web/static/js/thesis-editor']
    }
  },

  // Configure your plugins
  plugins: {
    elmBrunch: {
      mainModules: ['web/elm/Main.elm'],
      outputFolder: 'priv/js/',
      outputFile: 'thesis-editor.js'
    }
  }
}
