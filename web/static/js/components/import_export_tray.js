import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'

class ImportExportTray extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      stringifiedExportData: '',
      stringifiedImportData: '',
      exportDataButtonText: 'Copy to Clipboard'
    }

    this.onExportCopy = this.onExportCopy.bind(this)
    this.stringifyExportData = this.stringifyExportData.bind(this)
    this.onImportDataPaste = this.onImportDataPaste.bind(this)
    this.onImportApply = this.onImportApply.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      stringifiedExportData: '',
      stringifiedImportData: '',
      exportDataButtonText: 'Copy to Clipboard'
    })
  }

  componentDidMount () {
    this.stringifyExportData()
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.stringifiedExportData !== '') return

    this.stringifyExportData()
  }

  onExportCopy () {
    this.setState({exportDataButtonText: 'Copied!'})

    clearTimeout(window.exportDataButtonTextTimeout)
    window.exportDataButtonTextTimeout = setTimeout(() => {
      this.setState({ exportDataButtonText: 'Copy to Clipboard' })
    }, 2000)
  }

  stringifyExportData () {
    let exportData = {
      pageSettings: Object.assign({}, this.props.pageSettings, { origin: window.location.origin }),
      pageContents: this.props.pageContents
    }

    const stringifiedExportData = JSON.stringify(exportData)

    this.setState({ stringifiedExportData: stringifiedExportData })
  }

  onImportDataPaste (e) {
    this.setState({ stringifiedImportData: e.target.value })
  }

  onImportApply () {
    this.props.updateImportProgress({ type: 'in-progress', text: 'Importing content. This may take some time.' })

    const data = this.getImportData()

    if (data) {
      this.props.importData(data.pageSettings, data.pageContents)
    } else {
      this.setImportProgressError({ type: 'error', text: 'The data entered is invalid.' })
    }
  }

  getImportData () {
    const importData = this.parseStringifiedImportData()
    return (importData && importData.pageSettings && importData.pageContents) ? importData : null
  }

  parseStringifiedImportData () {
    try {
      return JSON.parse(this.state.stringifiedImportData)
    } catch (ex) {
      return null
    }
  }

  setImportProgressError (error) {
    this.props.updateImportProgress(error)

    clearTimeout(window.importProgressErrorTimeout)
    window.importProgressErrorTimeout = setTimeout(() => {
      this.props.updateImportProgress(null)
      this.setState({ stringifiedImportData: '' })
    }, 3500)
  }

  render () {
    if (this.props.importProgress) {
      return this.renderImportStatus()
    } else {
      return this.renderImportExportActions()
    }
  }

  renderImportExportActions () {
    return (
      <div className='tray-container'>
        <div className='tray-wrap'>
          <div className='tray-title'>Import / Export Content</div>
          <div className='thesis-field-row'>
            <label>
              <span>Export Page Content</span>
              <textarea value={this.state.stringifiedExportData} className='thesis-tray-export-data-textarea' readOnly />
              <CopyToClipboard text={this.state.stringifiedExportData} onCopy={this.onExportCopy}>
                <button className='thesis-tray-export'>{this.state.exportDataButtonText}</button>
              </CopyToClipboard>
            </label>
          </div>
          <br />
          <br />
          <div className='thesis-field-row'>
            <label>
              <span>Import Page Content</span>
              <textarea placeholder='Paste the exported data here.' className='thesis-tray-import-data-textarea' onChange={this.onImportDataPaste} value={this.state.stringifiedImportData} />
            </label>
          </div>
          <div className='thesis-field-row cta'>
            <button className='thesis-tray-cancel' onClick={this.props.onCancel}>
              Cancel
            </button>
            <button className='thesis-tray-save' onClick={this.onImportApply}>
              Import
            </button>
          </div>
        </div>
      </div>
    )
  }

  renderImportStatus () {
    return (
      <div className='tray-container'>
        <div className='tray-wrap'>
          <div className='tray-title'>Import / Export Content</div>
          <div className={`thesis-tray-import-progress ${this.props.importProgress.type}`}>
            <div className='thesis-tray-loader'><span /></div>
            <div className='thesis-tray-import-status'>{this.props.importProgress.text}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default ImportExportTray
