<template>
	<div class="hello">
		<el-form :inline="true" :model="formInline" class="demo-form-inline">
			<el-form-item label="豆瓣ID">
				<el-input v-model="formInline.id" placeholder="ID"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getData">查询</el-button>
				<el-popover
					placement="top-start"
					title="简单备份"
					width="200"
					trigger="hover"
					content="只能备份书影音相册"
				>
					<el-button slot="reference" type="primary" @click="getBackup">简单备份</el-button>
				</el-popover>
			</el-form-item>
		</el-form>
		<el-row :gutter="20">
			<el-col
				:xs="12"
				:md="8"
				:lg="4"
				v-for="(infor, i) in inforCardData"
				:key="`infor-${i}`"
				style="height: 120px;padding-bottom: 10px;"
			>
				<info-card
					:color="infor.color"
					:icon="infor.icon"
					:title="infor.title"
					:count="infor.count"
				></info-card>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-button type="primary" @click="getMovie">查询电影</el-button>
			<el-button type="primary" @click="demo">查询关注</el-button>
			<el-button type="primary" @click="log">登录</el-button>
			<el-button type="primary" @click="music">音乐</el-button>
			<el-button type="primary" @click="img">图片</el-button>
			<el-button type="primary" @click="game">游戏</el-button>
		</el-row>
	</div>
</template>

<script>
import { getBaseData, movieToExcel, getStar, log, backup } from "../assets/crawler"
import { getImgs } from "../assets/image"
import { getMusics } from "../assets/music"
import { getMovies } from "../assets/movie"
import { getGames } from "../assets/game"
import { mapState } from "vuex"
import infoCard from "./infoCard"
const { BrowserWindow } = require("electron")

export default {
	name: "HelloWorld",
	components: { infoCard },
	data() {
		return {
			formInline: {
				id: "Skiboo"
			},
			urls: []
		}
	},
	computed: {
		...mapState({
			base: state => state.base
		}),
		inforCardData() {
			return [
				{
					title: "看过",
					icon: "el-icon-video-play",
					count: this.base.movie.collect,
					color: "#2d8cf0"
				},
				{
					title: "想看",
					icon: "el-icon-monitor",
					count: this.base.movie.wish,
					color: "#19be6b"
				},
				{
					title: "读过",
					icon: "el-icon-collection",
					count: this.base.book.collect,
					color: "#2d8cf0"
				},
				{
					title: "想读",
					icon: "el-icon-reading",
					count: this.base.book.wish,
					color: "#ff9900"
				},
				{
					title: "玩过",
					icon: "el-icon-reading",
					count: this.base.game.collect,
					color: "#19be6b"
				},
				{
					title: "想玩",
					icon: "el-icon-reading",
					count: this.base.game.wish,
					color: "#19be6b"
				},
				{
					title: "听过",
					icon: "el-icon-reading",
					count: this.base.music.collect,
					color: "#19be6b"
				},
				{
					title: "想听",
					icon: "el-icon-reading",
					count: this.base.music.wish,
					color: "#19be6b"
				},
				{
					title: "广播(页)",
					icon: "el-icon-chat-round",
					count: 142,
					color: "#ff9900"
				},
				{
					title: "关注",
					icon: "el-icon-user",
					count: this.base.friend.star,
					color: "#ed3f14"
				},
				{
					title: "被关注",
					icon: "el-icon-star-off",
					count: this.base.friend.follower,
					color: "#E46CBB"
				},
				{
					title: "相册",
					icon: "el-icon-picture-outline",
					count: this.base.photo,
					color: "#9A66E4"
				}
			]
		}
	},
	methods: {
		getBackup() {
			backup(this.formInline.id)
		},
		img() {
			getImgs(this.formInline.id)
		},
		async game() {
			let res = await getGames(this.formInline.id)
			console.log("game", res)
		},
		log() {
			log()
		},
		async music() {
			let a = await getMusics(this.formInline.id)
			console.log("music", a)
		},
		async getData() {
			let res = await getBaseData(this.formInline.id)
			this.$store.commit("setBase", res)
		},
		async getMovie() {
			let res = await getMovies(this.formInline.id)
			console.log(res)
			// const loading = this.$loading({
			// 	lock: true,
			// 	text: "Loading",
			// 	spinner: "el-icon-loading",
			// 	background: "rgba(0, 0, 0, 0.7)"
			// })
			// let res = await movieToExcel(this.formInline.id)
			// if (res) {
			// 	this.$message.success("导出成功!")
			// } else {
			// 	this.$message.error("失败，请检查文件是否处于打开状态,若是，请关闭该文件")
			// }
			// loading.close()
		},
		async demo() {
			let res = await getStar()
			console.log(res)
		}
	}
}
</script>

