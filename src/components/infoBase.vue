<template>
	<div class="hello">
		<input type="text" v-model="id">
		<button @click="getData">查询</button>
		<div>{{ urls }}</div>
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
	</div>
</template>

<script>
import { getBaseData } from "../assets/crawler"
import { mapState } from "vuex"
import infoCard from "./infoCard"
export default {
	name: "HelloWorld",
	components: { infoCard },
	data() {
		return {
			id: null,
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
					count: this.base.movie.want,
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
					count: this.base.book.want,
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
			let res = await getBaseData(this.id)
			this.$store.commit("setBase", res)
		}
	}
}
</script>

