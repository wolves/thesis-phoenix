import React from 'react'
import ReactDOM from 'react-dom'
// import AddButton from './components/add_button'
// import DeleteButton from './components/delete_button'
import SettingsButton from './components/settings_button'
import CancelButton from './components/cancel_button'
import SaveButton from './components/save_button'
import EditButton from './components/edit_button'
import MediumEditor from 'medium-editor'
import Net from './utilities/net'

// https://github.com/yabwe/medium-editor#toolbar-options
const mediumEditorOptions = {
  autoLink: true,
  toolbar: {
    buttons: [
      'bold', 'italic', 'underline', 'anchor',
      'h1', 'h2', 'h3', 'quote',
      'orderedlist', 'unorderedlist',
      'removeFormat', 'justifyLeft', 'justifyCenter', 'justifyRight'
    ],
    static: true,
    align: 'center',
    sticky: true,
    updateOnEmptySelection: true
  }
}

class ThesisEditor extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      editing: false
    }
    this.editor = null

    // Rebind context
    this.cancelPressed = this.cancelPressed.bind(this)
    this.savePressed = this.savePressed.bind(this)
    this.editPressed = this.editPressed.bind(this)
  }

  editPressed () {
    let body = document.querySelector('body')

    if (this.state.editing) {
      if (body.classList.contains('thesis-page-modified')) {
        this.cancelPressed()
      } else {
        body.classList.remove('thesis-page-modified')
        this.setState({editing: false})
      }
    } else {
      this.setState({editing: true})
    }
  }

  savePressed () {
    let body = document.querySelector('body')

    const page = {slug: window.location.pathname}
    const contents = this.contentEditorContents()
    this.postToServer(page, contents)
    this.setState({editing: false})
    body.classList.remove('thesis-page-modified')
  }

  cancelPressed () {
    if (window.confirm('Discard changes and reload the page?')) {
      this.setState({editing: false})
      window.location.reload()
    }
  }

  postToServer (page, contents) {
    Net.put('/thesis/update', {page, contents}).then((resp) => {
      console.log('SUCCESS')
      console.log(resp)
    }).catch((err) => {
      console.log('ERROR')
      console.log(err)
    })
  }

  textContentEditors () {
    return document.querySelectorAll('.thesis-content-text')
  }

  htmlContentEditors () {
    return document.querySelectorAll('.thesis-content-html')
  }

  allContentEditors () {
    return document.querySelectorAll('.thesis-content')
  }

  trackContentChanges () {
    let body = document.querySelector('body')
    const textEditors = this.textContentEditors()

    // html editor
    this.editor.subscribe('editableInput', function (event, editable) {
      body.classList.add('thesis-page-modified')
      editable.classList.add('modified')
    })

    // TODO: image editor

    // text editor
    for (let i = 0; i < textEditors.length; i++) {
      textEditors[i].addEventListener('input', function (e) {
        e.target.classList.add('modified')
        body.classList.add('thesis-page-modified')
      }, false)
    }
  }

  trackEditableAreaState () {
    const t = this
    const editors = this.allContentEditors()

    let listener = function (e) {
      t.manageInEditModeClass(e)
    }

    for (let i = 0; i < this.allContentEditors().length; i++) {
      editors[i].classList.remove('in-edit-mode')
      editors[i].classList.remove('modified')
      editors[i].addEventListener('click', listener, false)
    }
  }

  manageInEditModeClass (e) {
    let contentEls = this.allContentEditors()
    let contentEl = null
    let el = e.target

    if (el.classList.contains('thesis-content')) {
      contentEl = el
    } else {
      do {
        if (el.classList.contains('thesis-content')) {
          contentEl = el
          break
        }
      } while (el = el.parentNode)
    }

    this.removeInEditModeClass(contentEls)
    this.addInEditModeClass(contentEl)
  }

  addInEditModeClass (el) {
    el.classList.add('in-edit-mode')
  }

  removeInEditModeClass (els = this.allContentEditors()) {
    for (let i = 0; i < els.length; i++) {
      els[i].classList.remove('in-edit-mode')
    }
  }

  addContentEditors () {
    if (!this.editor) {
      this.editor = new MediumEditor(this.htmlContentEditors(), mediumEditorOptions)
    } else {
      this.editor.setup() // Rebuild it
    }
    this.toggleTextEditors(true)
    this.trackEditableAreaState()
    this.trackContentChanges()
  }

  removeContentEditors () {
    if (!this.editor) { return null }

    this.editor.destroy()
    this.toggleTextEditors(false)
  }

  toggleTextEditors (editable) {
    const textEditors = this.textContentEditors()
    for (let i = 0; i < textEditors.length; i++) {
      textEditors[i].contentEditable = editable
    }
  }

  contentEditorContents () {
    let contents = []

    const editors = this.allContentEditors()
    for (let i = 0; i < editors.length; i++) {
      const ed = editors[i]
      const id = ed.getAttribute('data-thesis-content-id')
      const t = ed.getAttribute('data-thesis-content-type')
      const content = ed.innerHTML
      contents.push({name: id, content_type: t, content: content})
    }

    return contents
  }

  renderEditorClass () {
    return this.state.editing ? 'active' : ''
  }

  renderEditButtonText () {
    return this.state.editing ? 'Editing Page' : 'Edit Page'
  }

  componentDidUpdate () {
    let el = document.querySelector('body')
    let t = this
    if (this.state.editing) {
      el.classList.add('thesis-editing')
      this.addContentEditors()
      el.insertAdjacentHTML('beforeend', '<div id="thesis-fader"></div>')
      let fader = document.querySelector('#thesis-fader')
      fader.addEventListener('click', function () {t.removeInEditModeClass()}, false)
    } else {
      el.classList.remove('thesis-editing')
      this.removeContentEditors()
      let fader = document.querySelector('#thesis-fader')
      fader.remove()
    }
  }

  render () {
    // <AddButton />
    // <DeleteButton />
    return (
    <div id='thesis-editor' className={this.renderEditorClass()}>
      <SettingsButton />
      <CancelButton onPress={this.cancelPressed} />
      <SaveButton onPress={this.savePressed} />
      <EditButton onPress={this.editPressed} text={this.renderEditButtonText()} />
    </div>
    )
  }
}

ReactDOM.render(<ThesisEditor />, document.querySelector('#thesis-editor-container'))
