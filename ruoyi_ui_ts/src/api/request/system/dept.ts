import { ref, getCurrentInstance, nextTick, onMounted } from "vue";
// prettier-ignore
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from "@/api/system/dept";
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

	const deptRef = ref<InstanceType<typeof ElForm>>();
	const queryRef = ref<InstanceType<typeof ElForm>>();
	/** 查询部门列表 */
	const getList = () => {
		loading.value = true;
		listDept(queryParams.value).then((response) => {
			deptList.value = proxy.handleTree(response.data, "deptId");
			loading.value = false;
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
		getList();
	};
	/** 重置按钮操作 */
	const resetQuery = () => {
		proxy.resetForm(queryRef);
		handleQuery();
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
	const handleUpdate = (row: { deptId: string }) => {
		reset();
		listDeptExcludeChild(row.deptId).then((response: any) => {
			deptOptions.value = proxy.handleTree(response.data, "deptId");
		});
		getDept(row.deptId).then((response: any) => {
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
							getList();
						}
					});
				} else {
					addDept(form.value).then((response: any) => {
						if (response.code === 200) {
							proxy.$modal.msgSuccess("新增成功");
							open.value = false;
							getList();
						}
					});
				}
			}
		});
	};
	/** 删除按钮操作 */
	const handleDelete = (row: { deptName: string; deptId: string }) => {
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

	onMounted(() => {
		getList();
		proxy.getDicts("sys_normal_disable").then((response: any) => {
			statusOptions.value = response.data;
		});
	});
	// prettier-ignore
	return {
        loading, open, showSearch, title, deptOptions, deptList,  isExpandAll, refreshTable, queryParams, form, rules, sys_normal_disable, queryRef, 
        getList, cancel,  handleQuery, resetQuery, handleAdd, toggleExpandAll, handleUpdate, submitForm, handleDelete, statusOptions, deptRef, 
    };
};
