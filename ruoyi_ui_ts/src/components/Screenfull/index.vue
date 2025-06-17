<template>
	<div>
		<svg-icon
			:icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
			@click="handleToggleFullscreen"
		/>
	</div>
</template>

<script lang="ts" setup>
import screenFullCom from "screenfull";
import { ElMessage } from "element-plus";

const isFullscreen = ref<boolean>(false);

const handleFullscreenChange = () => {
	isFullscreen.value = screenFullCom.isFullscreen;
};

const handleToggleFullscreen = () => {
	if (!screenFullCom.isEnabled) {
		ElMessage({
			message: "你的浏览器不支持全屏",
			type: "warning",
		});
		return;
	}
	screenFullCom.toggle();
};

// 生命周期处理
onMounted(() => {
	if (screenFullCom.isEnabled) {
		screenFullCom.on("change", handleFullscreenChange);
	}
});

onBeforeUnmount(() => {
	if (screenFullCom.isEnabled) {
		screenFullCom.off("change", handleFullscreenChange);
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
