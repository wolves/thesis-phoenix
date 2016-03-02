;(function () {
  var loadThesis = function (loadReact) {
    var script = document.createElement('script')
    script.src = '/thesis/thesis-editor.js?react=' + (loadReact)
    document.head.appendChild(script)
  }

  document.addEventListener('DOMContentLoaded', function (event) {
    if (document.querySelector('#thesis-editor')) {
      loadThesis(typeof window.React === 'undefined')
    }
  })
})()
