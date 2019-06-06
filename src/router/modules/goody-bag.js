export default [
  {
    path: '/goody-bag',
    name: 'goody-bag',
    component: () => import(/* webpackChunkName: "goody-bag" */ '@/views/goody-bag/Index'),
    meta: {
      openJsSdk: true,
      title: '一物一码',
    },
  },
  {
    path: '/goody-bag-activity-create',
    name: 'goody-bag-activity-create',
    component: () => import(/* webpackChunkName: "goody-bag" */ '@/views/goody-bag/Create'),
    meta: { openJsSdk: true },
  },
  {
    path: '/goody-bag-winning-list',
    name: 'goody-bag-winning-list',
    component: () => import(/* webpackChunkName: "goody-bag" */ '@/views/goody-bag/WinningList'),
  },
  {
    path: '/goody-bag-search',
    name: 'goody-bag-search',
    component: () => import(/* webpackChunkName: "goody-bag" */ '@/views/goody-bag/Search'),
  },
  {
    path: '/goody-bag-delivery',
    name: 'goody-bag-delivery',
    component: () => import(/* webpackChunkName: "goody-bag" */ '@/views/goody-bag/Delivery'),
  },
  {
    path: '/goody-bag-write-off',
    name: 'goody-bag-write-off',
    component: () => import(/* webpackChunkName: "goody-bag" */ '@/views/goody-bag/WriteOff'),
  },
  {
    path: '/goody-bag-intro',
    name: 'goody-bag-intro',
    component: () => import(/* webpackChunkName: "goody-bag" */ '@/views/goody-bag/Intro'),
  },
  {
    path: '/goody-consumption-query',
    name: 'goody-consumption-query',
    component: () => import(/* webpackChunkName: "goody-bag" */ '@/views/goody-bag/ConsumptionQuery'),
    meta: { openJsSdk: true },
  },
  {
    path: '/goody-bag-currency-detail',
    name: '/goody-bag-currency-detail',
    component: () => import(/* webpackChunkName: "goody-bag" */ '@/views/goody-bag/CurrencyDetail'),
    meta: { openJsSdk: true },
  },
];
