<template>
	<div :class="{ hidden: hidden }" class="pagination-container">
		<el-pagination
			:background="background"
			v-model:current-page="currentPage"
			v-model:page-size="pageSize"
			:layout="layout"
			:page-sizes="pageSizes"
			:total="total"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		/>
	</div>
</template>

<script setup lang="ts">
import usePagination from "./index";

interface Props {
	total: number;
	page?: number;
	limit?: number;
	pageSizes?: number[];
	layout?: string;
	background?: boolean;
	autoScroll?: boolean;
	hidden?: boolean;
}

interface Emit {
	(e: "update:page", value: number): void;
	(e: "update:limit", value: number): void;
	(e: "pagination", params: { page: number; limit: number }): void;
}

const props = withDefaults(defineProps<Props>(), {
	page: 1,
	limit: 20,
	pageSizes: () => [5, 10, 20, 30, 50, 100, 500],
	layout: "total, sizes, prev, pager, next, jumper",
	background: true,
	autoScroll: true,
	hidden: false,
});

const emit = defineEmits<Emit>();

// prettier-ignore
const { currentPage, pageSize, handleSizeChange, handleCurrentChange, } = usePagination(props, emit);

</script>

<style scoped>
.pagination-container {
	background: #fff;
	padding: 32px 16px;
}
.pagination-container.hidden {
	display: none;
}
</style>
