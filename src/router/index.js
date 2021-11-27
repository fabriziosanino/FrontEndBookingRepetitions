import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/manage',
    name: 'Manage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Manage.vue')
  }, 
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/registration',
    name: 'Registration',
    component: () => import('../views/Registration.vue')
  },
  {
    path: '/bookedRepetitions',
    name: 'BookedRepetitions',
    component: () => import('../views/BookedRepetitions.vue')
  },
  {
    path: '*',
    component: () => import('../views/pageNotFound.vue')
  }
]

const router = new VueRouter({
  mode: 'history', // changes path from:  /#/hello   to:   /hello
  routes
})

export default router

//TODO: beforeRouterEnter check session!
//sistemare pageNotFound