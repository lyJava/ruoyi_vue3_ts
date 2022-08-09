<template>
	<div v-loading="loading" :style="'height:' + height">
		<!-- prettier-ignore -->
		<iframe :src="src" frameborder="no" style="width: 100%;height: 100%" scrolling="auto" />
	</div>
</template>
<script lang="ts" name="Swagger" setup>
import { ref, onMounted } from "vue";

const loading = ref<boolean>(true);
//src: process.env.VUE_APP_BASE_API + "/swagger-ui.html",
// const src = ref<string>("http://localhost:8080/swagger-ui/index.html");
const src = ref<string>("http://localhost:8080/swagger-ui/index.html");
//  http://localhost:8080/swagger-ui/index.html，
//  * (注意swagger2.x版本中访问的地址的为： http://localhost:8080/swagger-ui.html)
const height = ref<any>(document.documentElement.clientHeight - 94.5 + "px;");

onMounted(() => {
	setTimeout(() => {
		loading.value = false;
	}, 230);
	const that = this;
	window.onresize = function temp() {
		height.value = document.documentElement.clientHeight - 94.5 + "px;";
	};
});
</script>
