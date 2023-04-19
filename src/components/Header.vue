<template>
  <div style="font-size: 12px; line-height: 60px;display: flex;">
    <div style="flex:1;font-size: 18px">
      <span :class="collapseBtnClass" style="cursor: pointer;font-size: 17px" @click="collapse"></span>

      <el-breadcrumb separator="/" style="display: inline-block;margin-left: 10px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{currentPathName}}</el-breadcrumb-item>
      </el-breadcrumb>

    </div>
    <!--cursor属性：改变鼠标移入时的样式    -->
    <el-dropdown style="width: 80px;cursor: pointer" >
      <span>{{user.nickname}}</span>
<!--      <i class="el-icon-arrow-down" style="margin-right: 15px;margin-left: 5px"></i>-->
      <el-dropdown-menu slot="dropdown" style="width: 100px;text-align: center">
        <el-dropdown-item style="font-size: 14px;padding: 5px 0">
          <router-link to="/person"> 个人信息</router-link>
        </el-dropdown-item>
        <el-dropdown-item>
          <span to ="/login" style="text-decoration: none" @click="logout">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "V-Header",

  data(){
    return{
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")):{}
    }
  },
  props:{
    collapseBtnClass:String,

    //错误记录：外部的collapse是void型对象，需要用Function类型来进行接收，不应用Boolean
    collapse:Function,
  },

  methods:{
    logout(){
      this.$router.push("/login")
      localStorage.removeItem("user")
      this.$message.success("退出成功")
    }
  },

  computed:{
    currentPathName(){
      return this.$store.state.currentPathName; //需要监听的数据
    }
  },
}
</script>

<style scoped>

</style>