<!-- StringOptionsSelect.vue -->
<template>
	<el-select
		:model-value="modelValue"
		:multiple="multiple"
		clearable
		:placeholder="placeholder"
		:style="{ width: width }"
		@change="handleChange"
	>
		<el-option
			v-for="(item, index) in options"
			:key="index"
			:value="item.value"
			:label="item.label"
			:disabled="item.disabled"
		/>
	</el-select>
</template>

<script setup lang="ts">
import { PropType, computed } from "vue";

interface StringOption {
	value: string;
	label: string;
	disabled?: boolean;
}

const props = defineProps({
	modelValue: {
		type: [String, Array] as PropType<string | string[]>,
		default: () => [],
	},
	options: {
		type: Array as PropType<StringOption[]>,
		required: true,
		validator: (value: StringOption[]) =>
			value.every(
				(item) =>
					typeof item.value === "string" &&
					typeof item.label === "string"
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
		default: "100%",
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
