import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import Net from '../utilities/net'

class ImportExportRestoreTray extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      stringifiedExportData: '',
      stringifiedImportData: '',
      exportDataButtonText: 'Copy to Clipboard',
      revisions: []
    }

    this.onExportCopy = this.onExportCopy.bind(this)
    this.stringifyExportData = this.stringifyExportData.bind(this)
    this.onImportDataPaste = this.onImportDataPaste.bind(this)
    this.onImportApply = this.onImportApply.bind(this)
    this.onRevisionSelect = this.onRevisionSelect.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      stringifiedExportData: '',
      stringifiedImportData: '',
      exportDataButtonText: 'Copy to Clipboard',
      revisions: []
    })
  }

  componentDidMount () {
    this.stringifyExportData()
    this.getPageRevisions()
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.stringifiedExportData !== '') return

    this.stringifyExportData()
    this.getPageRevisions()
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

  getPageRevisions () {
    const pageSlug = this.props.pageSettings.slug

    Net.get(`/thesisws?page_slug=${pageSlug}`, null, 'query')
    .then((data) => {
      this.setState({ revisions: data })
    })
    .catch((error) => { window.alert(error) })
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

  prettyRevisionName (rev) {
    return `Rev ${rev.page_revision} made on ${rev.pretty_date}`
  }

  onRevisionSelect (e) {
    Net.get(`/thesis/restore/${e.target.value}`, null, 'query')
    .then((data) => {
      this.setState({ stringifiedImportData: data.revision })
    })
    .catch((error) => { window.alert(error) })
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
          <br />
          <br />
          <div className='thesis-field-row'>
            <label>
              <span>Page Revisions</span>
              <div className='select'>
                <select value='placeholder' onChange={this.onRevisionSelect}>
                  <option value='placeholder' disabled>- Select Revision -</option>
                  {this.state.revisions.map((revision) => {
                    return <option key={revision.id} value={revision.id}>{this.prettyRevisionName(revision)}</option>
                  })}
                </select>
              </div>
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

export default ImportExportRestoreTray
