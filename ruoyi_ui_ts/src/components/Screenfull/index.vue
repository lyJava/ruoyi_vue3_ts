<template>
	<div>
		<svg-icon
			:icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
			@click="handleToggleFullscreen"
		/>
	</div>
</template>

<script lang="ts" setup>
import screenFull from "screenfull";
import { ElMessage } from "element-plus";

const isFullscreen = ref<boolean>(false);

const handleFullscreenChange = () => {
	isFullscreen.value = screenFull.isFullscreen;
};

const handleToggleFullscreen = () => {
	if (!screenFull.isEnabled) {
		ElMessage({
			message: "你的浏览器不支持全屏",
			type: "warning",
		});
		return;
	}
	screenFull.toggle();
};

// 生命周期处理
onMounted(() => {
	if (screenFull.isEnabled) {
		screenFull.on("change", handleFullscreenChange);
	}
});

onBeforeUnmount(() => {
	if (screenFull.isEnabled) {
		screenFull.off("change", handleFullscreenChange);
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
