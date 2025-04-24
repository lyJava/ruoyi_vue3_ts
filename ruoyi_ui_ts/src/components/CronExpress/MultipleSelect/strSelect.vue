<template>
	<el-select
		:model-value="modelValue"
		:multiple="multiple"
		clearable
		:placeholder="placeholder"
		:style="{ width: width, marginLeft: '6px'}"
		@change="handleChange"
	>
		<el-option
			v-for="(item, index) in options"
			:key="index"
			:label="item.value"
			:value="item.key"
			:disabled="item.disabled"
		/>
	</el-select>
</template>

<script setup lang="ts">
import { PropType } from "vue";

interface StringOption {
	key: number;
	value: string;
	disabled?: boolean;
}

const props = defineProps({
	modelValue: {
		type: [String, Array] as PropType<string | string[] | number[]>,
		default: () => [],
	},
	options: {
		type: Array as PropType<StringOption[]>,
		required: true,
		validator: (value: StringOption[]) =>
			value.every(
				(item) =>
					typeof item.key === "number" &&
					typeof item.value === "string"
			),
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
	filterable: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(["update:modelValue"]);

const handleChange = (value: string | string[]) => {
	emit("update:modelValue", value);
};
</script>
