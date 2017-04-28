import React, {Component} from 'react'
import {ipcRenderer} from 'electron'

export default class FeedEntries extends Component {

  constructor (props) {
    super(props)

    this.state = {
      current: null
    }

    this.handleShowEntry = this.handleShowEntry.bind(this)
  }

  handleShowEntry ({id, link}) {
    return event => {
      event.preventDefault()

      if (id === this.state.current) {
        if (link && event.target.matches('.title span')) {
          ipcRenderer.send('open-link', link)
        } else if (event.target.matches('a[href]')) {
          ipcRenderer.send('open-link', event.target.href)
        } else {
          this.setState({current: null})
        }
      } else {
        this.props.markRead(id)
        this.setState({current: id})
      }
    }
  }

  render () {    
    const entryItems = this.props.entries.map(entry => {
      const isCurrent = this.state.current === entry.id

      return (
        <a
          href="#"
          key={entry.id} 
          className={'list-group-item' + (isCurrent ? ' active' : '')}
          onClick={this.handleShowEntry(entry)}>
          <div className="title">
            <span>{entry.title}</span>
            {!entry.isRead && <span className="label label-success">new</span>}
          </div>
          {isCurrent && (
            <div className="content">
              <div dangerouslySetInnerHTML={entry.summary} />
              <div className="text-right">
                <small>{entry.date.toLocaleString()}</small>
              </div>
            </div>
          )}
        </a>
      )
    })

    return (
      <div className="list-group feed-entries">
        {entryItems}
      </div>
    )
  }
}