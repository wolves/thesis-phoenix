/*
  Bootstraps the Thesis editor, skipping entirely if we're not in edit mode.
  This typically gets compiled into the host app's JS file.

  Any time you change this file, you'll need to re-import it into your
  test Phoenix app with `npm install` (you may need to
  `rm -rf ./node_modules/thesis` first).
*/
;(function () {
  var loadThesis = function (loadReact) {
    var script = document.createElement('script')
    script.src = '/thesis/thesis-editor.js?react=' + (loadReact)

    document.head.appendChild(script)
  }

  document.addEventListener('DOMContentLoaded', function (event) {
    if (document.querySelector('#thesis-editor-container')) {
      loadThesis(typeof window.React === 'undefined')
    }
  })
})()
