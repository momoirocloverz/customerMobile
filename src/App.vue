<template>
  <div id="app">
      <meta name="format-detection" content="telephone=yes" />
      <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
    import { mapGetters } from 'vuex';
  export default {
    data() {
      return {
      }
    },
      computed: {
          ...mapGetters([''])
      },
      components:{},
      methods:{
      },  
  }
</script>
<style lang="scss">    
</style>