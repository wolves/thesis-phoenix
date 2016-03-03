import React, { PropTypes } from 'react'

class CancelButton extends React.Component {
  render() {
    return (
      <div className="thesis-button cancel"><div className="tooltip">Discard Changes</div><i className="fa fa-remove fa-2x"></i></div>
    )
  }
}

CancelButton.propTypes = {

}

export default CancelButton

