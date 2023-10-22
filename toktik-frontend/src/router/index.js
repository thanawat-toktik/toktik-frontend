import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from "@/views/AboutView.vue";
import LogInView from '../views/LogInView.vue'
import RegisterView from '../views/RegisterView.vue'
import UploadVideoView from '../views/UploadVideoView.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {title: 'Home - TokTik'}
    },
    {
        path: '/about',
        name: 'about',
        component: AboutView,
        meta: {title: "About - TokTik"}
    },
    {
        path: '/login',
        name: 'Log-In',
        component: LogInView,
        meta: {title: "Login - TokTik"}
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView,
        meta: {title: "Register - TokTik"}
    },
    {
        path: '/upload',
        name: 'Upload Video',
        component: UploadVideoView,
        meta: {title: "Upload Video - TokTik"}
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach(async (to, from, next) => {
    // console.log(to)
    if (to.name === "Log-In" || to.name === "Register") {
        next()
    }

    const token = localStorage.getItem("jwt-token")
    const refresh_token = localStorage.getItem("jwt-token-refresh")
    // if no token (both) and not going to log-in/register --> redirect to log-in
    if (!token && !refresh_token && to.name !== "Log-In" && to.name !== "Register") {
        return router.push("/login").catch(() => {
        })
    }
    next()
})

// eslint-disable-next-line no-unused-vars
router.afterEach((to, _from) => {
    Vue.nextTick(() => {
        document.title = to.meta.title || 'TokTik'
    })
})

export default router
