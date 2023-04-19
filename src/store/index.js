//引入Vue核心库
import Vue from 'vue'
//引入Vuex
import Vuex from 'vuex'

//错误记录:在使用面包屑时,不需要在vuex中引入路由
//import router from "@/router";
//应用Vuex插件
Vue.use(Vuex)
//Vue.use(router)

//准备actions对象——响应组件中用户的动作
//const actions = {}
//准备mutations对象——修改state中的数据
const mutations = {
    setPath(state){
        state.currentPathName = localStorage.getItem("currentPathName")
    }
}
//准备state对象——保存具体的数据
const state = {currentPathName:''}

//创建并暴露store
export default new Vuex.Store({
    //actions,
    mutations,
    state,

})