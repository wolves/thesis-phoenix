import MediumEditor from 'medium-editor'

class HtmlEditor {
  constructor (opts) {
    this.editor = null
    this.editors = document.querySelectorAll('.thesis-content-html')
    this.enabled = false

    this.onChange = opts.onChange

    this.changedHtmlEditor = this.changedHtmlEditor.bind(this)
  }

  enable () {
    if (this.enabled) return
    if (!this.editor && this.editors.length > 0) {
      this.editor = new MediumEditor(this.editors, this.mediumEditorOptions())
      this.editor.subscribe('editableInput', this.changedHtmlEditor)
    }
    this.enabled = true
  }

  disable () {
    if (!this.enabled) return
    if (this.editor) this.editor.destroy()
    this.editor = null
    this.enabled = false
  }

  content (ed) {
    return ed.innerHTML
  }

  changedHtmlEditor (event, editable) {
    editable.classList.add('modified')

    this.onChange()
  }

  mediumEditorOptions () {
    // https://github.com/yabwe/medium-editor#toolbar-options
    return {
      autoLink: true,
      toolbar: {
        buttons: [
          'bold', 'italic', 'underline', 'anchor',
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'quote',
          'orderedlist', 'unorderedlist',
          'removeFormat', 'justifyLeft', 'justifyCenter', 'justifyRight'
        ],
        static: true,
        align: 'center',
        sticky: true,
        updateOnEmptySelection: true
      },
      paste: {
        forcePlainText: false,
        cleanPastedHTML: true,
        cleanAttrs: ['class', 'style', 'dir'],
        cleanTags: ['meta', 'pre']
      }
    }
  }

}

export default HtmlEditor
