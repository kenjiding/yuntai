function handleKeybordOpen () {
  //兼容Android端的键盘弹出时，输入框不在可视区域内
  if (/Android/.test(navigator.appVersion)) {
    window.addEventListener('resize', function () {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        document.activeElement.scrollIntoView();
      }
    });
  }
}

function handleInputLimit () {
  // document.addEventListener('keypress', (e) => {
  //   const { target, key } = e;
  //   if (target.tagName.toUpperCase() !== 'INPUT') return;

  //   if (target.getAttribute('type') !== 'number') return;

  //   if (/^[.]$/.test(key) && ~target.value.toString().indexOf('.')) {
  //     return e.preventDefault();
  //   }

  //   if (/^[0-9]$/.test(key) && parseFloat(target.value) > 100000000) {
  //     return e.preventDefault();
  //   }

  //   if (
  //     /^[A-z]$/.test(key) &&
  //     !e.altKey &&
  //     !e.ctrlKey &&
  //     !e.metaKey &&
  //     !e.shiftKey
  //   ) {
  //     return e.preventDefault();
  //   }

  //   return true;
  // }, false);
}

export default (function () {
  handleKeybordOpen();
  handleInputLimit();
})();
