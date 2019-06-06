export default [
  {
    path: '/leaguer',
    name: 'leaguer',
    component: () => import(/* webpackChunkName: "leaguer" */ '@/views/leaguer/Index'),
  },
  {
    path: '/leaguer-level',
    name: 'leaguer-level',
    component: () => import(/* webpackChunkName: "leaguer" */ '@/views/leaguer/LeaguerLevel'),
  },
  {
    path: '/leaguer-level-create',
    name: 'leaguer-level-create',
    component: () => import(/* webpackChunkName: "leaguer" */ '@/views/leaguer/LeaguerLevelCreate'),
  },
  {
    path: '/leaguer-of-tenant',
    name: 'leaguer-of-tenant',
    component: () => import(/* webpackChunkName: "leaguer" */ '@/views/leaguer/LeaguerOfTenant'),
  },
  {
    path: '/search-result-for-leaguer-of-tenant',
    name: 'search-result-for-leaguer-of-tenant',
    component: () => import(/* webpackChunkName: "leaguer" */ '@/views/leaguer/SearchForLeaguerOfTenant'),
  },
  {
    path: '/leaguer-detail',
    name: 'leaguer-detail',
    component: () => import(/* webpackChunkName: "leaguer" */ '@/views/leaguer/LeaguerDetail'),
  },
];
