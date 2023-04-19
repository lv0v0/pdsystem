import Vue from "vue";
import VueRouter from 'vue-router'
import store from "@/store";

//import User from "../view/User";

Vue.use(VueRouter)


const router = new VueRouter({
    routes:[
        {
            path: '/login',
            name:'登录',
            component: ()=> import('../view/Login')
        },
        {
            path: '/register',
            name:'注册',
            component: ()=> import('../view/Register')
        },
        //如果path为*，则会出现，当第一次在电脑上运行项目时，会出现404而不是login界面
        {
            path: '/404',
            name: '404',
            component: ()=> import('../view/404')
        }
    ]

})

router.beforeEach((to,from,next)=>{
    localStorage.setItem ("currentPathName",to.name) //设置当前的路由名称，为了再Header组件中去使用
    store.commit("setPath")//触发store的数据更新

    //解决默认404问题
    //未找到路由的情况
    if (!to.matched.length){
        //从浏览器缓存中拿到当前用户所有的菜单，
        const storeMenus = localStorage.getItem("menus")
        if(storeMenus){
            next("/404")
        }else {
            //跳回登陆界面
            next("/login")
        }
    }
    //其他的情况放行
    next()
})

/*//提供一个重置路由的方法
export const resetRouter = () => {
    router.matcher = new VueRouter({
        mode:'history',
        base: process.env.BASE_URL,
        routes
    })
}*/



//注意：刷新页面会导致页面路由重置
//通过加上setRoute()实现路由不充值
export const setRoute = () =>{
    const storeMenus = localStorage.getItem("menus");
    if(storeMenus){

        //拼装动态路由
        const manageRoute = {
            path: '/',
            redirect:"/homepage",
            component: () => import('../view/home'),
            children:[
                {
                    path:'/person',
                    name:'个人信息',
                    component:() => import("../view/Person")
                },
            ]
        }
        const menus = JSON.parse(storeMenus)
        menus.forEach(item => {
            if(item.path){//当且仅当path不为空才去设置路由
                let itemMenu = {
                    path: item.path.replace("/",""),
                    name: item.name,
                    component: () => import('../view/' + item.pagePath)
                }
                manageRoute.children.push(itemMenu)
            }else if(item.children.length){
                item.children.forEach(item => {
                    let itemMenu = {
                        path: item.path.replace("/",""),
                        name: item.name,
                        component: () => import('../view/' + item.pagePath)
                    }
                    manageRoute.children.push(itemMenu)
                })
            }
        })

        //获取当前的路由对象名称数组
        const currentRouteNames = router.getRoutes().map( v => v.name )
        if(!currentRouteNames.includes('home')){
            //动态添加到现在的路由对象中去
            router.addRoute(manageRoute)
        }
    }
}

//解决刷新变为空白页问题。
setRoute()

export default router