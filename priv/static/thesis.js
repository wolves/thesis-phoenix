// Any time you change this file, you'll need to re-import it into your
// test Phoenix app with `npm install` (you may need to rm the node_modules
// folder first).
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
