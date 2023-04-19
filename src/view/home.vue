<template>
  <div >
  <el-container style="" >
    <el-aside :width="sideWidth + 'px'" style="background-color: rgb(238, 241, 246);
              height: 100%;
              overflow:hidden;
              box-shadow: 2px 0px 6px rgba(0,21,10,0.1)
" >
        <V_Aside :is-collapse="isCollapse" :logo-text-show="logoTextShow"/>
    </el-aside>
    <el-container style="border-bottom: 1px solid #ccc">
      <el-header>
        <V_Header :collapse-btn-class="collapseBtnClass" :collapse="collapse"/>
      </el-header>
      <el-main>
        <!--表示当前页面的子路由会在router-view中显示        -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  </div>

</template>

<script>
//import request from "@/utils/request";

import V_Aside from "@/components/Aside";
import V_Header from "../components/Header"
export default {
  name: "V_Home",
  components: { V_Aside,V_Header},
  data() {
    return {
      collapseBtnClass:'el-icon-s-fold',
      isCollapse:false,
      sideWidth:200,
      logoTextShow:true,
      user:{},
    };
  },

  created() {
    this.getUser();
  },

  methods:{
    collapse(){//点击收缩按钮触发
      this.isCollapse = !this.isCollapse
      if(this.isCollapse){
        this.sideWidth = 64
        this.collapseBtnClass = 'el-icon-s-unfold'
        this.logoTextShow = false
      }else {//展开
        this.sideWidth = 200
        this.collapseBtnClass = 'el-icon-s-fold'
        this.logoTextShow = true
      }
    },

    //错误记录：前端读不到后端的数据 解决方法：注意url的格式

    getUser(){
      let username = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).username : ""
      if (username){
        //从后台获取User数据
        this.request.get("/user/username/" + username).then(res => {
          //重新赋值后台的最新User数据
          this.user = res.data
        })
      }
    }

  }
}
</script>

<style scoped>
  .el-header {
    background-color: white;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
  .el-main{
    background-color: whitesmoke;

  }
  .el-card__body, .el-main{
    padding: 5px 20px;
  }

</style>