<template>
  <ych-page>
    <div :class="$style.wrap">
      <div :class="$style.header">
        <div :class="$style.topText">
          <span>{{`${GameCurrenceLogData.Name} (${GameCurrenceLogData.Phone})`}}</span>
          <span>{{GameCurrenceLogData.Date | date()}}</span>
        </div>
        <div :class="$style['header-main']">
          <p>{{GameCurrenceLogData.CurrenceName || '免费领币，快乐游玩！'}}</p>
          <p>{{GameCurrenceLogData.CurrenceNum | number}}币</p>
        </div>
        <p :class="$style['header-bottom']">已领取{{GameCurrenceLogData.GetCurrence | number}}币</p>
      </div>
      <div :class="$style.content">
        <p :class="$style['content-text']">
          共{{GameCurrenceLogData.Acount}}个/已领{{GameCurrenceLogData.AlreadyNum}}个
        </p>
        <van-cell-group>
          <van-list
            v-model="listLoading"
            :finished="listFinished"
            @load="getList"
            :offset="500"
            >
            <van-cell
              v-for="(item, index) in ItemList"
              :key="index"
              :value="'已领取' + item.GetCurrenceNum + '币'">
              <template slot="title">
                <img :src="item.Headimgurl" :class="$style.avator"/>
                <div :class="$style.logInfo">
                  <span
                    :class="$style.levelStyle">{{item.Name}}</span>
                  <van-tag :type="IsSex(item.Sex)" v-show="IsSex(item.Sex)">
                    <van-icon :name="item.Sex === 'Man' ? 'xingbienanxianxing' : 'xingbienvxianxing'" />
                  </van-tag>
                  <van-tag
                    type="success">{{item.Level}}</van-tag>
                  <p>手机号：{{item.PhoneNum}}</p>
                </div>
              </template>
            </van-cell>
          </van-list>
        </van-cell-group>
      </div>
    </div>
  </ych-page>
</template>

<script>
import { Cell, CellGroup, Icon, DatetimePicker, Popup, Toast, List } from 'vant';
import Promotion from '@/api/Promotion';

export default {
  name: '',

  data () {
    return {
      GameCurrenceLogData: {},
      ItemList: [],
      pageIndex: 1,
      listLoading: false,
      listFinished: false,
    };
  },

  computed: {
  },

  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Icon.name]: Icon,
    [DatetimePicker.name]: DatetimePicker,
    [Popup.name]: Popup,
    [List.name]: List,
  },

  methods: {
    IsSex (sex) {
      if (sex === 'Man') {
        return 'primary';
      } else if (sex === 'Woman') {
        return 'danger';
      } else {
        return '';
      }
    },
    getData () {
      Toast.loading({
        message: '加载中...',
        duration: 0,
        mask: true,
      });
      this.getList();
      Promotion.getGameCurrenceInfoLogAsync({ID: this.$route.query.ID}).then(res => {
        this.GameCurrenceLogData = Object.assign({}, res.Data[0]);
        Toast.clear();
      });
    },
    getList () {
      this.listLoading = true;
      Promotion.getGameCurrenceLogListAsync({
        pageIndex: this.pageIndex++,
        pageSize: 30,
        ID: this.$route.query.ID,
      }).then(res => {
        this.listLoading = false;

        if (res.ItemList.length === 0) {
          this.listFinished = true;
          return;
        }
        this.ItemList = this.ItemList.concat(res.ItemList);
      }, _ => {
        this.listLoading = false;
        this.listFinished = true;
      });
    },
  },
  created () {
    this.getData();
  },
};
</script>

<style lang='scss' module>
// stylelint-disable
@import "@/styles/them.scss";
@import "@/styles/mixins.scss";

.levelStyle {
  display: inline-block;
  max-width: 80px;
  vertical-align: middle;

  @include ellipsis(1);
}

.logInfo {
  float: left;
  margin-left: 10px;
}
.avator {
  width: 50px;
  height: 48px;
  float: left;
}

.content {
  .van-cell__title {
    flex: none;
    width: 70%;
  }

  .van-cell__value {
    flex: none;
    width: 30%;
  }

  .van-cell-group {
    position: absolute;
    top: 182px;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  &-text {
    padding: 15px;
    font-size: 13px;
    color: #a0a0a0;
  }

  .van-tag {
    margin: 0 3px;
  }
}

.topText {
  width: 100%;
  padding: 10px 10px 20px 10px;
  box-sizing: border-box;
  overflow: hidden;
  text-align: right;

  span {
    font-size: 14px;
    display: inline-block;
    color: #ffffff;
    width: 50%;

    @include ellipsis(1);

    &:nth-child(1) {
      text-align: left;
    }
  }
}

.header-bottom {
  text-align: center;
  margin-top: 20px;
  font-size: 15px;
}

.wrap {
  .header {
    width: 100%;
    height: 140px;
    background-color: #ff4545;
    position: relative;

    &-main {
      width: 100%;

      p {
        width: 100%;
        text-align: center;
        font-size: 18px;

        &:nth-child(1) {
          font-size: 14px;
          margin-bottom: 8px;
        }
      }
    }

    p {
      box-sizing: border-box;
      color: $color-white;
    }
  }
}
</style>
