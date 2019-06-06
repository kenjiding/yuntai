export default [
  {
    path: '/currency-rush',
    name: 'currency-rush',
    component: () => import(/* webpackChunkName: "currency-rush" */ '@/views/currency-rush/Index'),
    meta: {
      title: '游戏币抢购',
    },
  },
  {
    path: '/currency-rush-create',
    name: 'currency-rush-create',
    component: () => import(/* webpackChunkName: "currency-rush" */ '@/views/currency-rush/Create'),
    meta: {
      title: '新建活动',
    },
  },
  {
    path: '/currency-rush-part-list',
    name: 'currency-rush-part-list',
    component: () => import(/* webpackChunkName: "currency-rush" */ '@/views/currency-rush/PartList'),
    meta: {
      title: '参与记录',
    },
  },
];
