import { ElTable } from "element-plus";
// prettier-ignore
import { listRole, getRole, delRole, addRole, updateRole, dataScope, changeRoleStatus } from "@/api/system/role";
// prettier-ignore
import { treeSelect as menuTreeSelect, roleMenuTreeSelect } from "@/api/system/menu";
// prettier-ignore
import { roleDeptTreeSelect } from "@/api/system/dept";
import { addDateRange, displayIdArr, useComponentRef, useSafeInstance } from "@/utils/ruoyi";
import { getDicts } from "@/api/system/dict/data";
import { ElForm, ElTree } from "element-plus";
import { FormParam, QueryParam } from "./types";

export default () => {
	const proxy = useSafeInstance();
	const menuRef = useComponentRef(ElTree);
	const deptRef = useComponentRef(ElTree);;
	const pageTable = useComponentRef(ElTable);
	// 遮罩层
	const loading = ref<boolean>(true);
	// 导出遮罩层
	const exportLoading = ref<boolean>(false);
	// 选中数组
	const ids = ref<string[]>([]);
	// 非单个禁用
	const single = ref<boolean>(true);
	// 非多个禁用
	const multiple = ref<boolean>(true);
	// 显示搜索条件
	const showSearch = ref<boolean>(true);
	// 总条数
	const total = ref<number>(0);
	// 角色表格数据
	const roleList = ref<any>();
	// 弹出层标题
	const title = ref<string>("");
	// 是否显示弹出层
	const open = ref<boolean>(false);
	// 是否显示弹出层（数据权限）
	const openDataScope = ref<boolean>(false);
	const menuExpand = ref<any>();
	const menuNodeAll = ref<any>(false);
	const deptExpand = ref<any>();
	const deptNodeAll = ref<any>(false);
	// 日期范围
	const dateRange = ref<any>();
	// 状态数据字典
	const statusOptions = ref<any>();
	// 数据范围选项
	const dataScopeOptions = [
		{
			value: "1",
			label: "全部数据权限",
		},
		{
			value: "2",
			label: "自定数据权限",
		},
		{
			value: "3",
			label: "本部门数据权限",
		},
		{
			value: "4",
			label: "本部门及以下数据权限",
		},
		{
			value: "5",
			label: "仅本人数据权限",
		},
	];
	// 菜单列表
	const menuOptions = ref<any>();
	// 部门列表
	const deptOptions = ref<any>();
	// 查询参数
	const queryParams = ref<QueryParam>({
		pageNum: 1,
		pageSize: 10,
	});
	// 表单参数
	const form = ref<FormParam>({});
	const queryFormRef = useComponentRef(ElForm);
	const formRef = useComponentRef(ElForm);
	const defaultProps = {
		children: "children",
		label: "label",
	};
	// 表单校验
	const rules = {
		roleName: [
			{
				required: true,
				message: "角色名称不能为空",
				trigger: "blur",
			},
		],
		roleKey: [
			{
				required: true,
				message: "权限字符不能为空",
				trigger: "blur",
			},
		],
		roleSort: [
			{
				required: true,
				message: "角色顺序不能为空",
				trigger: "blur",
			},
		],
	};

	/** 查询角色列表 */
	const getList = () => {
        roleList.value = [];
		loading.value = true;
		listRole(proxy.addDateRange(queryParams.value, dateRange.value)).then(
			(response: any) => {
				if (response.code === 200) {
					const data = response.data;
					roleList.value = data.content;
					total.value = parseInt(data.records);
					loading.value = false;
				}
			}
		);
	};
	/** 查询菜单树结构 */
	const getMenuTreeSelect = () => {
		menuTreeSelect().then((response: any) => {
			if (response.code === 200) {
				menuOptions.value = response.data;
			}
		});
	};
	/** 查询部门树结构 */
	/* getDeptTreeselect() {
                deptTreeselect().then(response => {
                    if (response.code === 200) {
                        this.deptOptions = response.data;
                    }
                });
            }, */
	// 所有菜单节点数据
	const getMenuAllCheckedKeys = () => {
		// 目前被选中的菜单节点
		let checkedKeys = menuRef.value!.getCheckedKeys() || [];
		// 半选中的菜单节点
		let halfCheckedKeys = menuRef.value!.getHalfCheckedKeys() || [];
		//checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
		return [...checkedKeys, ...halfCheckedKeys];
	};
	// 所有部门节点数据
	const getDeptAllCheckedKeys = () => {
		// 目前被选中的部门节点
		let checkedKeys = deptRef.value?.getCheckedKeys() as any;
		// 半选中的部门节点
		let halfCheckedKeys = deptRef.value?.getHalfCheckedKeys();
		checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
		return checkedKeys;
	};
	/** 根据角色ID查询菜单树结构 */
	const getRoleMenuTreeSelect = async (roleId: string) => {
		return roleMenuTreeSelect(roleId).then((response: any) => {
			if (response.code === 200) {
				menuOptions.value = response.data.menus;
				return response;
			}
		});
	};
	/** 根据角色ID查询部门树结构 */
	const getRoleDeptTreeSelect = async (roleId: string) => {
		return roleDeptTreeSelect(roleId).then((response: any) => {
			if (response.code === 200) {
				deptOptions.value = response.data.depts;
				return response;
			}
		});
	};
	const cleanSelect = () => {
		proxy.cleanTableSelection(pageTable);
	};
	// 角色状态修改
	const handleStatusChange = async (row: any) => {
		proxy.setTableRowSelected(pageTable, row, true);
		let text = row.status === "0" ? "启用" : "停用";
		// prettier-ignore
		await proxy.$modal.confirm('确认要"' + text + '""' + row.roleName + '"角色吗?', "警告",
				{
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				}
			)
			.then(() => {
				return changeRoleStatus(row.id, row.roleStatus);
			})
			.then((response: any) => {
				if (response.code === 200) {
                    proxy.$modal.msgSuccess(text + "成功");
                }
			})
			.catch(() => {
                cleanSelect();
				row.status = row.roleStatus === "0" ? "1" : "0";
				console.log("角色状态修改取消");
			});
	};
	// 取消按钮
	const cancel = () => {
		open.value = false;
		reset();
		cleanSelect();
	};
	// 取消按钮（数据权限）
	const cancelDataScope = () => {
		openDataScope.value = false;
		reset();
		cleanSelect();
	};
	// 表单重置
	const reset = () => {
		if (menuRef.value != undefined) {
			menuRef.value.setCheckedKeys([]);
		}
		menuExpand.value = false;
		menuNodeAll.value = false;
		deptExpand.value = true;
		deptNodeAll.value = false;
		form.value = {
			roleSort: 0,
			status: "0",
			menuIds: [],
			deptIds: [],
			menuCheckStrictly: true,
			deptCheckStrictly: true,
		};
		proxy.resetForm(formRef);
	};
	/** 搜索按钮操作 */
	const handleQuery = () => {
		getList();
	};
	/** 重置按钮操作 */
	const resetQuery = () => {
		dateRange.value = [];
		proxy.resetForm(queryFormRef);
		handleQuery();
	};
    const checkSelected  = (row: any) => {
        // 设置不可选中
        return row.id !== "1";
    };
	// 多选框选中数据
	const handleSelectionChange = (selection: any) => {
		ids.value = selection.map((item: { id: string }) => item.id);
		single.value = selection.length != 1;
		multiple.value = !selection.length;
	};
	// 树权限（展开/折叠）
	const handleCheckedTreeExpand = (value: any, type: string) => {
		if (type === "menu") {
			let treeList = menuOptions.value;
			for (let i = 0; i < treeList.length; i++) {
				// prettier-ignore
				proxy.$refs.menuRef.store.nodesMap[treeList[i].id].expanded = value;
			}
		} else if (type === "dept") {
			let treeList = deptOptions.value;
			for (let i = 0; i < treeList.length; i++) {
				// prettier-ignore
				proxy.$refs.deptRef.store.nodesMap[treeList[i].id].expanded = value;
			}
		}
	};
	// 树权限（全选/全不选）
	const handleCheckedTreeNodeAll = (value: any, type: string) => {
		if (type === "menu") {
			menuRef.value?.setCheckedNodes(value ? menuOptions.value : []);
		} else if (type === "dept") {
			deptRef.value?.setCheckedNodes(value ? deptOptions.value : []);
		}
	};
	// 树权限（父子联动）
	const handleCheckedTreeConnect = (value: any, type: string) => {
		console.log('联动====', value)
		if (type == "menu") {
			form.value.menuCheckStrictly = value ? true : false;
		} else if (type == "dept") {
			form.value.deptCheckStrictly = value ? true : false;
		}
	};
	/** 新增按钮操作 */
	const handleAdd = () => {
		reset();
		getMenuTreeSelect();
		open.value = true;
		title.value = "添加角色";
	};
	/** 修改按钮操作 */
	const handleUpdate = (row: any) => {
		proxy.setTableRowSelected(pageTable, row, true);
		reset();
		const roleId: string = row.id || ids.value[0];
        if (!roleId) {
            return;
        }
		getRole(roleId).then((response: any) => {
			if (response.code === 200) {
				// 转换下避免出现警告
				response.data.roleSort = parseInt(response.data.roleSort);
				form.value = response.data;
				open.value = true;
				nextTick(() => {
					getRoleMenuTreeSelect(roleId).then(
						(res: { code: number; data: { checkedKeys: any } }) => {
							if (res.code === 200) {
								const checkedKeys = res.data.checkedKeys;
								checkedKeys.forEach((v: any) => {
									nextTick(() => {
										// prettier-ignore
										menuRef.value?.setChecked(v, true, false);
									});
								});
							}
						}
					);
				});
				title.value = "修改角色";
			}
		});
	};
	/** 选择角色权限范围触发 */
	const dataScopeSelectChange = (value: string) => {
		if (value !== "2") {
			deptRef.value?.setCheckedKeys([]);
		}
	};
	/** 分配数据权限操作 */
	const handleDataScope = (row: any) => {
		proxy.setTableRowSelected(pageTable, row, true);
		reset();
		getRole(row.id).then((response: any) => {
			if (response.code === 200) {
				openDataScope.value = true;
				// 转换下避免出现警告
				response.data.roleSort = parseInt(response.data.roleSort);
				form.value = response.data;
				setTimeout(() => {
					nextTick(() => {
						getRoleDeptTreeSelect(row.id).then(
							(res: { data: { checkedKeys: any } }) => {
								// prettier-ignore
								deptRef.value?.setCheckedKeys(res.data.checkedKeys);
							}
						);
					});
				}, 100);
				title.value = "分配数据权限";
			}
		});
	};
	/** 提交按钮 */
	const submitForm = () => {
		formRef.value?.validate((valid: boolean) => {
			if (valid && form.value) {
				if (form.value.id !== undefined) {
					form.value.menuIds = getMenuAllCheckedKeys();
					updateRole(form.value).then((response: any) => {
						if (response.code === 200) {
							proxy.$modal.msgSuccess("修改成功");
							open.value = false;
							getList();
						}
					});
				} else {
					form.value.menuIds = getMenuAllCheckedKeys();
					addRole(form.value).then((response: any) => {
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
	/** 提交按钮（数据权限） */
	const submitDataScope = () => {
		if (form.value.id !== undefined) {
			form.value.deptIds = getDeptAllCheckedKeys();
			dataScope(form.value).then((response: any) => {
				if (response.code === 200) {
					proxy.$modal.msgSuccess("修改成功");
					openDataScope.value = false;
					getList();
				}
			});
		}
	};
	/** 删除按钮操作 */
	const handleDelete = (row: any) => {
		const roleIds: string | string[] = row.id || ids.value;
        if (!roleIds) {
            return;
        }
		// 这里的设置选中行不能放在roleIds之前，不然会造成roleIds中存在undefined的元素
		proxy.setTableRowSelected(pageTable, row, true);
		// prettier-ignore
		const displayIds = displayIdArr(roleIds);
		// prettier-ignore
		proxy.$modal.confirm(`是否确认删除角色编号为 ${displayIds} 的数据项?`,)
                .then(() => {
                    return delRole(roleIds);
                })
                .then((response: { code: number; }) => {
                    if (response.code === 200) {
                        getList();
                        proxy.$modal.msgSuccess("删除成功");
                    }
                }).catch(() => {
                    cleanSelect();
                    console.log("删除操作取消");
                });
	};
	/** 导出按钮操作 */
	const handleExport = () => {
		if (total.value > 10000) {
			// prettier-ignore
			proxy.$modal.confirm("是否确认导出所有角色数据项?", "警告", {})
				.then(() => {
					// prettier-ignore
					proxy.download('/system/role/exportByStream', {...queryParams}, `角色信息导出${new Date().getTime()}.xlsx`);
				})
				.catch(() => {
					console.log("导出操作取消");
				});
		} else {
			// prettier-ignore
			proxy.download('/system/role/exportByStream', {...queryParams}, `角色信息导出${new Date().getTime()}.xlsx`);
		}
	};

    onMounted(() => {
		getList();
    	getDicts("sys_normal_disable").then((response: any) => {
			if (response.code === 200) {
        		statusOptions.value = response.data;
			}
    	});
	});
	
	// prettier-ignore
	return {
        menuRef, loading, exportLoading, deptRef, single, multiple, showSearch, total, roleList, title, open, openDataScope, menuExpand, menuNodeAll,
        deptExpand, deptNodeAll, dateRange, statusOptions, dataScopeOptions, menuOptions, deptOptions, queryParams, form, defaultProps, rules, formRef,
        queryFormRef, getList, handleStatusChange, handleQuery, resetQuery, handleSelectionChange, handleCheckedTreeExpand,  
        handleCheckedTreeNodeAll, handleCheckedTreeConnect, handleAdd, handleUpdate, dataScopeSelectChange, handleDataScope, submitForm, cleanSelect,
        submitDataScope, handleDelete, handleExport, pageTable, checkSelected, 
    }
};
