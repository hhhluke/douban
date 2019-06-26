<template>
	<div class="hello">
		<el-form :inline="true" :model="formInline" class="demo-form-inline">
			<el-form-item label="豆瓣ID">
				<el-input v-model="formInline.id" placeholder="ID"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getData">查询</el-button>
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
		</el-row>
	</div>
</template>

<script>
import { getBaseData, movieToExcel } from "../assets/crawler"
import { mapState } from "vuex"
import infoCard from "./infoCard"
export default {
	name: "HelloWorld",
	components: { infoCard },
	data() {
		return {
			formInline: {
				id: 80780400
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
					count: this.base.movie.saw,
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
					count: this.base.book.read,
					color: "#2d8cf0"
				},
				{
					title: "想读",
					icon: "el-icon-reading",
					count: this.base.book.wish,
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
		async getData() {
			let res = await getBaseData(this.formInline.id)
			this.$store.commit("setBase", res)
		},
		async getMovie() {
			await movieToExcel(this.formInline.id)
		}
	}
}
</script>

