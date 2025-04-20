<template>
	<el-breadcrumb class="app-breadcrumb" separator="/">
		<transition-group name="breadcrumb">
			<el-breadcrumb-item
				v-for="(item, index) in levelList"
				:key="item.path"
			>
				<span
					v-if="
						item.redirect === 'noRedirect' ||
						index == levelList.length - 1
					"
					class="no-redirect"
					>{{ item.meta.title }}</span
				>
				<a v-else @click.prevent="handleLink(item)">{{
					item.meta.title
				}}</a>
			</el-breadcrumb-item>
		</transition-group>
	</el-breadcrumb>
</template>

<script lang="ts" setup>
import { RouteLocationMatched } from "vue-router";
const levelList = ref<RouteLocationMatched[]>([]);

const route = useRoute();
const router = useRouter();

watch(
	() => route.path,
	(newPath: string) => {
		if (newPath.startsWith("/redirect/")) return;
		getBreadcrumb();
	}
);

onMounted(() => {
	getBreadcrumb();
});

const getBreadcrumb = () => {
	// only show routes with meta.title
	let matched = route.matched.filter(
		(item) => item.meta && item.meta.title
	) as RouteLocationMatched[];
	const first = matched[0];

	if (!isDashboard(first)) {
		matched = [
			{
				path: "/index",
				meta: { title: "首页" },
				// 补全必要类型属性
				name: "Home",
				redirect: undefined,
				components: {},
				children: [],
				instances: {},
				leaves: [],
				props: {},
			} as unknown as RouteLocationMatched,
			...matched,
		];
	}

	levelList.value = matched.filter(
		(item) => item.meta?.title && item.meta.breadcrumb !== false
	);
};
const isDashboard = (route: RouteLocationMatched) => {
	let name = route && route.name;
	if (!name) {
		return false;
	}
	name = String(route?.name ?? "");
	return name.trim() === "首页";
};
const handleLink = (item: RouteLocationMatched) => {
	if (item.redirect) {
		router.push(item.redirect as any);
		return;
	}
	router.push(item.path);
};
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
	display: inline-block;
	font-size: 14px;
	line-height: 50px;
	margin-left: 8px;

	.no-redirect {
		color: #97a8be;
		cursor: text;
	}
}
</style>
