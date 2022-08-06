<template>
	<div v-loading="loading" :style="'height:' + height">
		<iframe
			:src="src"
			frameborder="no"
			style="width: 100%; height: 80vh"
			scrolling="auto"
		/>
	</div>
</template>

<script name="Druid" setup>
import { ref, onMounted } from "vue";
let loading = ref(true);
const src = ref("http://localhost:8080/druid/login.html");
let height = ref("");
onMounted(() => {
	setTimeout(() => {
		loading.value = false;
	}, 300);
	window.onresize = function temp() {
		height.value = document.documentElement.clientHeight - 94.5 + "px;";
	};
});
</script>
