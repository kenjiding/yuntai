<template>
  <ych-page>
    <div :class="$style['search-container']">
      <div :class="$style['search-bar']">
        <van-icon name="search" :class="$style.icon"/>
        <input :class="$style.input" placeholder="请输入搜索关键词" v-model="searchKey"/>
        <van-icon name="close" :class="$style.icon" v-if="searchKey" @click="searchKey = ''"/>
      </div>
      <div :class="$style.action" @click="onSearch">搜索</div>
    </div>

    <div :class="$style.content">
      <div :class="$style['search-tips']" v-if="showSearchTips">
        可输入手机号、姓名、微信昵称、快递号、中奖订单号进行订单搜索
      </div>

      <div v-else>
        <van-list
          v-if="searchList.length > 0"
          v-model="isLoading"
          :finished="isFinished"
          @load="search"
          :offset="50">
          <div
            v-for="data in searchList"
            :key="data.ID"
            :class="$style['list-item']">
            <div :class="$style['list-item__item']" v-if="data.Type === 'ItemMail'">
              <div :class="$style['list-item__item-title']">收货人：</div>
              <div :class="$style['list-item__item-value']">{{ data.Consignee }}</div>
              <div :class="$style['list-item__item-desc']">
                {{ localWinningOrderState[data.OrderState] }}
              </div>
            </div>
            <div :class="$style['list-item__item']" v-if="data.Type === 'ItemMail'">
              <div :class="$style['list-item__item-title']">手机号：</div>
              <div :class="$style['list-item__item-value']">{{ data.Telephone }}</div>
            </div>
            <div :class="$style['list-item__item']" v-if="data.Type === 'ItemMail'">
              <div :class="$style['list-item__item-title']">收货地址：</div>
              <div :class="$style['list-item__item-value']">{{ data.Address }}</div>
            </div>
            <div :class="$style['list-item__item']">
              <div :class="$style['list-item__item-title']">中奖时间：</div>
              <div :class="$style['list-item__item-value']">{{ data.Time | date }}</div>
              <div :class="$style['list-item__item-desc']" v-if="data.Type !== 'ItemMail'">
                <div v-if="data.Type === 'ItemInvite'">
                  {{ localWriteOffState[data.WriteOffState] }}
                </div>
                <div v-else>
                  {{ localReState[data.ReState] }}
                </div>
              </div>
            </div>
            <div :class="$style['list-item__item']"  v-if="data.Type === 'ItemMail'">
              <div :class="$style['list-item__item-title']">中奖奖品：</div>
              <div :class="$style['list-item__item-value']">{{ data.GiftName }}</div>
            </div>
            <div :class="$style['list-item__item']" v-if="data.Type.startsWith('Item')">
              <div :class="$style['list-item__item-title']">兑奖方式：</div>
              <div :class="$style['list-item__item-value']">{{ localActivityType[data.Type] }}</div>
            </div>
            <div :class="$style['list-item__item']" v-if="data.Type === 'ItemInvite'">
              <div :class="$style['list-item__item-title']">兑奖地址：</div>
              <div :class="$style['list-item__item-value']">{{ data.TicketAddress }}</div>
            </div>
            <div :class="$style['list-item__item']" v-if="data.Type === 'CashRandom' || data.Type === 'CashFixed'">
              <div :class="$style['list-item__item-title']">红包金额：</div>
              <div :class="$style['list-item__item-value']">{{ data.GiftName }}</div>
            </div>
            <div :class="$style['list-item__item']">
              <div :class="$style['list-item__item-title']">活动名称：</div>
              <div :class="$style['list-item__item-value']">{{ data.ActivityName }}</div>
            </div>
            <div :class="$style['list-item__item']">
              <div :class="$style['list-item__item-title']">微信昵称：</div>
              <div :class="$style['list-item__item-value']">{{ data.WechatName }}</div>
            </div>
            <div :class="$style['list-item__item']" v-if="data.CourierName">
              <div :class="$style['list-item__item-title']">{{ data.CourierName }}：</div>
              <div :class="$style['list-item__item-value']">{{ data.CourierNumber }}</div>
            </div>

            <van-button
              v-if="data.Type === 'ItemMail' && data.OrderState === 'Waiting'"
              plain
              type="warning"
              :class="$style['send-button']"
              @click="$router.push({ path: '/goody-bag-delivery', query: { data } })">
              发货
            </van-button>
          </div>
        </van-list>

        <div v-else :class="$style['empty-page']">
          <img src="@/assets/img/search-no-result.png" :class="$style['icon']"/>
          <div :class="$style['text']">未搜索到结果</div>
        </div>
      </div>
    </div>
  </ych-page>
</template>

<script>
import GoodyBag from '@/api/GoodyBag';
import { Search, Toast, List } from 'vant';
import { EnumWinningOrderState, EnumReState, EnumWriteOffState, EnumActivityType } from './config/enum';

export default {
  components: {
    [Search.name]: Search,
    [List.name]: List,
  },

  data: () => ({
    searchKey: '',
    showSearchTips: true,
    searchList: [],
    pageIndex: 1,
    isLoading: false,
    isFinished: false,
    localWinningOrderState: EnumWinningOrderState,
    localReState: EnumReState,
    localWriteOffState: EnumWriteOffState,
    localActivityType: EnumActivityType,
  }),

  methods: {
    onSearch () {
      console.log('执行搜索');
      if (this.searchKey) {
        this.showSearchTips = false;
        this.isLoading = true;
        this.pageIndex = 1;
        this.searchList = [];
        this.search();
      } else {
        Toast('请输入搜索关键词');
      }
    },

    search () {
      GoodyBag.orderSearch({
        SearchKey: this.searchKey,
        PageIndex: this.pageIndex,
        PageSize: 20,
      }).then(res => {
        console.log(res);
        if (res.Data.length > 0) {
          this.searchList = this.searchList.concat(res.Data);
          this.pageIndex += 1;
          this.isLoading = false;
        } else {
          this.isFinished = true;
          this.isLoading = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" module>
  @import "@/styles/them.scss";

  .search-container {
    position: fixed;
    top: 0;
    box-sizing: border-box;
    width: 100%;
    z-index: 10;
    display: flex;
    height: 60px;
    border-bottom: 1px solid $border-color-secondary;
    background-color: $color-bg-primary;
    justify-content: center;
    align-items: center;
    padding: 0 16px;

    .search-bar {
      flex: 1;
      background-color: $color-white;
      height: 32px;
      border-radius: 16px; // stylelint-disable
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 15px;

      .input {
        flex: 1;
        margin-left: 10px;
        margin-right: 10px;
        color: $font-color-primary;
        outline: none;
        border: none;
        height: 32px;
        padding: 10px 16px;
        box-sizing: border-box;

        &::-webkit-input-placeholder {
          color: $font-color-secondary;
        }
      }

      .icon {
        color: $font-color-secondary;
        margin-top: -3px;
      }
    }

    .action {
      width: 40px;
      text-align: right;
      color: $color-primary;

      &:active {
        color: $font-color-secondary;
      }
    }
  }

  .content {
    height: 1000px;
    position: relative;
    padding-top: 60px;

    .search-tips {
      color: $font-color-secondary;
      padding: 30px;
      text-align: center;
      line-height: 25px;
      font-size: 14px;
    }
  }

  .list-item {
    position: relative;
    width: 343px;
    background-color: $color-white;
    margin-left: 16px;
    margin-top: 10px;
    border-radius: $border-radius-small;
    padding: 15px;
    box-sizing: border-box;

    &__item {
      display: flex;
      font-size: 14px;
      margin-bottom: 10px;

      &-title {
        color: $font-color-secondary;
      }

      &-value {
        color: $font-color-primary;
        flex: 1;
      }
    }

    .send-button {
      position: absolute;
      right: 16px;
      bottom: 20px;
      width: 58px;
      height: 30px;
      line-height: 30px;
      padding: 0;
    }
  }

  .empty-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 150px;

    .icon {
      width: 200px;
      height: 180px;
    }

    .text {
      font-size: 14px;
      color: $font-color-secondary;
      text-align: center;
      margin-top: 16px;
      line-height: 20px;
    }
  }
</style>
