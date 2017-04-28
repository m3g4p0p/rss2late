import React from 'react'

export default function FeedList ({feeds, current, showFeed, removeFeed}) {
  const feedItems = feeds.map(feed => (
    <a 
      href="#"
      onClick={showFeed(feed.url)}
      className={'list-group-item' + (feed.url === current ? ' list-group-item-info' : '')}
      key={feed.url}>
      <button
        className="close"
        type="button" 
        onClick={removeFeed(feed.url)}>
        &times;
      </button>
      <span>{feed.title}</span>
      <span className="badge">{feed.unread}</span>
    </a>
  ))
  
  return (
    <div className="list-group feed-list">
      {feedItems}
    </div>
  )
}