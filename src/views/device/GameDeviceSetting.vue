<template>
  <ych-page>
    <van-cell-group :class="$style['setting-header']">
      <van-cell title="游戏机厂商" :value="gameProvider" />
    </van-cell-group>

    <van-cell-group :class="$style['setting-list']">
      <van-field
        v-for="(menuItem, index) in menuList"
        :key="'key' + index"
        :placeholder="menuItem.MInValue + ' ~ ' + menuItem.MaxValue + '之间'"
        v-model="menuItem.Value"
        :class="$style['menu-item']">
        <div slot="label" :class="$style['slot-title']" @click="() => showItemDesc(menuItem.ItemDiscribe)">
          <div>{{ menuItem.ItemName }}</div>
          <van-icon name="question" :class="$style['title-icon']"/>
        </div>
      </van-field>
    </van-cell-group>

    <van-button
      type="primary"
      :class="$style['submit-btn']"
      @click="saveSetting">
      保存
    </van-button>
  </ych-page>
</template>

<script>
import Device from '@/api/Device';
import Dialog from '@/components/global/dialog';
import { Toast } from 'vant';

export default {
  data: () => ({
    menuList: [],
    loadResultTime: 0,
    gameProvider: '加载中...',
    oldMenuList: [],
  }),

  created () {
    if (this.$route.query.deviceId) {
      this.asyncGetMenuList();
    } else {
      Toast.fail('无效参数');
    }
  },

  methods: {
    // ItemDiscribe
    showItemDesc (message) {
      console.log(message);
      Dialog.alert({
        title: '',
        message,
      });
    },

    asyncGetMenuList () {
      Toast.loading({
        message: '正在查询...',
        mask: true,
        duration: 0,
      });

      Device.getMenuList({
        DeviceId: this.$route.query.deviceId,
      }).then(res => {
        this.loadResultTime = Date.now();
        this.pollingMenuResult();
      });
    },

    pollingMenuResult () {
      if (Date.now() - this.loadResultTime >= 1000 * 30) {
        // 查询30秒并没有出结果
        Toast.fail('查询失败');
        return;
      } else if (Date.now() - this.loadResultTime >= 1000 * 3) {
      }

      // 轮询查询设置菜单结果
      Device.getMenuListResult({
        DeviceId: this.$route.query.deviceId,
      }).then(res => {
        if (res.ErrorCode !== 0) {
          setTimeout(_ => {
            this.pollingMenuResult();
          }, 500);
        } else {
          Toast.clear();
          this.menuList = res.Result;
          this.oldMenuList = JSON.parse(JSON.stringify(res.Result));
          this.gameProvider = res.GameProvider;
        }
      });
    },

    saveSetting () {
      // 保存设置
      Toast.loading({
        message: '正在保存',
        duration: 0,
        mask: true,
      });

      let isEmpty = false;
      let notNumber = false;
      let passMax = false;
      let lessMin = false;
      let updateItems = this.menuList.map(menuItem => {
        if (!menuItem.Value) {
          isEmpty = true;
        } else if (!/^\d+$/.test(menuItem.Value)) {
          notNumber = true;
        } else if (menuItem.Value > menuItem.MaxValue) {
          passMax = true;
        } else if (menuItem.Value < menuItem.MInValue) {
          lessMin = true;
        }

        return {
          ItemId: menuItem.ItemId,
          Value: menuItem.Value,
        };
      });

      updateItems = updateItems.filter((item, index) => {
        console.log(item.Value);
        console.log(this.oldMenuList[index].Value);
        return item.Value !== this.oldMenuList[index].Value;
      });

      if (isEmpty) {
        Toast('菜单项不能为空');
        return;
      }

      if (notNumber) {
        Toast('菜单项只允许整数，请重新输入');
        return;
      }

      if (passMax || lessMin) {
        Toast('设置项的值大于或者小于预设值');
        return;
      }

      Device.updateMenuList({
        DeviceId: this.$route.query.deviceId,
        Items: updateItems,
      }).then(res => {
        Toast.success('修改成功');
      });
    },
  },
};
</script>

<style lang="scss" module>
@import "@/styles/them.scss";

.setting-header {
  .van-cell {
    background-color: $border-color;

    &::after {
      border-bottom-color: $color-bg-regular;
    }
  }
}

.setting-list {
  margin-top: 15px;
}

.slot-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 250px;
}

.title-icon {
  margin-left: 5px;
  color: $font-color-secondary;
}

.menu-item {
  input {
    text-align: right;
  }
}

.submit-btn {
  position: absolute;
  width: 90%;
  margin-left: 5%;
  bottom: 16px;
  border-radius: $border-radius-small;
}

</style>
