import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const routes = [
  {
    path: '/',
    redirect: 'login',
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: 'Vulnerable Application - Login Page' },
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/example',
    name: 'example',
    meta: { title: 'Vulnerable Application - Example Page' },
    component: () => import('../views/ExampleView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (_to, _from, next) => {
  NProgress.start();
  if (_to.meta.title) {
    document.title = _to.meta.title;
  } else {
    document.title = 'Group 7 - Vulnerable Application';
  }
  await next();
  NProgress.done();
});

export default router
