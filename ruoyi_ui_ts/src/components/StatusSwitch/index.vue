<template>
	<div>
		<el-switch
			v-model="datas"
			:active-color="activeColor"
			:inactive-color="inactiveColor"
			active-value="0"
			inactive-value="1"
			v-bind="$attrs"
			@change="handleChange"
		></el-switch>
	</div>
</template>

<script lang="ts" setup>
// v-bind="$attrs"的说明
// https://www.cnblogs.com/ygunoil/p/13369193.html

const props = defineProps({
	statusData: {
		type: String,
		default: "",
	},
	activeColor: {
		type: String,
		default: "#13CE66",
	},
	inactiveColor: {
		type: String,
		default: "#BEBEBE",
	},
});
const datas = ref(props.statusData);

const emit = defineEmits<{
	(e: "handleChange", value: string | number | boolean): void;
}>();
const handleChange = (val: boolean | string | number) => {
	emit("handleChange", val);
};
</script>
