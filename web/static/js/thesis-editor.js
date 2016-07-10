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
import Net from './utilities/net'

// Content types
import HtmlEditor from './content_types/html'
import RawHtmlEditor from './content_types/raw_html'
import RawHtmlTray from './components/raw_html_tray'

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
    this.htmlEditor = new HtmlEditor(this)
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
    // this.changedHtmlEditor = this.changedHtmlEditor.bind(this)
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
    this.setState({trayOpen: false, trayData: null})
  }

  settingsTraySubmitted (page) {
    document.title = page.title

    const desc = this.descriptionMetaTag()
    if (desc) { desc.content = page.description }

    this.setState({trayOpen: false, pageModified: true})
  }

  imageTraySubmitted (data) {
    const editor = document.querySelector(`[data-thesis-content-id="${data.contentId}"`)
    editor.classList.add('modified')

    const meta = JSON.stringify({alt: data.alt})
    editor.setAttribute('data-thesis-content-meta', meta)

    const type = editor.getAttribute('data-thesis-content-type')
    if (type === 'image') {
      const img = editor.querySelector('img')
      img.src = data.url
      img.alt = data.alt
    } else if (type === 'background_image') {
      editor.style.backgroundImage = `url("${data.url}")`
    }

    this.setState({trayOpen: false, pageModified: true, trayData: null})
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
    if (this.state.trayOpen && this.state.trayType !== 'page-settings') {
      this.setState({trayType: 'page-settings'})
    } else {
      this.setState({trayOpen: !this.state.trayOpen, trayType: 'page-settings'})
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

  imageContentEditors () {
    return document.querySelectorAll('.thesis-content-image, .thesis-content-background_image')
  }

  allContentEditors () {
    return document.querySelectorAll('.thesis-content')
  }

  subscribeToContentChanges () {
    // text editor
    const textEditors = this.textContentEditors()
    for (let i = 0; i < textEditors.length; i++) {
      textEditors[i].addEventListener('input', this.changedTextEditor, false)
      textEditors[i].addEventListener('keydown', this.changedTextEditor, false)
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
      textEditors[i].removeEventListener('keydown', this.changedTextEditor, false)
    }

    // image editor
    const imageEditors = this.imageContentEditors()
    for (let i = 0; i < imageEditors.length; i++) {
      imageEditors[i].removeEventListener('click', this.clickedImageEditor, false)
    }
  }

  changedTextEditor (e) {
    e.currentTarget.classList.add('modified')
    this.setState({pageModified: true})
    if (e.keyCode === 13) e.preventDefault()
  }

  clickedImageEditor (e) {
    const id = e.currentTarget.getAttribute('data-thesis-content-id')
    const type = e.currentTarget.getAttribute('data-thesis-content-type')
    const meta = JSON.parse(e.currentTarget.getAttribute('data-thesis-content-meta'))
    let url = ''

    if (type === 'image') {
      url = e.currentTarget.querySelector('img').getAttribute('src')
    } else if (type === 'background_image') {
      url = this.getUrlFromStyle(e.currentTarget.style.backgroundImage)
    }

    this.setState({
      pageModified: true,
      trayOpen: true,
      trayType: 'image-upload',
      trayData: { contentId: id, url: url, alt: meta.alt }
    })
  }

  addContentEditors () {
    this.htmlEditor.enable()
    this.rawHtmlEditor.enable()

    this.toggleTextEditors(true)
    this.subscribeToContentChanges()
  }

  removeContentEditors () {
    this.toggleTextEditors(false)
    this.unsubscribeFromContentChanges()
    this.htmlEditor.disable()
    this.rawHtmlEditor.disable()
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
      const meta = ed.getAttribute('data-thesis-content-meta')

      const content = this.getContent(t, ed)
      const glob = ed.getAttribute('data-thesis-content-global')
      contents.push({name: id, content_type: t, content: content, meta: meta, global: glob})
    }

    return contents
  }

  getUrlFromStyle (style) {
    return style.replace('url("', '').replace('")', '')
  }

  getContent (t, ed) {
    if (t === 'image') {
      return ed.querySelector('img').getAttribute('src')
    } else if (t === 'background_image') {
      return this.getUrlFromStyle(ed.style.backgroundImage)
    } else {
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
