import React from 'react'

class CancelButton extends React.Component {
  render() {
    return (
      <div onClick={this.props.onPress} className="thesis-button cancel"><div className="tooltip">Discard Changes</div><i className="fa fa-remove fa-2x"></i></div>
    )
  }
}

export default CancelButton

