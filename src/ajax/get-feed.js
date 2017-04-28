import sanitizeHtml from 'sanitize-html'

const sanitizeOptions = {
  allowedTags: false,
  allowedAttributes: {
    a: ['href'],
    img: ['src']
  }
}

const createEntry = entry => {
  const title = entry.querySelector('title')
  const link = entry.querySelector('link')
  const id = entry.querySelector('id, guid')
  const summary = entry.querySelector('summary, description')
  const date = entry.querySelector('updated, pubDate')

  return {
    id: id && id.textContent,
    title: title && title.textContent,
    link: link && (link.getAttribute('href') || link.textContent),
    summary: summary && {__html: sanitizeHtml(summary.textContent, sanitizeOptions)},
    date: date ? new Date(date.textContent) : new Date()
  }
}

const createFeed = xhr => {
  const url = xhr.responseURL
  const xml = xhr.responseXML
  const title = xml.querySelector('title')

  const entries = Array
    .from(xml.querySelectorAll('entry, item') || [])
    .map(createEntry)
    .filter(entry => entry.id && entry.title)
    .sort((a, b) => b.date - a.date)

  console.log(entries)

  return {
    url,
    title: title ? title.textContent : url,
    entries,
    get unread () {
      return this.entries.filter(entry => !entry.isRead).length
    }
  }
}

const getFeed = url => {

  if (!/https?\:\/\//.test(url)) {
    url = 'https://' + url.replace(/^.*\/\//, '')
  }

  return new Promise ((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.overrideMimeType('text/xml')
    xhr.open('GET', url)

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(createFeed(xhr))
        } else {
          reject(xhr)
        }
      }
    }

    xhr.send()
  })
}

const feedMemo = {}

const findEntry = (id, feed) => {
  feedMemo[feed.url] = feedMemo[feed.url] || {}

  if (feedMemo[feed.url][id]) {
    return feedMemo[feed.url][id]
  }

  feedMemo[feed.url][id] = feed.entries.find(entry => entry.id === id)
  return feedMemo[feed.url][id] || {}
}

const createPromise = current => new Promise (resolve => {
  getFeed(current.url)
    .then(feed => {
      if (!feed) throw feed

      feed.entries = feed.entries.map(entry => Object.assign(
        findEntry(entry.id, current),
        entry
      ))

      resolve(feed)
    })
    .catch(e => {
      resolve(current)
    })
})

const updateFeeds = feeds => {
  return Promise.all(feeds.map(createPromise))
}

export {getFeed as default, updateFeeds}