import router from "@/router";
import { ElForm, ElTable } from "element-plus";
// prettier-ignore
import { listTable, previewTable, delTable, genCode, synchDb, updateStatusOrVersion, } from "@/api/tool/gen";

export default () => {
	const route = useRoute();
	const proxy = useSafeInstance();
	const queryRef = useComponentRef(ElForm);
	const pageTableRef = useComponentRef(ElTable);
	const loading = ref<boolean>(true);
	const showSearch = ref<boolean>(true);
	const ids = ref<any>();
	const genCodeEnabled = ref<boolean>(true);
	const single = ref<boolean>(true);
	const multiple = ref<boolean>(true);
	const total = ref<number>(0);
	const tableList = ref<any>([]);
	const tableNames = ref<any>();
	const dateRange = ref<any>();
	const uniqueId = ref<any>();
	const data = reactive({
		queryParams: {
			pageNum: 1,
			pageSize: 10,
			tableName: undefined,
			tableComment: undefined,
		},
		preview: {
			open: false,
			title: "代码预览",
			data: {},
			activeName: "domain.java",
		},
	});

	const { queryParams, preview } = toRefs(data) as any;
    // 编辑table
    const editVisable = ref<boolean>(false);
    const tableId = ref<string>("");
    const editTableRef = ref<any>();
    const editTypeTitle = ref<string>("弹窗模式");

	onActivated(() => {
		const time = route.query.t;
		if (time != null && time != uniqueId.value) {
			uniqueId.value = time;
			queryParams.value.pageNum = Number(route.query.pageNum);
			dateRange.value = [];
			proxy.resetForm(queryRef);
			getPageList();
		}
	});

	const cleanSelect = () => {
		pageTableRef.value?.clearSelection();
	};

    // prettier-ignore
	watch(() => router.currentRoute.value.path,(newValue, oldValue) => {
			console.log("watch", newValue);
            // 路由变化清空选中
            cleanSelect();
		},
		{ immediate: true }
	);

	/** 查询表集合 */
	const getPageList = async () => {
		loading.value = true;
		// prettier-ignore
		const data = proxy.addDateRange(queryParams.value, dateRange.value);
		console.log("转换后的参数---", data);
		await listTable(data).then((response: any) => {
			tableList.value = response.rows;
			total.value = parseInt(response.total);
		}).finally(() => {
            loading.value = false;
        });
	};
	/** 搜索按钮操作 */
	const handleQuery = () => {
		queryParams.value.pageNum = 1;
		getPageList();
	};
	/** 生成代码操作 */
	// prettier-ignore
	const handleGenTable = async (row: any) => {
		const tbNames = row.tableName || tableNames.value;
		if (tbNames == "") {
			proxy.$modal.msgError("请选择要生成的数据");
			return;
		} else {
            if (row.genType === "1") {
                await genCode(row.tableName).then((response: any) => {
                    if (response.code === 200) {
                        proxy.$modal.msgSuccess("成功生成到自定义路径：" + row.genPath);
                    }
                });
            } else {
                // prettier-ignore
                const zipName = `"ruoyi"${new Date().getTime()}`;
                await proxy.$download.zip(`/tool/gen/batchGenCode?tables="${tbNames}, ${zipName}`);
                proxy.$modal.msgSuccess(`成功生成代码：${zipName}.zip,包括的表【${tbNames}】`);
                console.log("生成代码文件%s.zip成功", zipName);
            }
        }
	};
	/** 同步数据库操作 */
	const handleSynchDb = async (row: { tableName: any }) => {
        proxy.setTableRowSelected(pageTableRef, row, true);
		const tableName = row.tableName;
		// prettier-ignore
		await proxy.$modal.confirm(`确认要强制同步${tableName}"表结构吗？`)
			.then(() => {
				return synchDb(tableName);
			})
			.then((response: any) => {
				if (response.code === 200) {
					proxy.$modal.msgSuccess("同步成功");
				}
			})
			.catch(() => {
                cleanSelect();
				console.log("取消了同步");
			});
	};
	/** 打开导入表弹窗 */
	const openImportTable = () => {
		proxy.$refs["importRef"].show();
	};
	/** 重置按钮操作 */
	const resetQuery = () => {
		dateRange.value = [];
		proxy.resetForm(queryRef);
		handleQuery();
	};
	/** 预览按钮 */
	const handlePreview = async (row: { tableId: string }) => {
        proxy.setTableRowSelected(pageTableRef, row, true);
		await previewTable(row.tableId).then((response: any) => {
			if (response.code === 200) {
				preview.value.data = response.data;
				preview.value.activeName = "domain.java";
				preview.value.open = true;
			}
		});
	};
	/** 复制代码成功 */
	const copyTextSuccess = () => {
		proxy.$modal.msgSuccess("复制成功");
	};
	// 多选框选中数据
	const handleSelectionChange = (selection: any) => {
		ids.value = selection.map((item: { tableId: any }) => item.tableId);
		tableNames.value = selection.map(
			(item: { tableName: any }) => item.tableName
		);
		single.value = selection.length != 1;
		multiple.value = !selection.length;
		genCodeEnabled.value = !selection.length;
        tableId.value = ids.value[0];
	};

	/** 修改按钮操作 */
	const handleEditTable = (row?: any) => {
        tableId.value = row.tableId || ids.value[0];
        if (row) {
            proxy.setTableRowSelected(pageTableRef, row, true);
        }
        if (editTypeTitle.value === "弹窗模式") {
            nextTick(() => {
                editTableRef.value.initTabsData(tableId.value);
            });
            editVisable.value = true;
        } else if (editTypeTitle.value === "页面模式") {
            // prettier-ignore
            router.push({path: `/tool/gen-edit/index/${tableId.value}`, query: { pageNum: queryParams.value.pageNum }});
        }
	};

	/** 删除按钮操作 */
	const handleDelete = async (row: any) => {
		const tableIds = row.tableId || ids.value;
        if (row) {
            proxy.setTableRowSelected(pageTableRef, row, true);
        }
		// prettier-ignore
		await proxy.$modal.confirm(`是否确认删除表编号为${tableIds}的数据项？`)
			.then(() => {
				return delTable(tableIds);
			})
			.then((response: any) => {
				if (response.code === 200) {
					proxy.$modal.msgSuccess("删除成功");
					getPageList();
				}
			})
			.catch(() => {
                cleanSelect();
				console.log("取消了删除");
			});
	};

	/**
	 * 修改注释状态或版本信息
	 *
	 * @param val 选中的值
	 * @param row 行信息
	 * @param e   类型
	 */
	const changeStatus = async (val: any, row: any, e: string) => {
		if (e === "v") {
			await updateStatusOrVersion(e, row.tableId, val).then(
				(response: any) => {
					if (response.code === 200) {
						proxy.$modal.msgSuccess(response.msg);
						getPageList();
					}
				}
			);
		} else {
			const text = val === 0 ? "启用" : "停用";
			const info = e === "s" ? "swagger" : "excel";
			// prettier-ignore
			await proxy.$modal.confirm(`确认要${text}${row.tableName}的${info}注释吗?`, "警告")
                .then(() => {
                    return updateStatusOrVersion(e, row.tableId, val);
                })
                .then((response: any) => {
                    if (response.code === 200) {
                        proxy.$modal.msgSuccess(response.msg);
                        getPageList();
                    }
                })
                .catch(() => {
                    e === "s" ? row.swagger = row.swagger === 1 ? 0 : 1 : row.excelExport = row.excelExport === 1 ? 0 : 1;
                });
		}
	};

    const viewCodeClose = () => {
        preview.value.open = false;
        cleanSelect();
    };

    const submitChildForm  = () => {
        editTableRef?.value.submitForm();
        editVisable.value = false;
    };

    const switchEdit = () => {
        if (editTypeTitle.value === "弹窗模式") {
            editTypeTitle.value = "页面模式";
        } else {
            editTypeTitle.value = "弹窗模式";
        }
    };

	onMounted(() => {
		getPageList();
	});

	// prettier-ignore
	return {
        loading, queryRef, pageTableRef, showSearch, genCodeEnabled, single, multiple, total, tableList, dateRange, tableNames, uniqueId, data,
        queryParams, preview, getPageList, handleQuery, resetQuery, openImportTable, copyTextSuccess, handlePreview, handleSelectionChange,
        handleDelete, handleEditTable, handleGenTable, handleSynchDb, changeStatus, cleanSelect, viewCodeClose, editVisable, tableId, editTableRef,
        submitChildForm, switchEdit, editTypeTitle
    }
};
