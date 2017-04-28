import React, {Component} from 'react'
import getFeed from '../ajax/get-feed.js'

export default class FeedForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      url: '',
      error: false
    }

    this.handleUrlChange = this.handleUrlChange.bind(this)
    this.handleAddFeed = this.handleAddFeed.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  handleUrlChange (event) {
    this.setState({url: event.target.value, error: false})
  }

  handleAddFeed () {
    const {url} = this.state

    if (!url.trim()) return

    getFeed(url)
      .then(feed => {
        if (!feed) throw feed

        this.props.addFeed(feed)
        this.setState({url: ''})
      })
      .catch(e => {
        this.setState({error: true})
      })
  }

  handleKeyUp (event) {
    if (event.which === 13) {
      this.handleAddFeed()
    }
  }

  render () {
    return (
      <div className={'form-group well' + (this.state.error ? ' has-error' : '')}>
        <label 
          className="control-label"
          htmlFor="feed-url">
          Add feed
        </label>
        <div className="input-group">
          <div className="input-group-addon">https://</div>
          <input 
            className="form-control"
            id="feed-url"
            type="text" 
            value={this.state.url}
            onChange={this.handleUrlChange}
            onKeyUp={this.handleKeyUp} />
          <span className="input-group-btn">
            <button 
              className="btn btn-primary"
              onClick={this.handleAddFeed}>
              <span className="glyphicon glyphicon-plus"></span>
            </button>
          </span>
        </div>
      </div>
    )
  }
}