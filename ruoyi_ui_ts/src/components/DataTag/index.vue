<template>
	<div>
		<el-tag
			class="data_tag "
			v-for="(item, index) in datas"
			:type="item === '超级管理员' ? 'danger' : undefined"
			:key="index"
			:index="index"
		>
			{{ item }}
		</el-tag>
	</div>
</template>
<script>
export default {
	name: "DataTag",
	props: {
		rolesArray: {
			type: Array,
			default: () => [],
		}
	},
	data() {
		return {
			datas: this.rolesArray
		};
	}
};
</script>
<style scoped>
.cell .el-tag {
	margin-left: 5px !important;
	margin-right: 5px !important;
}
.data_tag {
	float: left !important;
	margin: 5px 0 5px 5px !important;
}
</style>
