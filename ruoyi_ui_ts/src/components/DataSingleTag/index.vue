<template>
	<div>
		<el-tag
			v-model="singleData"
			:key="singleData"
			:type="singleData === '0' ? 'success' : 'info'"
		>
			{{ selectDictLabel(statusOptions, singleData) }}
		</el-tag>
	</div>
</template>
<script>
export default {
	name: "DataSingleTag",
	props: {
		singleData: {
			type: String,
			default: ""
		},
		statusOptions: {
			type: Array,
			default: () => {}
		}
	},
	data() {
		return {
			datas: this.singleData
		};
	}
};
</script>
<style></style>
