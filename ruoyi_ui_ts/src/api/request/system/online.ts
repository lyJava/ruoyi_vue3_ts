import { ref, getCurrentInstance, onMounted } from "vue";
import { list, forceLogout } from "@/api/monitor/online";
import { ElForm } from "element-plus";

export default () => {
	const { proxy } = getCurrentInstance() as any;
	// 遮罩层
	const loading = ref<boolean>(true);
	// 总条数
	const total = ref<number>(0);
	// 表格数据
	const tablelist = ref<any>([]);
	// 查询参数
	const queryParams = ref({
        pageNum: 1,
        pageSize: 10,
		ipaddr: undefined,
		userName: undefined,
	});

	const queryFormRef = ref<InstanceType<typeof ElForm>>();

	/** 查询登录日志列表 */
	const getList = () => {
		loading.value = true;
		list(queryParams.value).then((response: any) => {
			tablelist.value = response.rows;
			total.value = parseInt(response.total);
			loading.value = false;
		});
	};
	/** 搜索按钮操作 */
	const handleQuery = () => {
		queryParams.value.pageNum = 1;
		getList();
	};
	/** 重置按钮操作 */
	const resetQuery = () => {
		proxy.resetForm(queryFormRef);
		handleQuery();
	};
	/** 强退按钮操作 */
	const handleForceLogout = (row: any) => {
		// prettier-ignore
		proxy.$modal.confirm('是否确认强退名称为"' + row.userName + '"的用户?', "警告")
            .then(() => {
                return forceLogout(row.tokenId);
            })
            .then((response: any) => {
                if (response.code === 200) {
                    getList();
                    proxy.$modal.msgSuccess("强退成功");
                }
            })
            .catch(() => {
                console.log("取消了强退");
            });
	};

	onMounted(() => {
		getList();
	});

	// prettier-ignore
	return {
        loading, total, tablelist, queryParams, queryFormRef, handleQuery, resetQuery, handleForceLogout
    };
};
