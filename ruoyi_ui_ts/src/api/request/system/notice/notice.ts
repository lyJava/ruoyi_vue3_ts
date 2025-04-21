import { displayIdArr, useComponentRef, useSafeInstance } from "@/utils/ruoyi";
// prettier-ignore
import { listNotice, getNotice, delNotice, addNotice, updateNotice, } from "@/api/system/notice";
import { ElForm, ElTable } from "element-plus";
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
	// 公告表格数据
	const noticeList = ref<any>();
	// 弹出层标题
	const title = ref<string>("");
	// 是否显示弹出层
	const open = ref<boolean>(false);
	// 类型数据字典
	const statusOptions = ref<any>();
	// 状态数据字典
	const typeOptions = ref<any>();
	// 查询参数
	const queryParams = ref<QueryParam>({
		pageNum: 1,
		pageSize: 10,
	});
	// 表单参数
	const form = ref<FormParam>({});
	// 表单ref
	const formRef = useComponentRef(ElForm);
	const queryFormRef = useComponentRef(ElForm);
    const pageTable = useComponentRef(ElTable);
	// 表单校验
	const rules = ref({
		noticeTitle: [
			{
				required: true,
				message: "公告标题不能为空",
				trigger: "blur",
			},
		],
		noticeType: [
			{
				required: true,
				message: "公告类型不能为空",
				trigger: "change",
			},
		],
	});

	/**
	 * 查询公告列表
	 */
	const getList = async () => {
		loading.value = true;
		await listNotice(queryParams.value).then((response: any) => {
			if (response.code === 200) {
				const data = response.data;
				noticeList.value = data.content;
				total.value = parseInt(data.records);
				loading.value = false;
			}
		});
	};
	/**
	 * 公告状态字典翻译
	 *
	 * @param row
	 * @returns
	 */
	const statusFormat = (row: any) => {
		return proxy.selectDictLabel(statusOptions.value, row.status);
	};
	/**
	 * 公告类型字典翻译
	 *
	 * @param row
	 * @returns
	 */
	const typeFormat = (row: any) => {
		return proxy.selectDictLabel(typeOptions.value, row.noticeType);
	};

    const cleanSelect = () => {
        proxy.cleanTableSelection(pageTable);
    };

	/**
	 * 取消按钮
	 */
	const cancel = () => {
		open.value = false;
		reset();
        pageTable.value?.clearSelection();
	};
	/**
	 * 表单重置
	 */
	const reset = () => {
		form.value = {
			noticeStatus: "0",
		};
		proxy.resetForm(formRef);
	};
	/**
	 * 搜索按钮操作
	 */
	const handleQuery = () => {
		queryParams.value.pageNum = 1;
		getList();
	};
	/**
	 * 重置按钮操作
	 */
	const resetQuery = () => {
		queryParams.value.noticeType = undefined;
		proxy.resetForm(queryFormRef);
		handleQuery();
	};
	/**
	 * 多选框选中数据
	 *
	 * @param selection
	 */
	const handleSelectionChange = (selection: any) => {
		ids.value = selection.map((item: any) => item.id);
		single.value = selection.length != 1;
		multiple.value = !selection.length;
	};
	/**
	 * 新增操作
	 */
	const handleAdd = () => {
		reset();
		open.value = true;
		title.value = "添加公告";
	};
	/** 修改按钮操作 */
	const handleUpdate = async (row: any) => {
		reset();
		const noticeId = row.id || ids.value;
		await getNotice(noticeId).then((response: any) => {
			if (response.code === 200) {
				form.value = response.data;
				title.value = "修改公告";
				proxy.setTableRowSelected(pageTable, row, true);
            	open.value = true;
			}
		});
	};
	/**
	 * 提交
	 */
	const submitForm = async () => {
		await formRef.value?.validate((valid) => {
			if (valid && form.value) {
				if (form.value.id) {
					updateNotice(form.value).then((response: any) => {
						if (response.code === 200) {
							proxy.$modal.msgSuccess("修改成功");
							open.value = false;
							getList();
						}
					});
				} else {
					addNotice(form.value).then((response: any) => {
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
		const noticeIds: string | string[] = row.id || ids.value;
        proxy.setTableRowSelected(pageTable, row, true);
		const displayIds = displayIdArr(noticeIds);
		// prettier-ignore
		proxy.$modal.confirm(`是否确认删除公告编号为 ${displayIds} 的数据项?`, "警告")
            .then(() =>{
                return delNotice(noticeIds);
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

	const loadSelectData = async ()=> {
		Promise.all([proxy.getDicts("sys_notice_status"), proxy.getDicts("sys_notice_type")]).then(([statusResponse, typeResponse]) => {
			if (statusResponse.code === 200) {
				statusOptions.value = statusResponse.data;
			}
			if (typeResponse.code === 200) {
				typeOptions.value = typeResponse.data;
			}
		}).catch(error => {
			console.error("请求失败:", error);
		});
	};

	onMounted(() => {
		loadSelectData();
		getList();
	});

	// prettier-ignore
	return {
        loading, single, multiple, showSearch, total, noticeList, title, open, statusOptions, typeOptions, queryParams, form, formRef, queryFormRef, 
        rules, getList, statusFormat, typeFormat, cancel, handleQuery, resetQuery, handleSelectionChange, handleAdd, handleUpdate, submitForm, 
        handleDelete, pageTable, cleanSelect, 
    }
};
