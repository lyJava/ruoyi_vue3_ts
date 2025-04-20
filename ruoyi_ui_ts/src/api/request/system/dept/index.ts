import { displayIdArr, useComponentRef, useSafeInstance, } from "@/utils/ruoyi";
// prettier-ignore
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild, page, batchDelDept } from "@/api/system/dept";
import { ElForm, ElTable } from "element-plus";
import { debounce } from '@/utils';
import { getDictsFetch } from "@/api/system/dict/data";

export default () => {
	// 安全获取全局proxy
	const proxy = useSafeInstance();
	const { sys_normal_disable } = proxy.useDict("sys_normal_disable");
	const statusOptions = ref<any>([]);
	const deptList = ref<any>([]);
	const open = ref<boolean>(false);
	const loading = ref<boolean>(true);
	const showSearch = ref<boolean>(true);
	const title = ref<string>("");
	const deptOptions = ref<any>([]);
	const isExpandAll = ref<boolean>(true);
	const refreshTable = ref<boolean>(true);
	const form = ref<any>();
	const queryParams = ref<any>({
		pageNum: 1,
		pageSize: 10,
		deptName: undefined,
		status: undefined,
	});
	const rules = ref<any>({
		parentId: [
			{ required: true, message: "上级部门不能为空", trigger: "blur" },
		],
		deptName: [
			{ required: true, message: "部门名称不能为空", trigger: "blur" },
		],
		orderNum: [
			{ required: true, message: "显示排序不能为空", trigger: "blur" },
		],
		email: [
			{
				type: "email",
				message: "请输入正确的邮箱地址",
				trigger: ["blur", "change"],
			},
		],
		phone: [
			{
				pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
				message: "请输入正确的手机号码",
				trigger: "blur",
			},
		],
	});
	// 选中数组
	const ids = ref<string[]>([]);
	// 非单个禁用
	const single = ref<boolean>(true);
	// 非多个禁用
	const multiple = ref<boolean>(true);
	const pageTable = ref<boolean>(false);
	// 总条数
	const total = ref<number>(0);
	const pageTableList = ref<any>([]);
	const tableSwitch = ref<string>("分页表格");
	const switchIcon = ref<string>("list");
	const pageLoading = ref<boolean>(true);

	const deptRef = useComponentRef(ElForm);
	const queryRef = useComponentRef(ElForm);
	const pageTableRef = useComponentRef(ElTable);
	/** 查询部门列表 */
	const getList = async () => {
		loading.value = true;
		await listDept(queryParams.value).then((response: any) => {
			if (response.code === 200) {
				deptList.value = proxy.handleTree(response.data, "id");
				loading.value = false;
			}
		});
	};
	/**
	 * 分页数据
	 */
	const getPage = async () => {
		pageLoading.value = true;
		// prettier-ignore
		await page(queryParams.value).then((response: any) => {
			if (response.code === 200) {
                const data = response.data;
                pageTableList.value = data.content;
                total.value = parseInt(data.records);
                pageLoading.value = false;
            }
		});
	};

    const cleanSelect = () => {
        proxy.cleanTableSelection(pageTableRef);
    };

	/** 取消按钮 */
	const cancel = () => {
		reset();
        cleanSelect();
		open.value = false;
	};
	/** 表单重置 */
	const reset = () => {
		form.value = {
			id: undefined,
			parentId: undefined,
			deptName: undefined,
			orderNum: 0,
			leader: undefined,
			phone: undefined,
			email: undefined,
			status: "0",
		};
		proxy.resetForm(deptRef);
	};
	/** 搜索按钮操作 */
	const handleQuery = () => {
		if (total.value === 0 && !pageTable.value) {
			getList();
		} else {
			getPage();
		}
	};
	/** 重置按钮操作 */
	const resetQuery = () => {
		proxy.resetForm(queryRef);
		handleQuery();
	};
	/**
	 * 切换表格数据
	 */
	const switchTable = () => {
		ids.value = [];
		pageTable.value = !pageTable.value;
		refreshTable.value = !refreshTable.value;
		if (!pageTable.value && refreshTable.value) {
			total.value = 0;
			tableSwitch.value = "分页表格";
			switchIcon.value = "list";
			getList();
		} else {
			tableSwitch.value = "树形表格";
			switchIcon.value = "grid";
			getPage();
		}
	};

    // 切换表格增加防抖
    const handleSwitch = debounce(switchTable, 300, true);
	// 多选框选中数据
	const multipleSelection = (selection: any) => {
		ids.value = selection.map((item: any) => item.id);
		single.value = selection.length != 1;
		multiple.value = !selection.length;
	};
	/** 新增按钮操作 */
	const handleAdd = async (row: any) => {
		reset();
		await listDept().then((response: any) => {
			if (response.code === 200) {
				deptOptions.value = proxy.handleTree(response.data, "id");
			}
		});
		if (row != undefined) {
			form.value.parentId = row.id;
		}
		title.value = "添加部门";
		open.value = true;
	};
	/** 展开/折叠操作 */
	const toggleExpandAll = () => {
		refreshTable.value = false;
		isExpandAll.value = !isExpandAll.value;
		nextTick(() => {
			refreshTable.value = true;
		});
	};
	/** 修改按钮操作 */
	const handleUpdate = async (row: any) => {
		//row.parentId === "0" && (parentDeptShow.value = !parentDeptShow.value);
		const deptId: string = row.id || ids.value[0];
		reset();
		await listDeptExcludeChild(deptId).then((response: any) => {
			// 没有数据不调用构建树方法
			if (response.code === 200 && response.data) {
				deptOptions.value = proxy.handleTree(response.data, "id");
			}
		});
		await getDept(deptId).then((response: any) => {
			if (response.code === 200) {
				const data = response.data;
				data.orderNum = parseInt(data.orderNum);
				// 修复顶级父部门显示为0的问题
				if (data.parentId === "0") {
					data.parentId = parseInt(data.parentId);
				}
				form.value = data;
				title.value = "修改部门";
                proxy.setTableRowSelected(pageTableRef, row, true);
				open.value = true;
			}
		});
	};
	/** 提交按钮 */
	const submitForm = async () => {
		await deptRef.value?.validate((valid: boolean) => {
			if (valid) {
				if (form.value.id) {
					updateDept(form.value).then((response: any) => {
						if (response.code === 200) {
							proxy.$modal.msgSuccess("修改成功");
							open.value = false;
							handleQuery();
						}
					});
				} else {
					addDept(form.value).then((response: any) => {
						if (response.code === 200) {
							proxy.$modal.msgSuccess("新增成功");
							open.value = false;
							handleQuery();
						}
					});
				}
			}
		});
	};
	/** 删除按钮操作 */
	const handleDelete = (row: any) => {
        // 设置当前行被选中
        proxy.setTableRowSelected(pageTableRef, row, true);
		proxy.$modal
			.confirm(`是否确认删除: ${row.deptName} 的数据?`)
			.then(() => {
				return delDept(row.id);
			})
			.then((response: any) => {
				if (response.code === 200) {
					proxy.$modal.msgSuccess("删除成功");
					if (tableSwitch.value === "树形表格") {
						getPage();
					} else {
						getList();
					}
				}
			})
			.catch(() => {
                // 取消当前行选中
                proxy.setTableRowSelected(pageTableRef, row, false);
				console.log("取消了删除");
			});
	};

	/** 删除按钮操作 */
	const batchDelete = () => {
		const deptIds = ids.value;
		const displayIds = displayIdArr(deptIds);
		// prettier-ignore
		proxy.$modal.confirm(`是否确认删除编号为 ${displayIds} 的数据?`)
			.then(() => {
				return batchDelDept(deptIds);
			})
			.then((response: any) => {
				if (response.code === 200) {
					proxy.$modal.msgSuccess("批量删除成功");
					if (tableSwitch.value === "树形表格") {
						getPage();
					} else {
						getList();
					}
				}
			})
			.catch(() => {
                // 取消表格选中项
                cleanSelect();
				console.log("取消了批量删除");
			});
	};

	onMounted(() => {
		getList();
		// 使用fetch
		getDictsFetch("sys_normal_disable").then((response: any) => {
			if (response.code === 200) {
				statusOptions.value = response.data;
			}
		});
	});
	// prettier-ignore
	return {
        loading, open, showSearch, title, deptOptions, deptList,  isExpandAll, refreshTable, queryParams, form, rules, sys_normal_disable, queryRef, 
        statusOptions, deptRef, single, multiple, pageTable, pageLoading, total, pageTableList, switchIcon, tableSwitch, getPage, handleSwitch, cancel, 
        multipleSelection, batchDelete, handleQuery, resetQuery, handleAdd, toggleExpandAll, handleUpdate, submitForm, handleDelete, ids, 
        pageTableRef, cleanSelect
    };
};
