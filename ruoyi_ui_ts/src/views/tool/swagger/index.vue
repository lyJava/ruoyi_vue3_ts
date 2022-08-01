<template>
	<div v-loading="loading" :style="'height:' + height">
		<!-- prettier-ignore -->
		<iframe :src="src" frameborder="no" style="width: 100%;height: 100%" scrolling="auto" />
	</div>
</template>
<script>
export default {
	name: "Swagger",
	data() {
		return {
			//src: process.env.VUE_APP_BASE_API + "/swagger-ui.html",
            src: "",
			height: document.documentElement.clientHeight - 94.5 + "px;",
			loading: true
		};
	},
    created() {
        this.src = `http://localhost:8080/swagger-ui/index.html`;
    },
	mounted: function() {
		setTimeout(() => {
			this.loading = false;
		}, 230);
		const that = this;
		window.onresize = function temp() {
			that.height = document.documentElement.clientHeight - 94.5 + "px;";
		};
	}
};
</script>
