import importTable from "@/views/tool/gen/importTable.vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { ElDialog, ElForm, ElTable } from "element-plus";
// prettier-ignore
import { getCurrentInstance, ref, reactive, toRefs, onActivated, } from "vue";
// prettier-ignore
import { listTable, previewTable, delTable, genCode, synchDb, updateStausOrVersion, } from "@/api/tool/gen";

export default () => {
	const route = useRoute();
	const { proxy } = getCurrentInstance() as any;
	const queryRef = ref<InstanceType<typeof ElForm>>();
	const tableRef = ref<InstanceType<typeof ElTable>>();
	const importRef = ref<InstanceType<typeof ElDialog>>();
	const loading = ref<boolean>(true);
	const showSearch = ref<boolean>(true);
	const ids = ref<any>();
	const genCodeEnabled = ref<boolean>(true);
	const single = ref<boolean>(true);
	const multiple = ref<boolean>(true);
	const total = ref<number>(0);
	const tableList = ref<any>();
	const tableNames = ref<any>();
	const dateRange = ref<any>();
	const uniqueId = ref<any>("");
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

	/** 查询表集合 */
	const getPageList = async () => {
		loading.value = true;
		// prettier-ignore
		await listTable(proxy.addDateRange(queryParams.value, dateRange.value)).then((response: any) => {
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
		}
		if (row.genType === "1") {
			await genCode(row.tableName).then((response) => {
				proxy.$modal.msgSuccess("成功生成到自定义路径：" + row.genPath);
			});
		} else {
            // prettier-ignore
            const zipName = "ruoyi" + new Date().getTime();
			await proxy.$download.zip("/tool/gen/batchGenCode?tables=" + tbNames, zipName);
            console.log("生成代码文件%s"+".zip成功", zipName);
		}
	};
	/** 同步数据库操作 */
	const handleSynchDb = async (row: { tableName: any }) => {
		const tableName = row.tableName;
		// prettier-ignore
		await proxy.$modal.confirm('确认要强制同步"' + tableName + '"表结构吗？')
			.then(() => {
				return synchDb(tableName);
			})
			.then((response: any) => {
				if (response.code === 200) {
					proxy.$modal.msgSuccess("同步成功");
				}
			})
			.catch(() => {
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
	};
	/** 修改按钮操作 */
	const handleEditTable = (id: any) => {
		const tableId = id || ids.value[0];
		// prettier-ignore
		router.push({path: "/tool/gen-edit/index/" + tableId, query: { pageNum: queryParams.value.pageNum }});
	};
	/** 删除按钮操作 */
	const handleDelete = async (row: any) => {
		const tableIds = row.tableId || ids.value;
        // prettier-ignore
		await proxy.$modal.confirm('是否确认删除表编号为"' + tableIds + '"的数据项？')
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
			await updateStausOrVersion(e, row.tableId, val).then((response: any) => {
				if (response.code === 200) {
					proxy.$modal.msgSuccess(response.msg);
					getPageList();
				}
			});
		} else {
			const text = val === 0 ? "启用" : "停用";
			const info = e === "s" ? "swagger" : "excel";
			// prettier-ignore
			await proxy.$confirm(
                    "确认要" + text + row.tableName + '"的' + info + "注释吗?", "警告",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                )
                .then(() => {
                    return updateStausOrVersion(e, row.tableId, val);
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

	getPageList();

	// prettier-ignore
	return {
        loading, queryRef, tableRef, showSearch, genCodeEnabled, single, multiple, total, tableList, dateRange, tableNames, uniqueId, data, 
        queryParams, preview,getPageList, handleQuery, resetQuery, openImportTable, copyTextSuccess, handlePreview, handleSelectionChange, 
        handleDelete, handleEditTable, handleGenTable, handleSynchDb, changeStatus
    }
};
