export default [
  {
    path: '/marketing-statistic',
    name: 'marketing-statistic',
    component: () => import(/* webpackChunkName: "marketing-statistic" */ '@/views/marketing-statistic/Index'),
  },
];
