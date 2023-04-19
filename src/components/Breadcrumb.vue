<template>
  <div class="bread-crumb">
    <el-breadcrumb separator="/">
      <!-- 预设一个首面包屑 -->
      <el-breadcrumb-item
          :to="{ path: '/' }"
      >
        首页
      </el-breadcrumb-item>
      <!--  循环遍历面包屑列表 -->
      <el-breadcrumb-item
          :to="{path: item.path}"
          v-for="(item, index) in breadList"
          :key="index"
      >
        {{item.meta.title}}
      </el-breadcrumb-item>
    </el-breadcrumb>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "V-Breadcrumb",
  data(){
    return{
      breadList: []
    }
  },
  created() {
    this.getBreadcrumb();
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb() {
      console.log(this.$route.matched)  //可以获取上下文路由 也就是可以获取父亲和孩子路由组成的数组
      if (Object.keys(this.$route.matched[0].meta).length > 0) {
        this.breadList = this.$route.matched
      } else {
        this.breadList = []
      }
    }

  },
}
</script>

<style scoped>

</style>
