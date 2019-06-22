<template>
	<div class="hello">
		<button @click="getData">查询</button>
		<div>{{urls}}</div>
	</div>
</template>

<script>
const superagent = require("superagent"),
	cheerio = require("cheerio")
export default {
	name: "HelloWorld",
	props: {
		msg: String
	},
	data() {
		return {
			urls: []
		}
	},
	methods: {
		getData() {
			let targetUrl = "https://nba.hupu.com/stats/players/pts"

			superagent
				.get(targetUrl)
				.set("Access-Control-Allow-Origin", "*")
				.withCredentials()
				.end((err, res) => {
					//页面dom在text里
					let $ = cheerio.load(res.text)
					$(".players_table .left a").each((index, element) => {
						this.urls.push($(element).attr("href"))
					})
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
