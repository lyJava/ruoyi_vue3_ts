import { ref, getCurrentInstance } from "vue";
// prettier-ignore
import { getlist, delLogininfor, cleanLogininfor, unlockUser, } from "@/api/system/logininfor";
import { ElForm, ElTable } from "element-plus";
import { uniqueArr } from "@/utils";

export default () => {
	const { proxy } = getCurrentInstance() as any;
    const queryFormRef = ref<InstanceType<typeof ElForm>>();
    const pageTableRef = ref<InstanceType<typeof ElTable>>();
	// 遮罩层
	let loading = ref<boolean>(true);
	// 选中数组
	const ids = ref<any>();
	// 非多个禁用
	let multiple = ref<boolean>(true);
    // 选中的用户名
    let selectedNames = ref<string[]>();
	// 显示搜索条件
	let showSearch = ref<boolean>(true);
	// 总条数
	const total = ref<number>(0);
	// 表格数据
	const list = ref<any>();
	// 状态数据字典
	const statusOptions = ref<any>();
	// 日期范围
	const dateRange = ref<any>();
	// 查询参数
	const queryParams = ref<any>({
		pageNum: 1,
		pageSize: 10,
		ipaddr: undefined,
		userName: undefined,
		status: undefined,
		msg: undefined,
	});

	/** 查询登录日志列表 */
	const getList = () => {
		loading.value = true;
		// prettier-ignore
		getlist(proxy.addDateRange(queryParams.value, dateRange.value)).then((response: any) => {
				list.value = response.rows;
				total.value = parseInt(response.total);
				loading.value = false;
			}
		);
	};
	// 登录状态字典翻译
	const statusFormat = (row: { status: any }) => {
		return proxy.selectDictLabel(statusOptions.value, row.status);
	};
	/** 搜索按钮操作 */
	const handleQuery = () => {
		queryParams.value.pageNum = 1;
		getList();
	};
	/** 重置按钮操作 */
	const resetQuery = () => {
		dateRange.value = [];
		proxy.resetForm(queryFormRef);
		handleQuery();
	};
	// 多选框选中数据
	const handleSelectionChange = (selection: any) => {
		ids.value = selection.map((item: { infoId: any }) => item.infoId);
		multiple.value = !selection.length;
        selectedNames.value = selection.map((item: { userName: string  }) => item.userName);
	};
	/** 删除按钮操作 */
	const handleDelete = async (row: any) => {
        proxy.setTableRowSelected(pageTableRef, row, true);
		const infoIds = row.infoId || ids.value;
		// prettier-ignore
		await proxy.$modal.confirm('是否确认删除访问编号为"' + infoIds + '"的数据项?', "警告")
            .then(() => {
                return delLogininfor(infoIds);
            })
            .then((response: any) => {
               if (response.code === 200 ) {
                    getList();
                    proxy.$modal.msgSuccess("删除成功");
               }
            }).catch(() => {
                pageTableRef.value?.clearSelection();
                console.log("取消了删除");
            });
	};
	/** 清空按钮操作 */
	const handleClean = async () => {
		// prettier-ignore
		await proxy.$modal.confirm("是否确认清空所有登录日志数据项?", "警告")
            .then(() => {
                return cleanLogininfor();
            })
            .then((response: any) => {
                if (response.code === 200) {
                    getList();
                    proxy.$modal.msgSuccess("清空成功");
                }
            }).catch(() => {
                console.log("取消了清空");
            });
	};
	/** 导出按钮操作 */
	const handleExport = () => {
        // prettier-ignore
		proxy.download("/monitor/operlog/exportByStream", { ...queryParams }, `登录日志信息${new Date().getTime()}.xlsx`);
	};

    const unlock = async () => {
        const userName = uniqueArr(selectedNames.value)
        console.log("aaaa", userName);
        await proxy.$modal.confirm('是否要解除"' + userName + '"锁定?', "警告").then(() => {
            return unlockUser(userName);
        }).then((response: any) => {
            if (response.code === 200) {
                getList();
                proxy.$modal.msgSuccess("解除锁定成功");
            }
        }).catch(() => {
            pageTableRef.value?.clearSelection();
            console.log("取消解除锁定");
        });
    };

    const checkSelected  = (row: any) => {
        // 设置不可选中
        console.log("是否锁定", row.lock);
        return row.lock;
    };

	getList();
	proxy.getDicts("sys_common_status").then((response: any) => {
		statusOptions.value = response.data;
	});

	return {
        queryFormRef,
		loading,
		multiple,
		showSearch,
		total,
		list,
		statusOptions,
		dateRange,
		queryParams,
        pageTableRef,
		getList,
		statusFormat,
		handleQuery,
		resetQuery,
		handleSelectionChange,
		handleDelete,
		handleClean,
		handleExport,
        unlock,
        checkSelected
	};
};
