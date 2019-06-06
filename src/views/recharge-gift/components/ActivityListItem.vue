<template>
  <div :class="[$style['content'], tabs[active].value === 'Ended' && $style['ended-bg']]">
    <div :class="[$style['list-item']]"  @click="() => $router.push({path: '/recharge-gift-create', query: { id: data.ID }})">
      <div :class="$style['title-wrap']">
        <div :class="$style['coin-name']">
          充值：{{ data.CoinName }}
        </div>
        <div :class="$style['gift-name']">
          送：{{ data.GiftName }}
        </div>
      </div>

      <div :class="$style['activity-desc']">
        <div :class="$style['desc-left']">
          <div :class="$style['time-wrap']">
            活动有效期：{{ data.StartTime | date('YYYY.MM.DD') }} - {{ data.EndTime | date('YYYY.MM.DD') }}
          </div>
          <div :class="$style['creator-wrap']">
            由【{{ data.Creator }}】于【{{ data.CreateTime | date }}】创建
          </div>
        </div>

        <van-icon name="arrow" color="#999999" />
      </div>
    </div>

    <div :class="$style['option-btn']" @click="$router.push({ path: 'recharge-gift-recivied-record', query: { id: data.ID } })">
      领取记录
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({
        Type: '',
      }),
    },
    tabs: {
      type: Array,
      default: () => ([]),
    },
    active: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss" module>
@import "@/styles/them.scss";

.content {
  background-color: $color-white;
}

.content.ended-bg {
  background: url('@/assets/img/ended.png') no-repeat;
  background-size: 60px 60px;
  background-color: $color-white;
  background-position: 270px 70px;
}

.list-item {
  margin-top: 10px;
  min-height: 100px;

  .title-wrap {
    padding: 15px 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 16px;
    color: $font-color-primary;

    .gift-name {
      font-weight: bold;
    }
  }

  .activity-desc {
    display: flex;
    flex-direction: row;
    padding: 10px 16px;
    justify-content: space-between;
    color: $font-color-secondary;
    font-size: 14px;

    .creator-wrap {
      margin-top: 10px;
    }
  }
}

.option-btn {
  height: 45px;
  font-size: 14px;
  color: $color-primary;
  border-top: 1px solid $border-color;
  line-height: 45px;
  text-align: center;

  &:active {
    background-color: $color-bg-primary;
  }
}
</style>
