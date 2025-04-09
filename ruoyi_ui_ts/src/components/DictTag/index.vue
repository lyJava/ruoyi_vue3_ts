<template>
	<div>
		<template v-for="(item, index) in options">
			<template v-if="values.includes(item.value)">
				<!--默认样式改为使用 primary 标签 -->
				<el-tag
					:disable-transitions="true"
					:type="validTagType(item.elTagType)"
					:class="item.elTagClass"
				>
					{{ item.label }}
				</el-tag>
			</template>
		</template>
	</div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
	// 数据
	options: {
		type: Array,
		default:  () => [""],
	},
	// 当前的值
	value: [Number, String, Array],
});

// 计算有效的标签类型
const validTagType = (type) => {
	const validTypes = ['info', 'success', 'primary', 'warning', 'danger'];
	return validTypes.includes(type) ? type : undefined; // 无效类型返回 undefined 避免警告
};


const values = computed(() => {
	if (!props.value) {
		return []
	};
	return Array.isArray(props.value) ? props.value : [String(props.value)];
});
</script>

<style scoped>
.el-tag + .el-tag {
	margin-left: 10px;
}
</style>
