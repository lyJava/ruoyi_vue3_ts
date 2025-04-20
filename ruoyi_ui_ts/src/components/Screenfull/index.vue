<template>
	<div>
		<svg-icon
			:icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
			@click="handleToggleFullscreen"
		/>
	</div>
</template>

<script lang="ts" setup>
import screenfull from "screenfull";
import { ElMessage } from "element-plus";

const isFullscreen = ref<boolean>(false);

const handleFullscreenChange = () => {
	isFullscreen.value = screenfull.isFullscreen;
};

const handleToggleFullscreen = () => {
	if (!screenfull.isEnabled) {
		ElMessage({
			message: "你的浏览器不支持全屏",
			type: "warning",
		});
		return;
	}
	screenfull.toggle();
};

// 生命周期处理
onMounted(() => {
	if (screenfull.isEnabled) {
		screenfull.on("change", handleFullscreenChange);
	}
});

onBeforeUnmount(() => {
	if (screenfull.isEnabled) {
		screenfull.off("change", handleFullscreenChange);
	}
});
</script>

<style scoped>
.screenfull-svg {
	display: inline-block;
	cursor: pointer;
	fill: #5a5e66;
	width: 20px;
	height: 20px;
	vertical-align: 10px;
}
</style>
