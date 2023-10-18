import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LogInView from '../views/LogInView.vue'
import RegisterView from '../views/RegisterView.vue'
import UploadVideoView from '../views/UploadVideoView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'Log-In',
    component: LogInView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/upload',
    name: 'Upload Video',
    component: UploadVideoView
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach( async (to, from, next) => {
  console.log(to)
  if (to.name == "Log-In" || to.name == "home" || to.name == "Register" ) {
    next()
  }
  
  const token = localStorage.getItem("jwt-token")
  const refresh_token = localStorage.getItem("jwt-token-refresh")
  // if no token (both) --> redirect to login
  if (!token && !refresh_token) {
    return { name: "Log-In" }
  }
  next()

})

export default router
