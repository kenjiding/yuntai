import { Toast } from 'vant';

// 这个方法用于检查当前各个字段是否都不为空
export function checkEmpty (detail, action) {
  if (!detail.Name || !detail.StartTime || !detail.EndTime || !detail.TotalCodeCount || !detail.CustomerServicePhone) {
    return true;
  }

  if (action === 'item') {
    if (detail.ActivityType === 'ItemInvite' && !detail.GavingAddress) {
      return true;
    }
    if (detail.ActivityType === 'ItemMail' && !detail.EmailAddress) {
      return true;
    }

    let isGiftPass = detail.GiftList.some(item => !item.Name || !item.Amount);
    if (isGiftPass) {
      return true;
    }
  } else {
    if (!detail.TotalCount || !detail.CustomerName || !detail.BlessStatements) {
      return true;
    }

    if (detail.ActivityType === 'CashFixed' && !detail.FixedAmount) {
      return true;
    }
    if (detail.ActivityType === 'CashRandom' && (!detail.MinAmount || !detail.MaxAmount)) {
      return true;
    }
  }

  return false;
}

// 这个方法用于检查当前各个字段是否通过验证
export function checkFormat (detail, action) {
  // 先检查数字
  let numberReg = /^\d+$/;

  if (action === 'item' && detail.GiftList.some(item => !numberReg.test(item.Amount))) {
    Toast('奖品数量必须为整数');
    return false;
  }

  if (action === 'cash' && !numberReg.test(detail.TotalCount)) {
    Toast('红包数量必须为整数');
    return false;
  }

  if (action === 'cash') {
    if (detail.ActivityType === 'CashFixed') {
      if (!numberReg.test(detail.FixedAmount)) {
        Toast('单个红包金额必须为整数');
        return false;
      } else if (detail.FixedAmount < 1 || detail.FixedAmount > 200) {
        Toast('单个红包金额必须在1～200之间');
        return false;
      }
    } else if (detail.ActivityType === 'CashRandom') {
      if (!numberReg.test(detail.MinAmount)) {
        Toast('最小红包金额必须为整数');
        return false;
      } else if (detail.MinAmount < 1 || detail.MinAmount > 200) {
        Toast('最小红包金额必须在1～200之间');
        return false;
      }

      if (!numberReg.test(detail.MaxAmount)) {
        Toast('最大红包金额必须为整数');
        return false;
      } else if (detail.MaxAmount < 1 || detail.MaxAmount > 200) {
        Toast('最大红包金额必须在1～200之间');
        return false;
      }

      if (detail.MinAmount > detail.MaxAmount) {
        Toast('最小红包金额不得大于最大红包金额');
        return false;
      }
    }
  }

  if (!numberReg.test(detail.TotalCodeCount)) {
    Toast('福袋码总数量需为整数');
    return false;
  }

  // 检查电话
  let phoneReg = /^1\d{10}$/;
  let telReg = /^0\d{2,3}-\d{7,8}$/;
  if (!telReg.test(detail.CustomerServicePhone) && !phoneReg.test(detail.CustomerServicePhone)) {
    Toast('客服电话号码格式不正确');
    return false;
  }

  // 检查电子邮箱地址
  let emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
  if (action === 'item' && detail.ActivityType === 'ItemMail' && !emailReg.test(detail.EmailAddress)) {
    Toast('电子邮箱地址格式不正确');
    return false;
  }

  return true;
}

export function checkCurrencyFormat (detail) {
  // 先检查数字
  let numberReg = /^\d+$/;

  if (detail.ActivityType === 'CurrencyFixed' && !numberReg.test(detail.FixedAmount)) {
    Toast('单个红包币数必须为整数');
    return false;
  }
  // if (detail.ActivityType === 'CurrencyRandom' && !numberReg.test(detail.MinAmount)) {
  //   Toast('红包币数最小值必须为整数');
  //   return false;
  // }
  // if (detail.ActivityType === 'CurrencyRandom' && !numberReg.test(detail.MaxAmount)) {
  //   Toast('红包币数最大值必须为整数');
  //   return false;
  // }
  if (!numberReg.test(detail.TotalCount)) {
    Toast('红包总个数必须为整数');
    return false;
  }
  if (!numberReg.test(detail.TotalCodeCount)) {
    Toast('福袋码总数量必须为整数');
    return false;
  }

  return true;
}

export function checkCurrencyEmpty (detail) {
  if (!detail.Name || !detail.StartTime || !detail.EndTime || !detail.TotalCount || !detail.TotalCodeCount) {
    return true;
  }

  if (detail.ActivityType === 'CurrencyFixed' && !detail.FixedAmount) {
    return true;
  }
  if (detail.ActivityType === 'CurrencyRandom' && (!detail.TotalAmount)) { //!detail.MinAmount || !detail.MaxAmount ||
    return true;
  }

  return false;
}
