import { ElForm, ElTable } from "element-plus";
import { listDbTable, importTable } from "@/api/tool/gen";

export default () => {
	// 避免出现 Vue3警告：[Vue warn]: Extraneous non-emits event listeners (changeParentProps) were passed to component
	// https://blog.csdn.net/weixin_47339511/article/details/118530865

	const queryForm = useComponentRef(ElForm);
	// 表格
	const tableRef = useComponentRef(ElTable);
	const visible = ref<boolean>(false);
	// 选中数组值
	const tables = ref<any>([]);
	// 总条数
	const total = ref<number>(0);
	// 表数据
	const dbTableList = ref<any>([]);
	// 确定按钮可用
	const okBtnEnabled = ref<boolean>(true);
	// 查询参数
	const queryParams = reactive<any>({
		pageNum: 1,
		pageSize: 10,
		tableName: undefined,
		tableComment: undefined,
	});
	const emit = defineEmits(["ok"]);
	const proxy = useSafeInstance();
	// 显示弹框
	const show = () => {
		visible.value = true;
		getList();
	};
	const clickRow = (row: any) => {
		tableRef.value?.toggleRowSelection(row, true);
	};
	// 多选框选中数据
	const handleSelectionChange = (selection: any) => {
		if (selection == null) {
			return;
		}

		tables.value = selection.map(
			(item: { tableName: any }) => item.tableName
		);
		if (tables.value && tables.value.length > 0) {
			okBtnEnabled.value = false;
		} else {
			okBtnEnabled.value = true;
		}
	};
	// 查询表数据
	const getList = () => {
		listDbTable(queryParams).then((res: any) => {
			if (res.code === 200) {
				dbTableList.value = res.rows;
				total.value = parseInt(res.total);
			}
		});
	};
	/** 搜索按钮操作 */
	const handleQuery = () => {
		queryParams.pageNum = 1;
		getList();
	};
	/** 重置按钮操作 */
	const resetQuery = () => {
		proxy.resetForm(queryForm);
		//queryForm.value?.resetFields();
		handleQuery();
	};

	/** 导入按钮操作 */
	const handleImportTable = async () => {
		const tabs = tables.value.join(",");
		if (tabs) {
			await importTable({ tables: tabs }).then((res: any) => {
				if (res.code === 200) {
					proxy.$modal.msgSuccess(res.msg);
					tables.value = [];
					emit("ok");
					visible.value = false;
				}
			});
		} else {
			console.log("tabls", tabs.length);
			// prettier-ignore
			proxy.$message.error(`请勾选需要导入的表后再提交!`);
			return false;
		}
	};

	defineExpose({
		show,
	});

	// prettier-ignore
	return {
        queryForm, tableRef, visible, total, dbTableList, okBtnEnabled, queryParams, clickRow, handleSelectionChange, handleQuery, resetQuery,
        getList, handleImportTable,
    }
};
