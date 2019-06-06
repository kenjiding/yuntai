export default [
  {
    path: '/activity-ranking',
    name: 'activity-ranking',
    component: () => import(/* webpackChunkName: "activity-ranking" */ '@/views/activity-ranking/Index'),
    meta: { openJsSdk: true },
  },
  {
    path: '/add-activity',
    name: 'add-activity',
    component: () => import(/* webpackChunkName: "activity-ranking" */ '@/views/activity-ranking/AddActivity'),
    props: {isEdit: false},
    // meta: {
    //   needKeepAlive: true,
    // },
  },
  {
    path: '/edit-activity',
    name: 'edit-activity',
    component: () => import(/* webpackChunkName: "activity-ranking" */ '@/views/activity-ranking/AddActivity'),
    props: {isEdit: true},
    // meta: {
    //   needKeepAlive: true,
    // },
  },
  {
    path: '/activity-info',
    name: 'activity-info',
    component: () => import(/* webpackChunkName: "activity-ranking" */ '@/views/activity-ranking/ActivityInfo'),
  },
  {
    path: '/activity-sort',
    name: 'activity-sort',
    component: () => import(/* webpackChunkName: "activity-ranking" */ '@/views/activity-ranking/ActivityItem'),
  },
];
