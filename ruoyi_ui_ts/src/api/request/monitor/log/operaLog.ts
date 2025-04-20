// prettier-ignore
import { getPageList, delOperlog, cleanOperlog } from "@/api/system/operlog";
import { displayIdArr, useComponentRef, useSafeInstance } from "@/utils/ruoyi";
import { ElForm, ElTable } from "element-plus";

export default () => {
	const proxy = useSafeInstance();
	// 遮罩层
	const loading = ref<boolean>(true);
	// 导出遮罩层
	const exportLoading = ref<boolean>(false);
	// 选中数组
	const ids = ref<string[]>([]);
	// 非多个禁用
	const multiple = ref<boolean>(true);
	// 显示搜索条件
	const showSearch = ref<boolean>(true);
	// 总条数
	const total = ref<number>(0);
	// 表格数据
	const list = ref<any>([]);
	// 是否显示弹出层
	const open = ref<boolean>(false);
	// 日期范围
	const dateRange = ref<string>("");
	// 默认排序
	const defaultSort = { prop: "operTime", order: "descending" } as any;
	// 表单参数
	let form = ref<any>();

	// 查询参数
	const queryParams = ref<any>({
		pageNum: 1,
		pageSize: 10,
		title: undefined,
		operName: undefined,
		businessType: undefined,
		status: undefined,
	});
	const { sys_common_status } = proxy.useDict("sys_common_status") as any;
	const { sys_oper_type } = proxy.useDict("sys_oper_type") as any;
	const formRef = useComponentRef(ElForm);
	const queryForm = useComponentRef(ElForm);
	const statusOptions = ref<any[]>([]);
    const pageTableRef = useComponentRef(ElTable);
	/** 查询登录日志 */
	const getList = () => {
		loading.value = true;
		getPageList(
			proxy.addDateRange(queryParams.value, dateRange.value)
		).then((response: any) => {
			if (response.code === 200) {
				const resp = response.data;
				list.value = resp.content;
				total.value = parseInt(resp.records);
				loading.value = false;
			}
		});
	};
	// 操作日志类型字典翻译
	const typeFormat = (row: any) => {
		// prettier-ignore
		return proxy.selectDictLabel(sys_oper_type.value, row.businessType);
	};
	/** 搜索按钮操作 */
	const handleQuery = () => {
		queryParams.value.pageNum = 1;
		getList();
	};
	/** 重置按钮操作 */
	const resetQuery = () => {
		dateRange.value = "";
		proxy.resetForm(queryForm);
		// 修复 Uncaught TypeError: Cannot read properties of undefined (reading 'sort')at Proxy.resetQuery
		nextTick(() => {
			if (pageTableRef.value) {
				pageTableRef.value.sort(defaultSort.prop, defaultSort.order);
			}
		});
		handleQuery();
	};
	/** 多选框选中数据 */
	const handleSelectionChange = (selection: any) => {
		ids.value = selection.map((item: { operId: string }) => item.operId);
		multiple.value = !selection.length;
	};
	/** 排序触发事件 */
	const handleSortChange = (column: any) => {
		queryParams.value.orderByColumn = column.prop;
		queryParams.value.isAsc = column.order;
		getList();
	};
    const cleanSelect = () => {
        proxy.cleanTableSelection(pageTableRef);
    };
	/** 详细按钮操作 */
	const handleView = (row: any) => {
        proxy.setTableRowSelected(pageTableRef, row, true);
		open.value = true;
		form.value = row;
	};
	/** 删除按钮操作 */
	const handleDelete = (row: any) => {
		const operIds: string | string[] = row.operId || ids.value;
		proxy.setTableRowSelected(pageTableRef, row, true);
		const displayIds = displayIdArr(operIds);
		// prettier-ignore
		proxy.$modal.confirm(`是否确认删除日志编号为 ${displayIds} 的数据项?`, "警告")
            .then(() => {
                return delOperlog(operIds);
            })
            .then((response: any) => {
                if (response.code === 200) {
                    getList();
                    proxy.$modal.msgSuccess("删除成功");
                }
            })
            .catch(() => {
                cleanSelect();
                console.log("取消了删除");
            });
	};
	/** 清空按钮操作 */
	const handleClean = () => {
		// prettier-ignore
		proxy.$modal.confirm("是否确认清空所有操作日志数据项?", "警告")
            .then(() => {
                return cleanOperlog();
            })
            .then((response: any) => {
                if (response.code === 200) {
                    getList();
                    proxy.$modal.msgSuccess("清空成功");
                }
            })
            .catch(() => {
                console.log("取消了清空");
            });
	};
	/** 导出按钮操作 */
	const handleExport = () => {
		// prettier-ignore
		proxy.download('/monitor/operlog/exportByStream', {...queryParams}, `操作日志导出${new Date().getTime()}.xlsx`);
	};

	/**
	 * 绑定回车
	 */
	const keyupEnter = () => {
		document.onkeydown = (e: any) => {
			if (e.defaultPrevented) {
				return;
			}
			// prettier-ignore
			const body = document.getElementsByTagName('body')[0];
			// prettier-ignore
            // match(此处应填写文件在浏览器中的地址，如 '/home/index')
			if (e.keyCode === 13 && e.target.baseURI.match("/system/log/operlog") && e.target === body) {
                console.log("按下了回车键");
                getList();
            }
		};
	};

	onMounted(() => {
		getList();
		proxy.getDicts("sys_normal_disable").then((response: any) => {
			if (response.code === 200) {
				statusOptions.value = response.data;
			}
		});
		keyupEnter();
	});

	// prettier-ignore
	return {
        loading, exportLoading, multiple, showSearch, total, list, open, dateRange, defaultSort, form, queryParams, sys_common_status, sys_oper_type, formRef, 
		statusOptions, queryForm, pageTableRef, cleanSelect, getList, typeFormat, handleQuery, resetQuery, handleSelectionChange, 
        handleSortChange, handleView, handleDelete, handleClean, handleExport
    }
};
