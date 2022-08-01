<template>
	<el-form-item class="item-search">
		<el-button icon="refresh" @click="resetClick">重置</el-button>
		<!-- prettier-ignore -->
		<el-button type="primary" icon="search" @click="queryClick">搜索</el-button>
	</el-form-item>
</template>
<script>
import { defineComponent } from "vue";
/**
 * 表单“搜索”与“重置”组件
 */
export default defineComponent({
	name: "FormSearch",
	// TODO 这里的props必须写，不然会提示 context.emit is not a function
	setup(props, context) {
		/**
		 * 重置
		 */
		const resetClick = () => {
			context.emit("reset");
		};

		/**
		 * 搜索
		 */
		const queryClick = () => {
			context.emit("search");
		};

		return {
			resetClick,
			queryClick,
		};
	},
});
</script>
