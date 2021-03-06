import { isObject } from 'lodash'
import { sessionStorage as supportSession } from './support'

let sessionKey = 'tg_session_cache'
let cache = supportSession ? sessionStorage : false
let data = supportSession ? JSON.parse((
  cache.getItem(sessionKey) || JSON.stringify({}))) : {}
let sessionData = function() {
  let length = arguments.length
  if (!length) {
    return data
  } else if (length === 1) {
    if (isObject(arguments[0])) {
      data = Object.assign({}, data, arguments[0])
      cache && cache.setItem(sessionKey, JSON.stringify(data))
    } else {
      return data[arguments[0]]
    }
  } else if (length === 2) {
    data[arguments[0]] = arguments[1]
    cache && cache.setItem(sessionKey, JSON.stringify(data))
  }
}
sessionData.remove = function(key) {
  let length = arguments.length
  if (!length) {
    this.removeAll()
  } else {
    for (let i = 0; i < length; i++) {
      data[arguments[i]] = undefined
      delete data[arguments[i]]
    }
    cache && cache.setItem(sessionKey, JSON.stringify(data))
  }
}
sessionData.removeAll = function() {
  data = {}
  cache && cache.setItem(sessionKey, JSON.stringify(data))
}

export { sessionData }

export default sessionData
