<template>
	<el-dropdown trigger="click" @command="handleSetSize">
		<div>
			<svg-icon class-name="size-icon" icon-class="size" />
		</div>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item
					v-for="item in sizeOptions"
					:key="item.value"
					:disabled="currentSize === item.value"
					:command="item.value"
				>
					{{ item.label }}
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import useAppStore from "@/store/modules/app";
import useTagsViewStore from "@/store/modules/tagsView";

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const tagsViewStore = useTagsViewStore();

const sizeOptions = [
	{ label: "Default", value: "default" },
	{ label: "Medium", value: "medium" },
	{ label: "Small", value: "small" },
	{ label: "Mini", value: "mini" },
];

// 计算属性
const currentSize = computed(() => appStore.size);

// 处理方法
const handleSetSize = (size) => {
	try {
		configureElementSiz(size);
		// 设置 Element Plus 全局尺寸
		if (window.$ELEMENT) {
			window.$ELEMENT.size = size;
		}

		// 提交
		appStore.setSize(size);

		// 刷新视图
		refreshView();

		// 显示成功提示
		ElMessage.success("Switch Size Success");
	} catch (error) {
		ElMessage.error("尺寸切换失败: " + error.message);
	}
};

// 刷新视图方法
const refreshView = async () => {
	// 清除所有缓存视图
	tagsViewStore.delAllCachedViews(route);
	// 使用路由重定向刷新页面
	const { fullPath } = route;
	await router.replace({
		path: "/redirect" + fullPath,
	});
};

const configureElementSize = (size) => {
	// 测试环境不需要配置
	if (import.meta.env.MODE !== "test") {
		window.$ELEMENT = window.$ELEMENT || {};
		window.$ELEMENT.size = size;
	}
};
</script>

<style scoped>
.size-icon {
	cursor: pointer;
	font-size: 18px;
	vertical-align: middle;
	margin: 0 8px;
}
</style>
