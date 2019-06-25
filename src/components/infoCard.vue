<template>
	<el-card :body-style="{ padding: '0px' }">
		<div class="info-card">
			<div class="left" :style="{ background: color }">
				<i :class="icon"></i>
			</div>
			<div class="right">
				<count-to :end="count">
					<slot name="right">111</slot>
				</count-to>
				<p>{{ title }}</p>
			</div>
		</div>
	</el-card>
</template>

<script>
import countTo from "./countTo"
export default {
	name: "info-count",
	components: { countTo },
	props: {
		color: {
			type: String,
			default: "#2d8cf0"
		},
		title: String,
		icon: String,
		count: Number
	},
	data() {
		return {}
	}
}
</script>

<style lang="less" scoped>
.info-card {
	display: flex;
	flex: 1;
	flex-direction: row;
	height: 108px;
	font-size: 36px;
	position: relative;
	overflow: hidden;
	color: #666;
	background: #fff;
	-webkit-box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
	box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
	border-color: rgba(0, 0, 0, 0.05);
	.left {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 36%;
	}
	.right {
		width: 64%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		p {
			font-size: 16px;
			text-align: center;
		}
	}
}
</style>
