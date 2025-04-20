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
import { scrollTo } from "@/utils/scroll-to";

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

// 双向绑定处理
const currentPage = computed({
	get: () => props.page,
	set: (val) => emit("update:page", val),
});

const pageSize = computed({
	get: () => props.limit,
	set: (val) => emit("update:limit", val),
});

const handleSizeChange = (val: number) => {
	if (currentPage.value * val > props.total) {
		currentPage.value = 1;
	}
	emit("pagination", { page: currentPage.value, limit: val });
	props.autoScroll && scrollTo(0, 800);
};

const handleCurrentChange = (val: number) => {
	emit("pagination", { page: val, limit: pageSize.value });
	props.autoScroll && scrollTo(0, 800);
};
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
