import React from 'react'

class DeleteButton extends React.Component {
  render () {
    return (
    <div className="thesis-button delete">
      <div className="tooltip">
        Delete This Page
      </div><i className="fa fa-trash fa-2x"></i>
    </div>
    )
  }
}

export default DeleteButton
