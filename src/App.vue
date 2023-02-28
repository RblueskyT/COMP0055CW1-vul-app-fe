<template>
  <router-view></router-view>
</template>

<script>
export default {
  mounted() {
    this.$store.commit('initialiseStore')
  }
}
</script>

<style>
#nprogress .bar {
  background: #12f425 !important;
}
</style>
