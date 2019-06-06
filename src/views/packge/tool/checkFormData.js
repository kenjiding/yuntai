import { Toast } from 'vant';

export default (options = {}) => {
  let obj = options.data;
  let arr = options.ignore || [];
  let tipsText = options.message || {};

  if (valueType(obj) === 'Array') {
    return checkArray();
  } else {
    return checkObj(obj);
  }

  //如果表单数据是一个数组的话，循环检查全部表单，例如游戏币套餐的增加套餐功能
  function checkArray () {
    for (let i = 0; i < obj.length; i++) {
      //执行checkObj，当第一个表单数据检查成功，返回true的时候，继续检查剩余的。直到全部检查完。当检查返回false的话，直接return false，结束检查
      if (checkObj(obj[i])) {
        checkObj(obj[i]);
      } else {
        return checkObj(obj[i]);
      }
    };
    return true;
  }
  //如果只有一个表单数据，而且是对象，执行此函数
  function checkObj (objValue) {
    for (let val in objValue) {
      if (arr.indexOf(val) > -1) {
        continue;
      }

      if (Array.isArray(objValue[val])) {
        if (objValue[val].length < 1) {
          Toast(tipsText[val] || '请填写完整信息1！！！');
          return false;
        }
      }

      if (valueType(objValue[val]) === 'Object') {
        for (let name in objValue[val]) {
          if (valueType(objValue[val][name]) === 'Boolean') {
            continue;
          }

          if (objValue[val][name] === '') {
            Toast(tipsText[name] || '请填写完整信息2！！！');
            return false;
          } else {
            continue;
          }
        }
      }

      if (objValue[val] === '' || objValue[val] === null) {
        Toast(tipsText[val] || '请填写完整信息3！！！');
        return false;
      }
    }
    return true;
  }

  function valueType (o) {
    if (o instanceof Array) {
      return 'Array';
    } else if (o instanceof Object) {
      return 'Object';
    } else if (o instanceof Boolean) {
      return 'Boolean';
    } else {
      return 'param is no object type';
    }
  }
};
