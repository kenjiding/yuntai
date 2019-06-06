<!--
  此示例代码文件为自动生成 ===> build-files/build-icon-example
  请执行 yarn build:icon 生成此文件
-->
<template>
  <ych-page>
    <ul class="icon_lists">
      <li
        v-for="item in icon"
        :key="item.className">
        <van-icon :name="item.className"/>
        <div class="name">{{ item.name }}</div>
        <div class="fontclass">{{ item.className }}</div>
      </li>
    </ul>
  </ych-page>
</template>

<script type="text/javascript">
export default {
  name: 'Icon',
  data () {
    return {
      icon: [
        {
          name: '感叹号',
          className: 'gantanhao1',
        },
        {
          name: '门店',
          className: 'mendian',
        },
        {
          name: '向右',
          className: 'xiangyou',
        },
        {
          name: '购物车',
          className: 'shangpin',
        },
        {
          name: '扫码',
          className: 'qr',
        },
        {
          name: 'Add',
          className: 'add-circle',
        },
        {
          name: '码',
          className: 'ma',
        },
        {
          name: '搜索',
          className: 'search',
        },
        {
          name: '皇冠',
          className: 'huangguan',
        },
        {
          name: '账本',
          className: 'danjia',
        },
        {
          name: '推送',
          className: 'tuisong',
        },
        {
          name: '215更多-横向',
          className: 'dot',
        },
        {
          name: '303正确、完成',
          className: 'save',
        },
        {
          name: '304错误、关闭、取消',
          className: 'close',
        },
        {
          name: '分组',
          className: 'fenzu',
        },
        {
          name: '编号',
          className: 'bianhao',
        },
        {
          name: '提现',
          className: 'tixian',
        },
        {
          name: '箱子',
          className: 'box',
        },
        {
          name: 'wifi',
          className: 'wifi1',
        },
        {
          name: '脉冲_pulse1',
          className: 'maichong',
        },
        {
          name: '账号 (1)',
          className: 'zhanghao',
        },
        {
          name: '打印',
          className: 'dayin',
        },
        {
          name: '礼品',
          className: 'gift',
        },
        {
          name: '反馈',
          className: 'fankui',
        },
        {
          name: '积分',
          className: 'jifen',
        },
        {
          name: '购物车空',
          className: 'cart',
        },
        {
          name: '巫毒娃娃',
          className: 'bear',
        },
        {
          name: 'remove',
          className: 'remove-circle',
        },
        {
          name: '二维码',
          className: 'erweima',
        },
        {
          name: '订单',
          className: 'dingdan',
        },
        {
          name: '下 拉',
          className: 'xiala',
        },
        {
          name: '分流',
          className: 'fenliu',
        },
        {
          name: '电',
          className: 'dian',
        },
        {
          name: '类型',
          className: 'leixing',
        },
        {
          name: '性别 男 线性',
          className: 'xingbienanxianxing',
        },
        {
          name: '性别 女 线性',
          className: 'xingbienvxianxing',
        },
        {
          name: 'icon-svg-约等于',
          className: 'icon-svg-yuedengyu',
        },
        {
          name: '地址',
          className: 'dizhi',
        },
        {
          name: '设置',
          className: 'shezhi',
        },
        {
          name: '添加 加',
          className: 'tianjia',
        },
        {
          name: '百分比',
          className: 'gailv',
        },
        {
          name: '自动适应文本宽度',
          className: 'kuaidu',
        },
        {
          name: '定位 位置 坐标 线性',
          className: 'weizhi',
        },
        {
          name: '切换',
          className: 'qiehuan',
        },
        {
          name: '下  拉',
          className: 'arrow-up',
        },
        {
          name: '下  拉',
          className: 'arrow-down',
        },
        {
          name: '芸游logo（面）',
          className: 'yunyoulogomian',
        },
        {
          name: '芸苔新零售logo',
          className: 'yuntaixinlingshoulogo',
        },
        {
          name: '已过期',
          className: 'yiguoqi',
        },
        {
          name: '已领完',
          className: 'yilingwan',
        },
        {
          name: 'V5',
          className: 'V',
        },
        {
          name: 'V4',
          className: 'V1',
        },
        {
          name: 'V2',
          className: 'V2',
        },
        {
          name: 'V1',
          className: 'V3',
        },
        {
          name: 'V3',
          className: 'V4',
        },
        {
          name: 'V4(灰色）',
          className: 'Vhuise',
        },
        {
          name: 'V2(灰色）',
          className: 'Vhuise1',
        },
        {
          name: 'V3(灰色）',
          className: 'Vhuise2',
        },
        {
          name: 'V5(灰色）',
          className: 'Vhuise3',
        },
        {
          name: '实物礼品',
          className: 'item',
        },
        {
          name: '现金红包',
          className: 'cash',
        },
      ],
    };
  },
};
</script>

<style lang="scss">
@import '@/styles/them.scss';

.icon_lists {
  width: 100% !important;
}

.icon_lists li {
  float: left;
  width: 33vw;
  height: 180px;
  text-align: center;
  list-style: none !important;
}

.icon_lists .van-icon {
  font-size: 42px;
  line-height: 100px;
  margin: 10px 0;
  color: $color-black;
}

</style>
