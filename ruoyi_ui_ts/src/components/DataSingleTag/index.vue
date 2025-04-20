<template>
	<div>
		<el-tag
			:value="singleData"
			:key="singleData"
			:type="singleData === '0' ? 'success' : 'info'"
		>
			{{ selectDictLabel(statusOptions, singleData) }}
		</el-tag>
	</div>
</template>
<script lang="ts" setup>
defineProps<{
	singleData: string;
	statusOptions: Array<{
		value: string | number;
		label: string;
	}>;
}>();
</script>
<style></style>
