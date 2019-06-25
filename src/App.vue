<template>
	<div id="app">
		<!-- <img src="./assets/logo.png"> -->
		<div></div>
		<infoBase msg="Welcome to Your Vue.js App"/>
	</div>
</template>

<script>
import infoBase from "./components/infoBase.vue"

export default {
	name: "app",
	components: {
		infoBase
	}
}
</script>

<style>
* {
	padding: 0;
	margin: 0;
}
#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
</style>
