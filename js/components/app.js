import React, {Component} from 'react'
import FeedForm from './feed-form.js'
import FeedList from './feed-list.js'
import FeedControl from './feed-control.js'
import FeedEntries from './feed-entries.js'
import {updateFeeds} from '../lib/get-feed.js'

const INTERVAL = 60000
const findCurrent = (current, feeds) => feeds.find(feed => feed.url === current)

export default class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      feeds: [],
      current: null,
      timeout: null
    }

    this.scheduleUpdate = this.scheduleUpdate.bind(this)
    this.handleAddFeed = this.handleAddFeed.bind(this)
    this.handleShowFeed = this.handleShowFeed.bind(this)
    this.handleRemoveFeed = this.handleRemoveFeed.bind(this)
    this.handleMarkRead = this.handleMarkRead.bind(this)
    this.handleMarkAllRead = this.handleMarkAllRead.bind(this)
  }

  scheduleUpdate () {
    updateFeeds(this.state.feeds).then(feeds => {
      const timeout = window.setTimeout(this.scheduleUpdate, INTERVAL)
      this.setState({feeds, timeout})
    })
  }

  componentWillMount () {
    const feeds = JSON.parse(localStorage.getItem('feeds')) || []
    this.setState({feeds})
  }

  componentDidMount () {
    this.scheduleUpdate()
  }

  componentWillUnmount () {
    window.clearTimeout(this.state.timeout)
  }

  handleAddFeed (feed) {
    const {feeds} = this.state
    const index = feeds.findIndex(current => current.url === feed.url)

    if (index === -1) {
      feeds.push(feed)
    } else {
      feeds[index] = feed
    }

    this.setState({feeds})
    localStorage.setItem('feeds', JSON.stringify(feeds))
  }

  handleShowFeed (url) {
    return event => {
      event.preventDefault()
      this.setState({current: url})
    }
  }

  handleRemoveFeed (url) {
    return () => {
      const feeds = this.state.feeds.filter(feed => feed.url !== url)

      this.setState({feeds})
      localStorage.setItem('feeds', JSON.stringify(feeds))
    }
  }

  handleMarkAllRead () {
    const {current, feeds} = this.state
    const currentEntries = findCurrent(current, feeds).entries

    currentEntries.forEach((entry, index) => {
      currentEntries[index].isRead = true
    })

    this.setState({feeds})
    localStorage.setItem('feeds', JSON.stringify(feeds))
  }

  handleMarkRead (id) {
    const {current, feeds} = this.state

    findCurrent(current, feeds)
      .entries
      .find(entry => entry.id === id)
      .isRead = true

    this.setState({feeds})
    localStorage.setItem('feeds', JSON.stringify(feeds))
  }

  render () {
    const {current, feeds} = this.state
    const currentFeed = findCurrent(current, feeds)

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-6">
            <FeedForm addFeed={this.handleAddFeed} />
            <FeedList
              feeds={feeds}
              current={current}
              showFeed={this.handleShowFeed}
              removeFeed={this.handleRemoveFeed}
            />
          </div>
          <div className="col-sm-6">
            <FeedControl
              markAllRead={this.handleMarkAllRead}
              current={current} />
            {currentFeed && (
              <FeedEntries
                entries={currentFeed.entries}
                markRead={this.handleMarkRead} />
            )}
          </div>
        </div>
      </div>
    )
  }
}