<template>
  <div id="app">
<!--    <home></home>-->
    <router-view></router-view>
  </div>
</template>

<script>

//import Home from "./view/home";

export default {
  name: 'App',
  components: {
    //Home
  }
}
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
