import { scrollTo } from "@/utils/scroll-to";

export default (props: any, emit: any) => {
	/**
	 * 当前页面（双向绑定——使用computed处理）
	 */
	const currentPage = computed({
		get: () => props.page,
		set: (val) => emit("update:page", val),
	});

	const pageSize = computed({
		get: () => props.limit,
		set: (val) => emit("update:limit", val),
	});

	const handleSizeChange = (val: number) => {
		if (currentPage.value * val > props.total) {
			currentPage.value = 1;
		}
		emit("pagination", { page: currentPage.value, limit: val });
		props.autoScroll && scrollTo(0, 800);
	};

	const handleCurrentChange = (val: number) => {
		emit("pagination", { page: val, limit: pageSize.value });
		props.autoScroll && scrollTo(0, 800);
	};

	return {
		currentPage,
		pageSize,
		handleSizeChange,
		handleCurrentChange,
	};
};
