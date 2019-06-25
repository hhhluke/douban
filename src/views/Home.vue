<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <baseInfo />
  </div>
</template>

<script>
// @ is an alias to /src
import baseInfo from '@/components/infoBase.vue'

export default {
  name: 'home',
  components: {
    baseInfo
  }
}
</script>
