export const pxToVw = (value) => ((value / 375 * 100) + 'vw');

// 获取光标位置
export function getCursortPosition (textDom) {
  let cursorPos = 0;
  if (textDom.selectionStart || textDom.selectionStart === '0') {
    // Firefox support
    cursorPos = textDom.selectionStart;
  }
  return cursorPos;
}

/**
 * 百度统计
 * @param {String} url 统计地址
 */
export function statistical (url) {
  // 生产环境 百度统计
  if (window.location.hostname === 'rapa.vip') {
    window._hmt.push(['_trackPageview', url]);
  }
}
