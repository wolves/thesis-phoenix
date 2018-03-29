import React from 'react'

class TrayNotifications extends React.Component {
  constructor (props) {
    super(props)
  }

  renderNotifications () {
    if (!this.props.notifications.length) return
    return (
      <div className='thesis-tray-notifications-wrap'>
        {this.props.notifications.map(n => <div className='thesis-tray-notification'><i className='fa fa-exclamation-triangle fa-2x' />{n}</div>)}
      </div>
    )
  }

  render () {
    return (
      <div className='thesis-tray-notifications'>
        {this.renderNotifications()}
      </div>
    )
  }
}

export default TrayNotifications
