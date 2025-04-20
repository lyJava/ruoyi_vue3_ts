// prettier-ignore
import { listType, getDataType, delType, addType, updateType, exportType, clearCache, updateDictTypeStatus, refreshCache, } from "@/api/system/dict/type";
import { ElForm, ElTable } from "element-plus";
import { displayIdArr, useComponentRef, useSafeInstance } from "@/utils/ruoyi";
import { TypeFormParam, TypeQueryParam } from './types';

export default () => {
	const proxy = useSafeInstance();
	// 遮罩层
	const loading = ref<boolean>(true);
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
	// 字典表格数据
	const typeList = ref<any>();
	// 弹出层标题
	const title = ref<string>("");
	// 是否显示弹出层
	const open = ref<boolean>(false);
	// 状态数据字典
	const statusOptions = ref<any>();
	// 查询参数
	const queryParams = ref<TypeQueryParam>({
		pageNum: 1,
		pageSize: 10,
	});
    // 日期范围
	const dateRange = ref<any>();
	// 表单参数
	const form = ref<TypeFormParam>({});
	const formRef = useComponentRef(ElForm);
	const queryFormRef = useComponentRef(ElForm);
    const pageTableRef = useComponentRef(ElTable);
	// 表单校验
	const rules = ref({
		dictName: [
			{
				required: true,
				message: "字典名称不能为空",
				trigger: "blur",
			},
		],
		dictType: [
			{
				required: true,
				message: "字典类型不能为空",
				trigger: "blur",
			},
		],
	});

	/** 查询字典类型列表 */
	const getList = () => {
        typeList.value = [];
		loading.value = true;
		listType(proxy.addDateRange(queryParams.value, dateRange.value)).then(
			(response: any) => {
				if (response.code === 200) {
					const data = response.data;
					typeList.value = data.content;
					total.value = parseInt(data.records);
					loading.value = false;
				}
			}
		);
	};
	// 字典状态字典翻译
	const statusFormat = (row: any) => {
		return proxy.selectDictLabel(statusOptions.value, row.status);
	};

    /**
     * 取消表格选中
     */
    const cleanSelect = () => {
        proxy.cleanTableSelection(pageTableRef);
    };

	// 取消按钮
	const cancel = () => {
		open.value = false;
		reset();
        cleanSelect();
	};
	// 表单重置
	const reset = () => {
		form.value = {
			dictId: undefined,
			dictName: undefined,
			dictType: undefined,
			status: "0",
			remark: undefined,
		};
		proxy.resetForm(formRef);
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
	/** 新增按钮操作 */
	const handleAdd = () => {
		reset();
		title.value = "添加字典类型";
		open.value = true;
	};
	// 多选框选中数据
	const handleSelectionChange = (selection: any) => {
		ids.value = selection.map((item: any) => item.dictId);
		single.value = selection.length != 1;
		multiple.value = !selection.length;
	};
	/** 修改按钮操作 */
	const handleUpdate = (row: any) => {
		reset();
		const dictId = row.dictId || ids.value;
		getDataType(dictId).then((response: any) => {
			form.value = response.data;
			title.value = "修改字典类型";
            proxy.setTableRowSelected(pageTableRef, row, true);
			open.value = true;
		});
	};
    /**
     * 修改状态
     * 
     * @param val 当前选中的值
     * @param row 当前行数据
     */
    const updateStatus = async (val: any, row: any) => {
        /* console.log("aaaaa", row.status);
        const text = row.status === "0" ? "停用" : "启用";
        await proxy.$confirm(
            "确认要" + text + "吗?", "警告",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }
        ).then(() => {
            return updateDictTypeStatus(row.dictId, val);
        })
        .then((response: any) => {
            if (response.code === 200) {
                proxy.$modal.msgSuccess(response.msg);
                getList();
            }
        })
        .catch(() => {
            console.log("ssssss", row.status, val);
            row.status = val === "0" ? "1" : "0";
        }); */
        await updateDictTypeStatus(row.dictId, val).then((response: any) => {
            if (response.code === 200) {
                proxy.$modal.msgSuccess(response.msg);
                getList();
            }
        })
    };
	/** 提交按钮 */
	const submitForm = () => {
		formRef.value?.validate((valid) => {
			if (valid) {
				if (form.value.dictId != undefined) {
					updateType(form.value).then((response: any) => {
						if (response.code === 200) {
							proxy.$modal.msgSuccess("修改成功");
							open.value = false;
							getList();
						}
					});
				} else {
					addType(form.value).then((response: any) => {
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
	const handleDelete = (row: any) => {
		const dictIds = row.dictId || ids.value;
        if (row) {
            proxy.setTableRowSelected(pageTableRef, row, true);
        }
		const displayIds = displayIdArr(dictIds);
		// prettier-ignore
		proxy.$modal.confirm(`是否确认删除字典编号为 ${displayIds} 的数据项?`, "警告")
            .then(() => {
                return delType(dictIds);
            })
            .then((response: any) => {
                if (response.code === 200) {
                    getList();
                    proxy.$modal.msgSuccess("删除成功");
                }
            }).catch(() => {
                cleanSelect();
                console.log("取消了删除");
            });
	};
	/** 导出按钮操作 */
	const handleExport = () => {
		// prettier-ignore
		proxy.download('/system/dict/type/exportByStream', {...queryParams}, `字典信息${new Date().getTime()}.xlsx`);
	};

	/**
	 * 刷新缓存
	 */
	const handleRefreshCache = ()=> {
		refreshCache().then((response: any) => {
			if (response.code === 200) {
				proxy.$modal.msgSuccess(response.message);
			}
		});
	}

	/** 清理缓存按钮操作 */
	const handleClearCache = () => {
		clearCache().then((response: any) => {
			if (response.code === 200) {
				proxy.$modal.msgSuccess(response.message);
			}
		});
	};


    onMounted(() => {
		getList();
    	proxy.getDicts("sys_normal_disable").then((response: { code: number; data: any }) => {
        	if (response.code === 200) {
				statusOptions.value = response.data;
			}
    	});
	})

    // prettier-ignore
	return {
        loading, single, multiple, showSearch, total, typeList, title, open, statusOptions, queryParams, dateRange, form, formRef, queryFormRef, rules, 
        getList, cancel, handleQuery, resetQuery, handleSelectionChange, handleAdd, handleUpdate, updateStatus, submitForm, handleDelete, handleExport, 
        handleRefreshCache, handleClearCache, pageTableRef, cleanSelect
    };

};
