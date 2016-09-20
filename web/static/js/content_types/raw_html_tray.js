import React from 'react'

// NOTES
// add 'invalid' class to input to give it a red background
// add error text to the errors div and toggle the 'hidden' property
// add the 'disabled' property to inputs that can't be editted if page is static

class RawHtmlTray extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      contentId: props.data.contentId,
      content: props.data.content,
      isValid: true
    }

    this.contentChange = this.contentChange.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onCancel = props.onCancel
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data !== null) {
      this.setState({
        contentId: nextProps.data.contentId,
        content: nextProps.data.content.trim(),
        isValid: true
      })
    }
  }

  contentChange (event) {
    this.setState({content: event.target.value})
  }

  onSave () {
    this.props.onSubmit(this.state)
  }

  render () {
    return (
      <div className='tray-container'>
        <div className='tray-wrap'>
          <div className='tray-title'>
            Raw HTML
          </div>
          <div className='thesis-field-row'>
            <label>
              <span>HTML code</span>
              <textarea placeholder='<h1>Any HTML you like</h1>' value={this.state.content} onChange={this.contentChange}></textarea>
            </label>
          </div>
          <div className='thesis-field-row errors' hidden={this.state.isValid}>
            {/* Errors go here. Toggle the hidden property depending on error count. */}
          </div>
          <div className='thesis-field-row cta'>
            <button className='thesis-tray-cancel' onClick={this.props.onCancel}>
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

export default RawHtmlTray
