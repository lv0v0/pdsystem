<template>
  <!--加上router后，进行点击主页等操作时，会跳转到index中标记的值得对应路径    -->
  <el-menu :default-openeds="opens" style="height:100vh; overflow-x: hidden"
           :collapse-transition="false"
           :collapse="isCollapse"
           background-color="#545c64"
           text-color="#fff"
           active-text-color="#ffd04b"
           router
  >
    <!--顶部logo        -->
    <div style="height: 60px;line-height: 60px;text-align: center">
      <img src="../assets/logo.png" style="width: 25px;position: relative;top: 7px;">
      <b style="color:#ffd04b" v-show="logoTextShow" >管理系统</b>
    </div>
    <div v-for="item in menus" :key="item.id">
      <div v-if="item.path">
        <el-menu-item :index="item.path">
          <i :class="item.icon"></i>
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
      </div>
      <div v-else>
        <el-submenu :index="item.id + '' ">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title" v-show="logoTextShow">{{ item.name }}</span>
          </template>
          <div v-for="subItem in item.children" :key="subItem.id">
            <el-menu-item :index="subItem.path">
                <i :class="subItem.icon"></i>
                <span slot="title">{{ subItem.name }}</span>
            </el-menu-item>
          </div>
        </el-submenu>
      </div>
    </div>
  </el-menu>
</template>
<script>
export default {
  name: "V_Aside",
  props:{
    isCollapse:Boolean,
    logoTextShow:Boolean,
  },
  data(){
    return{
      menus:localStorage.getItem("menus") ? JSON.parse(localStorage.getItem("menus")) : [],
      opens:localStorage.getItem("menus") ? JSON.parse(localStorage.getItem("menus")).map( v => v.id + '') : []
    }
  },

}
</script>

<style scoped>

</style>