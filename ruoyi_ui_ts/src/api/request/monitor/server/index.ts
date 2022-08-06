import { ref, getCurrentInstance, onMounted } from "vue";
import { getServer } from "@/api/system/server";

export default () => {
	// 服务器信息
	const server = ref<any>([]);
	const { proxy } = getCurrentInstance() as any;

	/** 查询服务器信息 */
	const getList = () => {
		proxy.$modal.loading("正在加载服务监控数据，请稍候！");
		getServer().then((response: any) => {
			server.value = response.data;
			proxy.$modal.closeLoading();
		});
	};
	onMounted(() => {
		getList();
	});

    return {
        server
    }
};
