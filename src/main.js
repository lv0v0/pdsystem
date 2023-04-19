import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/global.css'
import request from "@/utils/request";
import router from "./router/index";
import VueRouter from "vue-router";
import store from "@/store";

Vue.use(VueRouter)

Vue.config.productionTip = false

Vue.use(ElementUI,{size:"mini"})

Vue.prototype.request = request

new Vue({
  render: h => h(App),
  router:router,
  store,
}).$mount('#app')
