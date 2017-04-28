import React from 'react'

export default function FeedControl ({current, markAllRead}) {
  return (
    <div className="well">
      <button 
        className="btn btn-block btn-warning"
        disabled={!current}
        onClick={markAllRead}>
        Mark all read
      </button>
    </div>
  )
}