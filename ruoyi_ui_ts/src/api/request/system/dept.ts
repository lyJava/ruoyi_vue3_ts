import { ref, getCurrentInstance, nextTick, onMounted } from "vue";
// prettier-ignore
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild, page, batchDelDept } from "@/api/system/dept";
import { ElForm } from "element-plus";

export default () => {
	const { proxy } = getCurrentInstance() as any;
	const { sys_normal_disable } = proxy.useDict("sys_normal_disable");
	const statusOptions = ref<any>();
	const deptList = ref<any>();
	const open = ref<boolean>(false);
	const loading = ref<boolean>(true);
	const showSearch = ref<boolean>(true);
	const title = ref<string>("");
	const deptOptions = ref<any>();
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
	const ids = ref<any>();
	// 非单个禁用
	const single = ref<boolean>(true);
	// 非多个禁用
	const multiple = ref<boolean>(true);
	const pageTable = ref<boolean>(false);
	// 总条数
	const total = ref<number>(0);
	const pageTableList = ref<any>();
	const tableSwitch = ref<string>("分页表格");
	const switchIcon = ref<string>("list");
	const pageLoading = ref<boolean>(true);

	const deptRef = ref<InstanceType<typeof ElForm>>();
	const queryRef = ref<InstanceType<typeof ElForm>>();
	/** 查询部门列表 */
	const getList = async () => {
		loading.value = true;
		await listDept(queryParams.value).then((response) => {
			deptList.value = proxy.handleTree(response.data, "deptId");
			loading.value = false;
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
                const data =  response.data;
                pageTableList.value = data.rows;
                total.value = parseInt(data.total);
                pageLoading.value = false;
            }
		});
	};
	/** 取消按钮 */
	const cancel = () => {
		open.value = false;
		reset();
	};
	/** 表单重置 */
	const reset = () => {
		form.value = {
			deptId: undefined,
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
	const handleSwitch = () => {
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
	// 多选框选中数据
	const multipleSelection = (selection: any) => {
		ids.value = selection.map((item: any) => item.deptId);
		single.value = selection.length != 1;
		multiple.value = !selection.length;
	};
	/** 新增按钮操作 */
	const handleAdd = (row: any) => {
		reset();
		listDept().then((response: any) => {
			deptOptions.value = proxy.handleTree(response.data, "deptId");
		});
		if (row != undefined) {
			form.value.parentId = row.deptId;
		}
		open.value = true;
		title.value = "添加部门";
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
	const handleUpdate = (row: any) => {
		const deptId = row.deptId || ids.value;
		reset();
		listDeptExcludeChild(deptId).then((response: any) => {
			deptOptions.value = proxy.handleTree(response.data, "deptId");
		});
		getDept(deptId).then((response: any) => {
			if (response.code === 200) {
				response.data.orderNum = parseInt(response.data.orderNum);
				form.value = response.data;
				title.value = "修改部门";
				open.value = true;
			}
		});
	};
	/** 提交按钮 */
	const submitForm = async () => {
		await deptRef.value?.validate((valid: boolean) => {
			if (valid) {
				if (form.value.deptId !== undefined) {
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
		proxy.$modal
			.confirm('是否确认删除名称为"' + row.deptName + '"的数据项?')
			.then(() => {
				return delDept(row.deptId);
			})
			.then((response: any) => {
				if (response.code === 200) {
					proxy.$modal.msgSuccess("删除成功");
					getList();
				}
			})
			.catch(() => {
				console.log("取消了删除");
			});
	};

	/** 删除按钮操作 */
	const batchDelete = () => {
		const deptIds = ids.value;
		// prettier-ignore
		proxy.$modal.confirm('是否确认删除编号为【"' + deptIds + '"】的数据?')
			.then(() => {
				return batchDelDept(deptIds);
			})
			.then((response: any) => {
				if (response.code === 200) {
					proxy.$modal.msgSuccess("批量删除成功");
				}
				getPage();
			})
			.catch(() => {
				console.log("取消了批量删除");
			});
	};

	onMounted(() => {
		getList();
		proxy.getDicts("sys_normal_disable").then((response: any) => {
			statusOptions.value = response.data;
		});
	});
	// prettier-ignore
	return {
        loading, open, showSearch, title, deptOptions, deptList,  isExpandAll, refreshTable, queryParams, form, rules, sys_normal_disable, queryRef, 
        getList, cancel, handleQuery, resetQuery, handleAdd, toggleExpandAll, handleUpdate, submitForm, handleDelete, statusOptions, deptRef, 
        single, multiple, pageTable, pageLoading, total, pageTableList, switchIcon, tableSwitch, getPage, handleSwitch, multipleSelection, batchDelete
    };
};
