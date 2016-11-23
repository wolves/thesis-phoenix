import React from 'react'
import ospryBuilder from '../utilities/ospry'
import Net from '../utilities/net'

const Ospry = ospryBuilder(window)

// NOTES
// add 'invalid' class to input to give it a red background
// add error text to the errors div and toggle the 'hidden' property
// add the 'disabled' property to inputs that can't be editted if page is static

class ImageTray extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      contentId: this.props.data.contentId,
      url: this.props.data.url,
      alt: this.props.data.alt,
      isValid: true,
      fileName: ''
    }

    this.urlChange = this.urlChange.bind(this)
    this.altChange = this.altChange.bind(this)
    this.onSave = this.onSave.bind(this)

    this.onOspryUpload = this.onOspryUpload.bind(this)

    this.uploadFile = this.uploadFile.bind(this)
    this.uploadFileToOspry = this.uploadFileToOspry.bind(this)

    this.renderForm = this.renderForm.bind(this)
    this.renderOspryForm = this.renderOspryForm.bind(this)
    this.renderUploaderForm = this.renderUploaderForm.bind(this)

    this.onCancel = props.onCancel
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data !== null) {
      this.setState({
        contentId: nextProps.data.contentId,
        url: nextProps.data.url,
        alt: nextProps.data.alt,
        isValid: true,
        fileName: ''
      })
    }
  }

  urlChange (event) {
    this.setState({ url: event.target.value })
  }

  altChange (event) {
    this.setState({ alt: event.target.value })
  }

  onSave () {
    this.props.onSubmit({
      contentId: this.state.contentId,
      url: this.state.url,
      alt: this.state.alt,
      fileName: this.state.fileName
    })
  }

  onOspryUpload (err, metadata) {
    if (err) return window.alert(err)
    this.setState({ url: metadata.httpsURL })
  }

  uploadFile (e) {
    this.setState({ fileName: e.target.files[0].name })

    e.preventDefault()
    Net.post('/thesis/files/upload', e.target.form, 'form')
    .then((response) => {
      if (response.path.length > 0) this.setState({ url: response.path })
    })
    .catch((error) => { window.alert(error) })
  }

  uploadFileToOspry (e) {
    this.setState({ fileName: e.target.files[0].name })

    const ospry = new Ospry(this.props.ospryPublicKey)

    e.preventDefault()
    const form = e.target
    ospry.up({
      form: form,
      imageReady: this.onOspryUpload
    })
  }

  previewImageStyle () {
    return {backgroundImage: `url(${this.state.url})`}
  }

  renderForm () {
    if (this.props.ospryPublicKey) {
      return this.renderOspryForm()
    } else if (this.props.fileUploader) {
      return this.renderUploaderForm()
    }
  }

  renderUploaderForm () {
    return (
      <div className='thesis-field-row'>
        <label>
          <span>Upload Image</span>
          <form onChange={this.uploadFile} className='tray-file-upload'>
            <span>{this.state.fileName}</span>
            <input type='file' accept='.jpg,.jpeg,.png,.gif,image/png,image/gif,image/jpeg,image/jpg' name='file' />
          </form>
        </label>
      </div>
    )
  }

  renderOspryForm () {
    if (this.props.ospryPublicKey) {
      return (
        <div className='thesis-field-row'>
          <label>
            <span>Upload Image</span>
            <form onChange={this.uploadFileToOspry} className='tray-file-upload'>
              <span>{this.state.fileName}</span>
              <input type='file' accept='.jpg,.jpeg,.png,.gif,image/png,image/gif,image/jpeg,image/jpg' />
            </form>
          </label>
        </div>
      )
    }
  }

  render () {
    return (
      <div className='tray-container'>
        <div className='tray-wrap'>
          <div className='tray-title'>
            Image URL
          </div>
          <div className='thesis-field-row'>
            <div className='tray-image-preview' style={this.previewImageStyle()} />
          </div>
          <div className='thesis-field-row'>
            <label>
              <span>Image URL</span>
              <input type='text' placeholder='http://placekitten.com/200/300' value={this.state.url} onChange={this.urlChange} />
            </label>
          </div>
          {this.renderForm()}
          <div className='thesis-field-row'>
            <label>
              <span>Alt Text</span>
              <input type='text' placeholder='Describe the image' value={this.state.alt} onChange={this.altChange} />
            </label>
          </div>
          <div className='thesis-field-row errors' hidden={this.state.isValid}>
            {/* Errors go here. Toggle the hidden property depending on error count. */}
          </div>
          <div className='thesis-field-row cta'>
            <button className='thesis-tray-cancel' onClick={this.onCancel}>
              Cancel
            </button>
            <button className='thesis-tray-save' onClick={this.onSave}>
              Apply
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default ImageTray
