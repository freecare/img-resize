export const getUa = () => {
  const ua = navigator.userAgent
  const isIOS = /OS (\d+)_.* like Mac OS X/g.exec(ua)
  const isAndroid = /Android[\s/](\d.*?)[\s;]/g.exec(ua)

  return {
    oldIOS: isIOS ? +isIOS.pop() < 8 : false,
    oldAndroid: isAndroid ? +isAndroid.pop().substring(0, 3) < 4.5 : false,
    ios: /\(i[^;]+;( U;)? CPU.+Mac OS X/.test(ua),
    android: /Android/g.test(ua),
    mQQBrowser: /MQQBrowser/g.test(ua)
  }
}
