<template>
	<div>
		<template v-for="(item, index) in options">
			<template v-if="values.includes(item.value)">
					<!-- 默认样式使用原生 span -->
				<span
					v-if="!item.elTagType || item.elTagType === 'default'"
					:class="item.elTagClass"
				>
					{{ item.label }}
				</span>
				<!-- Element 标签使用计算属性过滤无效类型 -->
				<el-tag
					v-else
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
		default:  () => [],
	},
	// 当前的值
	value: [Number, String, Array],
});

// 计算有效的标签类型
const validTagType = (type) => {
	const validTypes = ['primary', 'success', 'info', 'warning', 'danger'];
	return validTypes.includes(type) ? type : undefined; // 无效类型返回 undefined 避免警告
};


const values = computed(() => {
	if (props.value == null) {
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
