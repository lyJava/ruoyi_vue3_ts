<template>
	<div>
		<el-switch
			v-model="datas"
			:active-color="activeColor"
			:inactive-color="inactiveColor"
			active-value="0"
			inactive-value="1"
			v-bind="$attrs"
			@change="handleChange($event)"
		></el-switch>
	</div>
</template>

<script>
// v-bind="$attrs"的说明
// https://www.cnblogs.com/ygunoil/p/13369193.html
export default {
	name: "StatusSwitch",
	props: {
		statusData: {
			type: String,
			default: ""
		},
		activeColor: {
			type: String,
			default: "#13CE66"
		},
		inactiveColor: {
			type: String,
			default: "#BEBEBE"
		}
	},
	data() {
		return {
			datas: this.statusData
		};
	},
	methods: {
        // 将当前选中的参数传递
		handleChange(val) {
			this.$emit("handleChange", val);
		}
	}
};
</script>
