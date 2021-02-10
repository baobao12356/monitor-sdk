import { HTTP_CODE } from '../conmmon/constant'
import { isError } from '../util/help'
import { extractErrorStack } from './util'
import { ERRORTYPES } from './constant'
import { getLocationHref } from './util'


const HandleEvents = {
  /**
   * 处理xhr、fetch回调
   * @param {*} data 
   * @param {*} type 
   */
  handleHttp(data, type) {

  },

  /**
   * js 错误
   * @param {*} errorEvent 
   */
  handleError(errorEvent) {
    if (!this.webMonitor) return
    let vm = this.webMonitor


    const target = errorEvent.target
    // 资源错误
    if (!!target.localName) {
      return
    }
    // code error
    const { message, lineno, colno, error } = errorEvent
    let result
    if (error && isError(error)) {
      result = extractErrorStack(error)
    }
    // 处理SyntaxError，stack没有lineno、colno
    result || (result = HandleEvents.handleNotErrorInstance(message, lineno, colno))

    let data = {
      simpleUrl: getLocationHref(),
      errorMessage: String(JSON.stringify(result))
    }
    vm.logSave('js_error', data)
  },
  /**
   * 
   * @param {*} message 
   * @param {*} lineno 
   * @param {*} colno 
   */
  handleNotErrorInstance(message, lineno, colno) {
    let name = ERRORTYPES.UNKNOWN
    let msg = message
    const matches = message.match(ERROR_TYPE_RE)
    if (matches[1]) {
      name = matches[1]
      msg = matches[2]
    }
    const element = {
      func: ERRORTYPES.UNKNOWN_FUNCTION,
      args: ERRORTYPES.UNKNOWN,
      line: lineno,
      col: colno
    }
    return {
      name,
      message: msg,
      level: Severity.Normal,
      time: getTimestamp(),
      stack: [element]
    }
  },
}

export { HandleEvents }