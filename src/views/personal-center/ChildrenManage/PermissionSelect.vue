<template>
  <ych-page>
    <page-header
      slot="header"
      :title="title"
      left-arrow
      @click-left="$router.go(-1)">
      <!-- <van-icon
        name="save"
        slot="right"/> -->
    </page-header>
    <div :class="$style['person-info-wrap']">
      <van-row>
        <van-col>
          <van-icon name="gantanhao1" />
        </van-col>
        <van-col>此功能暂不提供编辑</van-col>
      </van-row>
      <van-cell-group>
        <template v-for="(item,index) in permissionFormData">
          <div :key="index">
            <p
              :class="$style['sub-title']"
              v-if="index === 0 || index === 12 || index === 19">
              {{
                {
                  0: '后台权限',
                  12: '营销工具',
                  19: '收银员权限',
                }[index]
              }}
            </p>
            <van-cell
              :title="item.Name">
              <van-switch
                v-model="item.IsOpen"
                disabled
                size="26px"
                slot="right-icon" />
            </van-cell>
          </div>
        </template>
      </van-cell-group>
    </div>
  </ych-page>
</template>

<script>
import PageHeader from '@/components/PageHeader';
//import PersonApi from '@/api/Person';

export default {
  name: 'PermissionSelect',
  data () {
    return {
      title: '功能权限',
      permissionFormData: [
        {
          Name: '营收统计',
          Code: '0',
          IsOpen: false,
        },
        {
          Name: '订单管理',
          Code: '1',
          IsOpen: false,
        },
        {
          Name: '客诉处理',
          Code: '2',
          IsOpen: false,
        },
        // {
        //   Name: '设备注册',
        //   Code: '3',
        //   IsOpen: false,
        // },
        {
          Name: '设备管理',
          Code: '4',
          IsOpen: false,
        },
        {
          Name: '商品管理-新增/编辑/删除',
          Code: '501',
          IsOpen: false,
        },
        {
          Name: '商品管理-上下架',
          Code: '502',
          IsOpen: false,
        },
        {
          Name: '礼品管理',
          Code: '6',
          IsOpen: false,
        },
        {
          Name: '游戏币套餐-新增/编辑/删除',
          Code: '701',
          IsOpen: false,
        },
        {
          Name: '游戏币套餐-上下架',
          Code: '702',
          IsOpen: false,
        },
        {
          Name: '会员管理',
          Code: '8',
          IsOpen: false,
        },
        {
          Name: '积分商城',
          Code: '10',
          IsOpen: false,
        },
        {
          Name: '礼品采购',
          Code: '11',
          IsOpen: false,
        },
        {
          Name: '游戏币红包',
          Code: '901',
          IsOpen: false,
        },
        {
          Name: '一物一码',
          Code: '902',
          IsOpen: false,
        },
        {
          Name: '活动排行',
          Code: '903',
          IsOpen: false,
        },
        {
          Name: '充值送商品',
          Code: '904',
          IsOpen: false,
        },
        {
          Name: '礼品图鉴',
          Code: '905',
          IsOpen: false,
        },
        {
          Name: '会员概率',
          Code: '906',
          IsOpen: false,
        },
        {
          Name: '游戏币抢购',
          Code: '907',
          IsOpen: false,
        },
        {
          Name: '商品售卖',
          Code: '1001',
          IsOpen: false,
        },
        {
          Name: '商品兑换',
          Code: '1002',
          IsOpen: false,
        },
        {
          Name: '订单管理',
          Code: '1003',
          IsOpen: false,
        },
        {
          Name: '会员查询',
          Code: '1004',
          IsOpen: false,
        },
        {
          Name: '礼品回收',
          Code: '1005',
          IsOpen: false,
        },
        {
          Name: '客诉处理',
          Code: '1006',
          IsOpen: false,
        },
      ],
    };
  },

  components: {
    PageHeader,
  },

  methods: {
    getData () {
      // PersonApi.getPermissionData({role: this.$route.query.roleName}).then((res) => {
      //   this.permissionFormData = res.Data;
      // });
    },
    setData () {
      switch (this.$route.query.roleName) {
      case 'admin':
        this.title = '超级管理员权限';
        this.permissionFormData.forEach(permission => {
          permission.IsOpen = true;
        });
        break;
      case 'manager':
        this.title = '店长权限';
        this.permissionFormData.forEach(permission => {
          if (Number(permission.Code) === 501 ||
          Number(permission.Code) === 701 ||
          Number(permission.Code) === 10 ||
          Number(permission.Code) === 11) {
            permission.IsOpen = false;
          } else {
            permission.IsOpen = true;
          }
        });
        break;
      case 'partner':
        this.title = '合伙人权限';
        this.permissionFormData.forEach(permission => {
          if (Number(permission.Code) === 0) {
            permission.IsOpen = true;
          }
        });
        break;
      case 'cashier':
        this.title = '收银员权限';
        this.permissionFormData.forEach(permission => {
          if (Number(permission.Code) === 2 || Number(permission.Code) === 6 || Number(permission.Code) > 1000) {
            permission.IsOpen = true;
          }
        });
        break;
      default:
        break;
      }
    },
  },

  created: function () {
    this.setData();
  },

  computed: {
  },
};

</script>
<style lang='scss' module>
@import "@/styles/them.scss";

.person-info-wrap {
  position: absolute;
  top: 46px;
  bottom: 0;
  left: 0;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  background-color: $color-bg-secondary;
  -webkit-overflow-scrolling: touch;
  overflow: auto;

  .van-row {
    padding-bottom: 10px;

    .van-col {
      font-size: $font-size-mini;
      color: $font-color-placeholder;

      &:first-of-type {
        margin-right: 5px;
        color: $color-warning;
      }
    }
  }

  [class*=van-hairline]::after {
    content: none;
  }

  .van-cell-group {
    background-color: $color-bg-secondary;

    .sub-title {
      margin: 10px 0;
      color: $font-color-secondary;
    }

    > div:nth-child(3) {
      margin-bottom: 10px;
    }

    > div:nth-child(10) {
      margin-bottom: 10px;
    }

    .van-cell {
      color: $font-color-regular;
      border-bottom: 1px solid $color-bg-secondary;

      .van-switch--on {
        background-color: $color-primary;
      }

      .van-cell__title {
        line-height: 32px;
        font-size: $font-size-primary;
        color: $font-color-regular;
      }
    }
  }
}
</style>
