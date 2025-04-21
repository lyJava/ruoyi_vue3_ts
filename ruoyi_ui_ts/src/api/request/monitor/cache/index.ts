import { getCache } from "@/api/system/cache";
import * as echarts from "echarts";

export default () => {
	
    const proxy = useSafeInstance();
	const cache = ref<any>([]);
	const commandstats = ref<any>(null);
	const usedmemory = ref<any>(null);

	const getList = async () => {
		proxy.$modal.loading("正在加载缓存监控数据，请稍候！");
		await getCache().then((response) => {
			proxy.$modal.closeLoading();
			cache.value = response.data;

			const commandstatsIntance = echarts.init(
				commandstats.value,
				"macarons"
			);
			commandstatsIntance.setOption({
				tooltip: {
					trigger: "item",
					formatter: "{a} <br/>{b} : {c} ({d}%)",
				},
				series: [
					{
						name: "命令",
						type: "pie",
						roseType: "radius",
						radius: [15, 95],
						center: ["50%", "38%"],
						data: response.data.commandStats,
						animationEasing: "cubicInOut",
						animationDuration: 1000,
					},
				],
			});

			const usedmemoryInstance = echarts.init(
				usedmemory.value,
				"macarons"
			);
			usedmemoryInstance.setOption({
				tooltip: {
					formatter:
						"{b} <br/>{a} : " + cache.value.info.used_memory_human,
				},
				series: [
					{
						name: "峰值",
						type: "gauge",
						min: 0,
						max: 1000,
						detail: {
							formatter: cache.value.info.used_memory_human,
						},
						data: [
							{
								value: parseFloat(
									cache.value.info.used_memory_human
								),
								name: "内存消耗",
							},
						],
					},
				],
			});
		});
	};

	onMounted(() => {
		getList();
	});

    return {
        cache, commandstats, usedmemory, getList
    }
};
