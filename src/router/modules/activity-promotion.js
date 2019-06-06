export default [
  {
    path: '/activity-promotion',
    name: 'activity-promotion',
    component: () => import(/* webpackChunkName: "activity" */ '@/views/activity-promotion/Index'),
  },
  {
    path: '/activity-game-currency',
    name: 'activity-game-currency',
    component: () => import(/* webpackChunkName: "activity" */ '@/views/activity-promotion/GameCurrency'),
    meta: {
      openJsSdk: true,
      title: '游戏币套餐',
    },
  },
  {
    path: '/currence-item-info',
    name: 'currence-item-info',
    component: () => import(/* webpackChunkName: "activity" */ '@/views/activity-promotion/CurrenceItemInfo'),
  },
  {
    path: '/add-currence',
    name: 'add-currence',
    component: () => import(/* webpackChunkName: "activity" */ '@/views/activity-promotion/Add'),
  },
  {
    path: '/add-currence-test',
    name: 'add-currence-test',
    component: () => import(/* webpackChunkName: "activity" */ '@/views/activity-promotion/test'),
  },
];
