<template>
	<section class="app-main">
    <!-- <router-view /> -->
		<router-view v-slot="{ Component, route }">
			<transition name="fade-transform" mode="out-in">
				<div>
					<keep-alive :include="cachedViews">
						<component :is="Component" :key="route.fullPath"/>
					</keep-alive>
				</div>
			</transition>
		</router-view>
        <!-- parentComponent.ctx.deactivate is not a function 
            https://blog.csdn.net/qq_15197419/article/details/123005480
        -->
        <!-- <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" :key="$route.fullPath" v-if="$route.meta.keepAlive"/>
            </keep-alive>
                <component :is="Component" :key="$route.fullPath" v-if="!$route.meta.keepAlive"/>
        </router-view> -->
	</section>
</template>

<script setup lang="ts">
import useTagsViewStore from "@/store/modules/tagsView";

const tagsViewStore = useTagsViewStore();
const route = useRoute();
tagsViewStore.addCachedView(route);
const cachedViews = computed(() => {
	return tagsViewStore.cachedViews;
});
</script>

<style lang="scss" scoped>
.app-main {
	/* 50= navbar  50  */
	min-height: calc(100vh - 50px);
	width: 100%;
	position: relative;
	overflow: hidden;
}
.fixed-header + .app-main {
	padding-top: 50px;
}
.hasTagsView {
	.app-main {
		/* 84 = navbar + tags-view = 50 + 34 */
		min-height: calc(100vh - 84px);
	}
	.fixed-header + .app-main {
		padding-top: 84px;
	}
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
	.fixed-header {
		padding-right: 17px;
	}
}
</style>
