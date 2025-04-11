<template>
	<div>
		<svg-icon :icon-class="props.iconClass" @click="goto" />
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	/**
	 * 图标
	 */
	iconClass: {
		type: String,
		required: true,
	},
	/**
	 * 跳转地址
	 */
	url: {
		type: String,
		required: true,
	},
});
const goto = () => {
	window.open(props.url, "_blank", "noopener,noreferrer");
};
</script>
