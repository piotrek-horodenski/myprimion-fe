
export const howLongAgo = (time, since) => {
  const sinceWhen = new Date(since).getTime()
  const timestamp = new Date(time).getTime()
  const seconds = Math.floor(Math.max(0, sinceWhen - timestamp) / 1000)
  let interval = seconds / 31536000

  if (interval >= 2) {
    return Math.abs(Math.floor(interval)) + ' years'
  } else if (interval >= 1) {
    return Math.abs(Math.floor(interval)) + ' year'
  }
  interval = seconds / 2592000
  if (interval >= 2) {
    return Math.abs(Math.floor(interval)) + ' months'
  } else if (interval >= 1) {
    return Math.abs(Math.floor(interval)) + ' month'
  }
  interval = seconds / 86400
  if (interval >= 2) {
    return Math.abs(Math.floor(interval)) + ' days'
  } else if (interval >= 1) {
    return Math.abs(Math.floor(interval)) + ' day'
  }
  interval = seconds / 3600
  if (interval >= 2) {
    return Math.abs(Math.floor(interval)) + ' hours'
  } else if (interval >= 1) {
    return Math.abs(Math.floor(interval)) + ' hour'
  }
  interval = seconds / 60
  if (interval >= 2) {
    return Math.abs(Math.floor(interval)) + ' minutes'
  } else if (interval >= 1) {
    return Math.abs(Math.floor(interval)) + ' minute'
  }

  if (Math.floor(seconds) === 1) {
    return Math.floor(seconds) + ' second'
  } 
  return Math.floor(seconds) + ' seconds'
}
