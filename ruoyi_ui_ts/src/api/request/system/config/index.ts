// prettier-ignore
import { listConfig, getConfig, delConfig, addConfig, updateConfig, exportConfig, clearCache } from "@/api/system/config";
import { ElForm, ElTable } from "element-plus";
import { displayIdArr, useComponentRef, useSafeInstance } from "@/utils/ruoyi";
import { FormParam, QueryParam } from "./types";

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
	// 参数表格数据
	const configList = ref<any>();
	// 弹出层标题
	const title = ref<string>("");
	// 是否显示弹出层
	const open = ref<boolean>(false);
	// 类型数据字典
	const typeOptions = ref<any>();
	// 日期范围
	const dateRange = ref<any>();
	// 查询参数
	const queryParams = ref<QueryParam>({
		pageNum: 1,
		pageSize: 10,
	});
	const queryFormRef = useComponentRef(ElForm);
	// 表单参数
	const form = ref<FormParam>({});
	const formRef = useComponentRef(ElForm);
    const pageTableRef = useComponentRef(ElTable);
	// 表单校验
	const rules = ref({
		configName: [
			{
				required: true,
				message: "参数名称不能为空",
				trigger: "blur",
			},
		],
		configKey: [
			{
				required: true,
				message: "参数键名不能为空",
				trigger: "blur",
			},
		],
		configValue: [
			{
				required: true,
				message: "参数键值不能为空",
				trigger: "blur",
			},
		],
	});

	/** 查询参数列表 */
	const getList = () => {
		loading.value = true;
		// prettier-ignore
		listConfig(proxy.addDateRange(queryParams.value, dateRange.value)).then((response: any) => {
				if (response.code === 200) {
					const data = response.data;
					configList.value = data.content;
					total.value = parseInt(data.records);
					loading.value = false;
				}
			});
	};
	// 参数系统内置字典翻译
	const typeFormat = (row: any, column: any) => {
		return proxy.selectDictLabel(typeOptions.value, row.configType);
	};
    const cleanSelect = () => {
        pageTableRef.value?.clearSelection();
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
			configType: "Y",
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
		title.value = "添加参数";
        open.value = true;
	};
	// 多选框选中数据
	const handleSelectionChange = (selection: any) => {
		ids.value = selection.map((item: any) => item.id);
		single.value = selection.length != 1;
		multiple.value = !selection.length;
	};
	/** 修改按钮操作 */
	const handleUpdate = (row: any) => {
		reset();
		const configId: string | string[] = row.id || ids.value;
		getConfig(configId).then((response: any) => {
			if (response.code === 200) {
				form.value = response.data;
				title.value = "修改参数";
			}
		}).finally(()=> {
			proxy.setTableRowSelected(pageTableRef, row, true);
			open.value = true;
		});
	};
	/** 提交按钮 */
	const submitForm = async () => {
		await formRef.value?.validate((valid: boolean) => {
			if (valid && form.value) {
				if (form.value.id) {
					updateConfig(form.value).then((response: any) => {
						if (response.code === 200) {
							proxy.$modal.msgSuccess("修改成功");
							open.value = false;
							getList();
						}
					});
				} else {
					addConfig(form.value).then((response: any) => {
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
		const configIds: string | string[] = row.id || ids.value;
        proxy.setTableRowSelected(pageTableRef, row, true);
		const displayIds = displayIdArr(configIds);
		// prettier-ignore
		proxy.$modal.confirm(`是否确认删除参数编号为 ${displayIds} 的数据项?`, "警告")
            .then(() =>{
                return delConfig(configIds);
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
	/** 导出按钮操作 */
	const handleExport = () => {
		// prettier-ignore
		proxy.download('/system/config/exportByStream', {...queryParams}, `参数配置${new Date().getTime()}.xlsx`);
	};
	/** 清理缓存按钮操作 */
	const handleClearCache = () => {
		clearCache().then((response: any) => {
            if (response.code === 200) {
                proxy.$modal.msgSuccess("清理成功");
            }
		});
	};

    onMounted(() => {
        getList();
		proxy.getDicts("sys_yes_no").then((response: any) => {
            if (response.code === 200) {
                typeOptions.value = response.data;
            }
		});
    });

    // prettier-ignore
    return {
        loading, single, multiple, open, showSearch, total, configList, title, typeOptions, dateRange, queryParams, queryFormRef, form, formRef, rules, 
        getList, typeFormat, cancel, reset, handleQuery, resetQuery, handleAdd, handleSelectionChange, handleUpdate, submitForm, handleDelete, 
        handleExport, handleClearCache, pageTableRef, cleanSelect, 
    };
};
