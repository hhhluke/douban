<template>
	<div id="app">
		<baseInfo msg="Welcome to Your Vue.js App"/>
	</div>
</template>

<script>
import baseInfo from "./components/base.vue"

export default {
	name: "app",
	components: {
		baseInfo
	}
}
</script>

<style>
</style>
