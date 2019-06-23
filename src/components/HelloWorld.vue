<template>
	<div class="hello">
		<input type="text" v-model="id">
		<button @click="getData">查询</button>
		<div>{{ urls }}</div>
	</div>
</template>

<script>
import { getSawList } from "../assets/crawler"
export default {
	name: "HelloWorld",
	data() {
		return {
			id: null,
			urls: []
		}
	},
	methods: {
		getData() {
			getSawList(this.id).then(res => {
				this.urls = res
			})
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
	margin: 40px 0 0;
}
ul {
	list-style-type: none;
	padding: 0;
}
li {
	display: inline-block;
	margin: 0 10px;
}
a {
	color: #42b983;
}
</style>
