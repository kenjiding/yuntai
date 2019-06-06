export default [
  {
    path: '/recharge-gift',
    name: 'recharge-gift',
    component: () => import(/* webpackChunkName: "login" */ '@/views/recharge-gift/Index'),
    meta: {
      title: '充值送商品',
      openJsSdk: true,
    },
  },

  {
    path: '/recharge-gift-create',
    name: 'recharge-gift-create',
    component: () => import(/* webpackChunkName: "login" */ '@/views/recharge-gift/Create'),
    meta: {
      title: '新建方案',
      needKeepAlive: true,
    },
  },

  {
    path: '/recharge-gift-coin-list',
    name: 'recharge-gift-coin-list',
    component: () => import(/* webpackChunkName: "login" */ '@/views/recharge-gift/CoinList'),
    meta: {
      title: '游戏币套餐',
    },
  },

  {
    path: '/recharge-gift-gift-create',
    name: 'recharge-gift-gift-create',
    component: () => import(/* webpackChunkName: "login" */ '@/views/recharge-gift/GiftCreate'),
    meta: {
      title: '添加奖品',
    },
  },

  {
    path: '/recharge-gift-goods-list',
    name: 'recharge-gift-goods-list',
    component: () => import(/* webpackChunkName: "login" */ '@/views/recharge-gift/GoodsList'),
    meta: {
      title: '商品列表',
      openJsSdk: true,
    },
  },

  {
    path: '/recharge-gift-recivied-record',
    name: 'recharge-gift-recivied-record',
    component: () => import(/* webpackChunkName: "login" */ '@/views/recharge-gift/ReciviedRecord'),
    meta: {
      title: '领取记录',
    },
  },

  {
    path: '/recharge-gift-write-off',
    name: 'recharge-gift-write-off',
    component: () => import(/* webpackChunkName: "login" */ '@/views/recharge-gift/WriteOff'),
    meta: {
      title: '奖品核销',
    },
  },
];
