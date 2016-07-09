import React, { PropTypes } from 'react'

// NOTES
// add 'invalid' class to input to give it a red background
// add error text to the errors div and toggle the 'hidden' property
// add the 'disabled' property to inputs that can't be editted if page is static

class SettingsTray extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: this.props.pageTitle,
      description: this.props.pageDescription,
      isValid: true
    }

    this.titleChange = this.titleChange.bind(this)
    this.descriptionChange = this.descriptionChange.bind(this)
    this.onSave = this.onSave.bind(this)
  }

  titleChange (event) {
    this.setState({title: event.target.value})
  }

  descriptionChange (event) {
    this.setState({description: event.target.value})
  }

  onSave () {
    this.props.onSubmit(this.state)
  }

  render () {
    return (
      <div className="tray-container">
        <div className="tray-wrap">
          <div className="tray-title">
            Page Settings
          </div>
          <div className="thesis-field-row">
            <label>
              <span>Page Path</span>
              <input type="text" value={this.props.path} disabled />
            </label>
          </div>
          <div className="thesis-field-row">
            <label>
              <span>Page Title</span>
              <input type="text" placeholder="Example Title" value={this.state.title} onChange={this.titleChange} />
            </label>
          </div>
          <div className="thesis-field-row">
            <label>
              <span>Page Description</span>
              <textarea placeholder="Example page description." value={this.state.description} onChange={this.descriptionChange}></textarea>
            </label>
          </div>
          <div className="thesis-field-row errors" hidden={this.state.isValid}>
            {/* Errors go here. Toggle the hidden property depending on error count. */}
          </div>
          <div className="thesis-field-row cta">
            <button className="thesis-tray-cancel" onClick={this.props.onCancel}>
              Cancel
            </button>
            <button className="thesis-tray-save" onClick={this.onSave}>
              Apply
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default SettingsTray
