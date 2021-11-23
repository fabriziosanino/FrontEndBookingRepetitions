import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {BootstrapVue} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/main.css'
import './assets/css/normalize.css'
import $ from 'jquery'
import store from './store'

Vue.config.productionTip = false
Vue.use(BootstrapVue)

new Vue({
  router,
  render: h => h(App),

  data: {
    sessionToken: '',
    account: '',
    link: 'localhost:8080/ProvaAppAndroid_war_exploded/servlet-check-session'
  },

  mounted() { this.getSession },
  store,

  methods: {
    getSession: function() { //leggere il token dal local storage
      let self = this;
      $.post(this.link, {sessionToken: this.sessionToken}, function(data) {
          if(data.done) {
            alert(data.account)
            self.account = data.account
            self.sessionToken = data.token
          } else {
            alert(data.error)
          }
      });
    }
  }
}).$mount('#app')
