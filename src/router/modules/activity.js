export default [
  {
    path: '/activity',
    name: 'activity',
    component: () => import(/* webpackChunkName: "activity" */ '@/views/activity/Index'),
  },
  {
    path: '/activity-create',
    name: 'activity-create',
    component: () => import(/* webpackChunkName: "activity" */ '@/views/activity/ActivityCreate'),
  },
];
