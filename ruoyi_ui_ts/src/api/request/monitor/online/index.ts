import { ref, getCurrentInstance, onMounted } from "vue";
import { list, forceLogout } from "@/api/system/online";
import { ElForm } from "element-plus";

export default () => {
	const { proxy } = getCurrentInstance() as any;
	// 遮罩层
	const loading = ref<boolean>(true);
	// 总条数
	const total = ref<number>(0);
	// 表格数据
	const tablelist = ref<any>([]);
	// 表单查询ref
	const queryFormRef = ref<InstanceType<typeof ElForm>>();
	// 表单查询参数
	const queryParams = ref({
		pageNum: 1,
		pageSize: 10,
		ipaddr: undefined,
		userName: undefined,
	});

	/** 查询在线用户列表 */
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
	/**
	 * 强退按钮操作
	 *
	 * @param row 当前行数据
	 */
	const handleForceLogout = (row: any) => {
		// prettier-ignore
		proxy.$modal.confirm('是否强退【' + row.userName + '】的用户?', "警告")
            .then(() => {
                return forceLogout(row.tokenId);
            })
            .then((response: any) => {
                if (response.code === 200) {
                    getList();
                    proxy.$modal.msgSuccess(row.userName + "强退成功！");
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
