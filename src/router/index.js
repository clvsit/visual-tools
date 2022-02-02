import { createRouter, createWebHistory } from 'vue-router'
import IndexView from "../views/Index.vue"
import VideoCompareView from "../views/view_video/VideoCompare.vue"
import PictureMaskView from "../views/view_picture/PictureMask.vue"

const routes = [
  {
    path: '/',
    name: 'Home',
    component: IndexView
  },
  {
    path: '/video/compare',
    name: 'VideoCompare',
    component: VideoCompareView
  },
  {
    path: '/picture/mask',
    name: 'PictureMask',
    component: PictureMaskView
  },
  // {
    // path: '/about',
    // name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
