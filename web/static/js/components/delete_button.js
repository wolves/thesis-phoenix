import React, { PropTypes } from 'react'

class DeleteButton extends React.Component {
  render() {
    return (
      <div className="thesis-button delete"><div className="tooltip">Delete Page</div><i className="fa fa-trash fa-2x"></i></div>
    )
  }
}

DeleteButton.propTypes = {

}

export default DeleteButton

