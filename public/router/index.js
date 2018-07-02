import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/', redirect: '/list'
        },
        {
            path: '/index',
            redirect: '/list'
        },
        {
            path: '/list',
            component: () => import('../components/list.vue')
        },
        {
            path: '/music',
            component: () => import('../components/music.vue')
        },
        {
            path: '/form',
            component: () => import('../components/form.vue')
        },
        {
            path: '/form/:id',
            component: () => import('../components/form.vue')
        }
    ]
})
