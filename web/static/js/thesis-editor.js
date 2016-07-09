import React from 'react'
import ReactDOM from 'react-dom'
import AddButton from './components/add_button'
import DeleteButton from './components/delete_button'
import SettingsButton from './components/settings_button'
import CancelButton from './components/cancel_button'
import SaveButton from './components/save_button'
import EditButton from './components/edit_button'
import SettingsTray from './components/settings_tray'
import ImageTray from './components/image_tray'
import AttributionText from './components/attribution_text'
import MediumEditor from 'medium-editor'
import Net from './utilities/net'

// Content types
import RawHtmlEditor from './content_types/raw_html'
import RawHtmlTray from './components/raw_html_tray'

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
  },
  paste: {
    forcePlainText: false,
    cleanPastedHTML: true,
    cleanAttrs: ['class', 'style', 'dir'],
    cleanTags: ['meta', 'pre']
  }
}

class ThesisEditor extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      editing: false,
      pageModified: false,
      pageToolsHidden: true,
      trayOpen: false,
      trayType: null
    }
    this.editor = null
    this.rawHtmlEditor = new RawHtmlEditor(this)

    // Rebind context
    this.trayCanceled = this.trayCanceled.bind(this)
    this.settingsTraySubmitted = this.settingsTraySubmitted.bind(this)
    this.imageTraySubmitted = this.imageTraySubmitted.bind(this)
    this.cancelPressed = this.cancelPressed.bind(this)
    this.savePressed = this.savePressed.bind(this)
    this.editPressed = this.editPressed.bind(this)
    this.addPagePressed = this.addPagePressed.bind(this)
    this.pageSettingsPressed = this.pageSettingsPressed.bind(this)
    this.changedHtmlEditor = this.changedHtmlEditor.bind(this)
    this.changedTextEditor = this.changedTextEditor.bind(this)
    this.clickedImageEditor = this.clickedImageEditor.bind(this)
  }

  pathname () {
    return window.location.pathname
  }

  pageTitle () {
    return document.title
  }

  pageDescription () {
    const desc = this.descriptionMetaTag()
    return desc ? desc.content : null
  }

  descriptionMetaTag () {
    return document.querySelectorAll('meta[name=description]')[0]
  }

  trayCanceled () {
    this.setState({trayOpen: false})
  }

  settingsTraySubmitted (page) {
    document.title = page.title

    const desc = this.descriptionMetaTag()
    if (desc) { desc.content = page.description }

    this.setState({trayOpen: false, pageModified: true})
  }

  imageTraySubmitted (data) {
    const editor = document.querySelector(`[data-thesis-content-id="${data.contentId}"`)
    const img = editor.querySelector('img')

    editor.classList.add('modified')

    const meta = JSON.stringify({alt: data.alt})
    editor.setAttribute('data-thesis-content-meta', meta)

    img.src = data.url
    img.alt = data.alt

    this.setState({trayOpen: false, pageModified: true})
  }

  editPressed () {
    if (this.state.editing) {
      if (this.state.pageModified) {
        this.cancelPressed()
      } else {
        this.setState({editing: false, pageModified: false, trayOpen: false})
        setTimeout(() => this.setState({pageToolsHidden: true}), 800)
      }
    } else {
      this.setState({editing: true, pageToolsHidden: false, trayOpen: false})
    }
  }

  savePressed () {
    const page = {slug: this.pathname(), title: this.pageTitle(), description: this.pageDescription()}
    const contents = this.contentEditorContents()
    this.postToServer(page, contents)
    this.setState({editing: false, pageModified: false, trayOpen: false})
    setTimeout(() => this.setState({pageToolsHidden: true}), 800)
  }

  cancelPressed () {
    if (window.confirm('Discard changes and reload the page?')) {
      this.setState({editing: false})
      window.location.reload()
    }
  }

  addPagePressed () {
    this.setState({trayOpen: !this.state.trayOpen, trayType: 'add-page'})
  }

  pageSettingsPressed () {
    this.setState({trayOpen: !this.state.trayOpen, trayType: 'page-settings'})
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

  imageContentEditors () {
    return document.querySelectorAll('.thesis-content-image, .thesis-content-background_image')
  }

  allContentEditors () {
    return document.querySelectorAll('.thesis-content')
  }

  subscribeToContentChanges () {
    // html editor
    if (this.htmlContentEditors().length > 0) {
      this.editor.subscribe('editableInput', this.changedHtmlEditor)
    }

    // text editor
    const textEditors = this.textContentEditors()
    for (let i = 0; i < textEditors.length; i++) {
      textEditors[i].addEventListener('input', this.changedTextEditor, false)
    }

    // image editor
    const imageEditors = this.imageContentEditors()
    for (let i = 0; i < imageEditors.length; i++) {
      imageEditors[i].addEventListener('click', this.clickedImageEditor, false)
    }
  }

  unsubscribeFromContentChanges () {
    // text editor
    const textEditors = this.textContentEditors()
    for (let i = 0; i < textEditors.length; i++) {
      textEditors[i].removeEventListener('input', this.changedTextEditor, false)
    }

    // image editor
    const imageEditors = this.imageContentEditors()
    for (let i = 0; i < imageEditors.length; i++) {
      imageEditors[i].removeEventListener('click', this.clickedImageEditor, false)
    }
  }

  changedHtmlEditor (event, editable) {
    editable.classList.add('modified')
    this.setState({pageModified: true})
  }

  changedTextEditor (e) {
    e.currentTarget.classList.add('modified')
    this.setState({pageModified: true})
  }

  clickedImageEditor (e) {
    e.currentTarget.classList.add('modified')
    const id = e.currentTarget.getAttribute('data-thesis-content-id')
    const meta = JSON.parse(e.currentTarget.getAttribute('data-thesis-content-meta'))
    const url = e.currentTarget.querySelector('img').getAttribute('src')

    this.setState({
      pageModified: true,
      trayOpen: true,
      trayType: 'image-upload',
      trayData: { contentId: id, url: url, alt: meta.alt }
    })
  }

  addContentEditors () {
    if (!this.editor) {
      this.editor = new MediumEditor(this.htmlContentEditors(), mediumEditorOptions)
    } else {
      this.editor.setup() // Rebuild it
    }
    this.rawHtmlEditor.enable()

    this.toggleTextEditors(true)
    this.subscribeToContentChanges()
  }

  removeContentEditors () {
    if (!this.editor) { return null }
    this.editor.destroy()
    this.editor = null
    this.toggleTextEditors(false)
    this.toggleImageEditors(false)
    this.unsubscribeFromContentChanges()
    this.rawHtmlEditor.disable()
  }

  toggleTextEditors (editable) {
    const textEditors = this.textContentEditors()
    for (let i = 0; i < textEditors.length; i++) {
      textEditors[i].contentEditable = editable
    }
  }

  toggleImageEditors (editable) {
    // const imageEditors = this.imageContentEditors()
    // for (let i = 0; i < textEditors.length; i++) {
    //   textEditors[i].contentEditable = editable
    // }
  }

  contentEditorContents () {
    let contents = []

    const editors = this.allContentEditors()
    for (let i = 0; i < editors.length; i++) {
      const ed = editors[i]
      const id = ed.getAttribute('data-thesis-content-id')
      const t = ed.getAttribute('data-thesis-content-type')
      const meta = ed.getAttribute('data-thesis-content-meta')

      const content = this.getContent(t, ed)
      const glob = ed.getAttribute('data-thesis-content-global')
      contents.push({name: id, content_type: t, content: content, meta: meta, global: glob})
    }

    return contents
  }

  getContent (t, ed) {
    if (t == 'image') {
      console.log('281')
      return ed.querySelector('img').getAttribute('src')
    } else {
      console.log('284')
      return ed.innerHTML
    }
  }

  componentDidUpdate () {
    const el = document.querySelector('body')
    const editors = this.allContentEditors()

    if (this.state.editing) {
      el.classList.add('thesis-editing')
      if (!this.editor) this.addContentEditors()
    } else {
      el.classList.remove('thesis-editing')
      this.removeContentEditors()
    }

    if (this.state.pageModified) {
      el.classList.add('thesis-page-modified')
    } else {
      el.classList.remove('thesis-page-modified')
      for (let i = 0; i < editors.length; i++) {
        editors[i].classList.remove('modified')
      }
    }

    if (this.state.trayOpen) {
      el.classList.add('thesis-tray-open')
    } else {
      el.classList.remove('thesis-tray-open')
    }
  }

  renderEditorClass () {
    let classes = ''
    classes += (this.state.editing) ? ' active ' : ''
    classes += (this.state.pageToolsHidden) ? ' thesis-page-tools-hidden ' : ''
    return classes
  }

  renderEditButtonText () {
    return this.state.editing ? 'Editing Page' : 'Edit Page'
  }

  renderFaderClass () {
    return this.renderEditorClass()
  }

  renderTrayClass () {
    return this.state.trayType
  }

  renderTray () {
    if (this.state.trayType == 'page-settings') {
      return <SettingsTray
        path={this.pathname()}
        hasErrors={false}
        pageTitle={this.pageTitle()}
        pageDescription={this.pageDescription()}
        onCancel={this.trayCanceled}
        onSubmit={this.settingsTraySubmitted} />
    } else if (this.state.trayType == "image-upload") {
      return <ImageTray
        data={this.state.trayData}
        onCancel={this.trayCanceled}
        onSubmit={this.imageTraySubmitted} />
    } else if (this.state.trayType == "raw-html") {
      return <RawHtmlTray
        data={this.state.trayData}
        onCancel={this.trayCanceled}
        onSubmit={this.rawHtmlEditor.onSubmit} />
    }
  }

  render () {
    return (
    <div id="thesis">
      <div id='thesis-editor' className={this.renderEditorClass()}>
        <SaveButton onPress={this.savePressed} />
        <SettingsButton onPress={this.pageSettingsPressed} />
        <CancelButton onPress={this.cancelPressed} />
        {/*this.state.pageToolsHidden ? <AddButton onPress={this.addPagePressed} /> : null*/}
        {/*this.state.pageToolsHidden ? <DeleteButton /> : null*/}
        <EditButton onPress={this.editPressed} text={this.renderEditButtonText()} />
      </div>
      <div id='thesis-fader' className={this.renderFaderClass()}></div>
      <div id='thesis-tray' className={this.renderTrayClass()}>
        {this.renderTray()}
        <AttributionText />
      </div>
    </div>
    )
  }
}

ReactDOM.render(<ThesisEditor />, document.querySelector('#thesis-container'))
