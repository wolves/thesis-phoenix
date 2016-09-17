import React from 'react'
import ReactDOM from 'react-dom'
import AddButton from './add_button'
import DeleteButton from './delete_button'
import SettingsButton from './settings_button'
import CancelButton from './cancel_button'
import SaveButton from './save_button'
import EditButton from './edit_button'
import SettingsTray from './settings_tray'
import AttributionText from './attribution_text'

// Content types
import HtmlEditor from '../content_types/html_editor'
import RawHtmlEditor from '../content_types/raw_html_editor'
import ImageEditor from '../content_types/image_editor'
import TextEditor from '../content_types/text_editor'

class ThesisEditor extends React.Component {

  constructor (props) {
    super(props)
    this.external = props.external

    this.state = {
      editing: false,
      path: this.external.path,
      title: this.external.getTitle(),
      description: this.external.getDescription(),
      template: this.external.template,
      templates: this.external.templates,
      isDynamicPage: this.external.isDynamicPage,
      redirectURL: this.external.pageRedirectURL,
      pageModified: false,
      pageToolsHidden: true,
      trayOpen: false,
      trayType: null,
      deleted: false
    }

    // TODO: Refactor these -- it's a false extraction
    this.htmlEditor = new HtmlEditor(this)
    this.rawHtmlEditor = new RawHtmlEditor(this)
    this.imageEditor = new ImageEditor(this, {ospryPublicKey: this.external.ospryPublicKey})
    this.textEditor = new TextEditor(this)

    // this.warnURLRedirect(this.state.redirectURL)

    // Rebind context
    this.trayCanceled = this.trayCanceled.bind(this)
    this.settingsTraySubmitted = this.settingsTraySubmitted.bind(this)
    this.cancelPressed = this.cancelPressed.bind(this)
    this.savePressed = this.savePressed.bind(this)
    this.editPressed = this.editPressed.bind(this)
    this.addPagePressed = this.addPagePressed.bind(this)
    this.deletePagePressed = this.deletePagePressed.bind(this)
    this.pageSettingsPressed = this.pageSettingsPressed.bind(this)
  }

  trayCanceled () {
    this.setState({trayOpen: false, trayData: null})
  }

  settingsTraySubmitted (data) {
    if (data.new) {
      const page = {
        slug: data.path,
        title: data.title,
        description: data.description,
        redirect_url: data.redirectURL,
        template: data.template
      }
      this.save(page, [])
    } else {
      this.setState({
        trayOpen: false,
        pageModified: true,
        path: data.path,
        title: data.title,
        description: data.description,
        template: data.template,
        redirectURL: data.redirectURL
      })
    }
  }

  addPagePressed () {
    this.setState({trayOpen: true, trayType: 'add-page'})
  }

  deletePagePressed () {
    if (window.confirm('Are you sure you want to delete this page? There is no undo.')) {
      this.deletePage(this.state.path)
    }
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
    const page = {
      slug: this.state.path,
      title: this.state.title,
      description: this.state.description,
      redirect_url: this.state.redirectURL,
      template: this.state.template
    }
    const contents = this.contentEditorContents()
    this.save(page, contents)
  }

  cancelPressed () {
    if (window.confirm('Discard changes and reload the page?')) {
      this.setState({editing: false})
      window.location.reload()
    }
  }

  pageSettingsPressed () {
    if (this.state.trayOpen && this.state.trayType !== 'page-settings') {
      this.setState({trayType: 'page-settings'})
    } else {
      this.setState({trayOpen: !this.state.trayOpen, trayType: 'page-settings'})
    }
  }

  save (page, contents) {
    this.external.save(page, contents, () => {
      this.setState({editing: false, pageModified: false, trayOpen: false})
      this.setState({pageToolsHidden: true})
    })
  }

  deletePage (path) {
    this.external.delete(path, () => {
      this.setState({deleted: true, editing: false})
    })
  }

  allContentEditors () {
    return document.querySelectorAll('.thesis-content')
  }

  addContentEditors () {
    this.htmlEditor.enable()
    this.rawHtmlEditor.enable()
    this.imageEditor.enable()
    this.textEditor.enable()
  }

  removeContentEditors () {
    this.htmlEditor.disable()
    this.rawHtmlEditor.disable()
    this.imageEditor.disable()
    this.textEditor.disable()
  }

  // TODO: This should be in `external`
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
    switch (t) {
      case 'image':
      case 'background_image':
        return this.imageEditor.getContent(ed)
      case 'text':
        return this.textEditor.content(ed)
      case 'html':
        return this.htmlEditor.content(ed)
      case 'raw_html':
        return this.rawHtmlEditor.content(ed)
      default:
        return ed.innerHTML
    }
  }

  componentDidUpdate () {
    const el = document.querySelector('body')
    el.classList.add('thesis-body')

    const editors = this.allContentEditors()

    if (this.state.editing) {
      el.classList.add('thesis-editing')
      this.addContentEditors()
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

    this.external.setTitle(this.state.title)
    this.external.setDescription(this.state.description)
    this.external.setRedirectURL(this.state.redirectURL)
  }

  canCreatePages () {
    return this.state.templates && this.state.templates.length > 0
  }

  renderEditorClass () {
    let classes = ''
    classes += (this.state.editing) ? ' active ' : ''
    classes += (this.state.pageToolsHidden) ? ' thesis-page-tools-hidden ' : ''
    classes += (this.canCreatePages()) ? ' thesis-add-page-tool-present ' : ''
    classes += (this.state.template) ? ' thesis-delete-page-tool-present ' : ''
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
    if (this.state.trayType === 'page-settings') {
      return <SettingsTray
        hasErrors={false}
        new={false}
        path={this.state.path}
        title={this.state.title}
        description={this.state.description}
        template={this.state.template}
        templates={this.state.templates}
        isDynamicPage={this.state.isDynamicPage}
        redirectURL={this.state.redirectURL}
        onCancel={this.trayCanceled}
        onSubmit={this.settingsTraySubmitted} />
    } else if (this.state.trayType === 'add-page') {
      return <SettingsTray
        hasErrors={false}
        new
        path={`${this.external.path.replace(/\/+$/, '')}/newpage`}
        title={''}
        description={''}
        template={''}
        templates={this.state.templates}
        isDynamicPage={this.state.isDynamicPage}
        redirectURL={''}
        onCancel={this.trayCanceled}
        onSubmit={this.settingsTraySubmitted} />
    } else if (this.state.trayType === 'image-url') {
      return this.imageEditor.tray(this.state.trayData)
    } else if (this.state.trayType === 'raw-html') {
      return this.rawHtmlEditor.tray(this.state.trayData)
    }
  }

  render () {
    if (this.state.deleted) { return <div id='thesis' /> }

    return (
      <div id='thesis'>
        <div id='thesis-editor' className={this.renderEditorClass()}>
          <SaveButton onPress={this.savePressed} />
          <SettingsButton onPress={this.pageSettingsPressed} />
          <CancelButton onPress={this.cancelPressed} />
          {this.canCreatePages() ? <AddButton onPress={this.addPagePressed} /> : null}
          {this.state.isDynamicPage ? <DeleteButton onPress={this.deletePagePressed} /> : null}
          <EditButton onPress={this.editPressed} text={this.renderEditButtonText()} />
        </div>
        <div id='thesis-fader' className={this.renderFaderClass()} />
        <div id='thesis-tray' className={this.renderTrayClass()}>
          {this.renderTray()}
          <AttributionText />
        </div>
      </div>
    )
  }
}

export default ThesisEditor
