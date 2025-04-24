<template>
	<el-select
		:model-value="modelValue"
		:multiple="multiple"
		clearable
		:placeholder="placeholder"
		:style="{ width: width, marginLeft: '6px' }"
		@change="handleChange"
	>
		<el-option
			v-for="n in rangeArray"
			:key="n"
			:value="n"
			:label="labelFormatter(n)"
			:disabled="disabledValues.includes(n)"
		/>
	</el-select>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
	modelValue: {
		type: [Number, Array] as PropType<number | number[]>,
		default: () => [],
	},
	start: {
		type: Number,
		default: 0,
	},
	end: {
		type: Number,
		default: 60,
	},
	step: {
		type: Number,
		default: 1,
	},
	multiple: {
		type: Boolean,
		default: false,
	},
	placeholder: {
		type: String,
		default: "请选择",
	},
	width: {
		type: String,
		default: "300px",
	},
	disabledValues: {
		type: Array as PropType<number[]>,
		default: () => [],
	},
	labelFormat: {
		type: String,
		default: "number", // 可选 'ordinal'（序数）或自定义格式函数
	},
});

const emit = defineEmits(["update:modelValue"]);

// 生成数字范围数组
const rangeArray = computed(() => {
	const result: number[] = [];
	for (let i = props.start; i <= props.end; i += props.step) {
		result.push(i);
	}
	return result;
});

// 标签格式化
const labelFormatter = computed(() => {
	if (typeof props.labelFormat === "function") {
		return props.labelFormat;
	}
	return (n: number) => n.toString();
	/* switch (props.labelFormat) {
		case "ordinal":
			return (n: number) => `${n}th`;
		case "minutes":
			return (n: number) => `${n} 分钟`;
		default:
			return (n: number) => n.toString();
	} */
});

const handleChange = (value: number | number[]) => {
	emit("update:modelValue", value);
};
</script>
