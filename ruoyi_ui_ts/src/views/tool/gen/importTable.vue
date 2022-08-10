<template>
	<!-- 导入表 -->
	<el-dialog
		title="导入表"
		v-model="visible"
		width="40%"
		top="5vh"
		append-to-body
        @close="celanParentTableSelect"
	>
		<el-form
			:model="queryParams"
			ref="queryForm"
			:inline="true"
			label-width="60px"
			label-position="left"
		>
			<el-form-item label="表名称" prop="tableName">
				<el-input
					v-model="queryParams.tableName"
					placeholder="请输入表名称"
					clearable
					style="width: 240px"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="表描述" prop="tableComment">
				<el-input
					v-model="queryParams.tableComment"
					placeholder="请输入表描述"
					clearable
					style="width: 240px"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<form-search @reset="resetQuery" @search="handleQuery" />
		</el-form>
		<el-row>
			<el-table
				stripe
				border
				height="520px"
				ref="tableRef"
				:data="dbTableList"
				@row-click="clickRow"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" width="60" />
				<el-table-column
					prop="tableName"
					label="表名称"
					:show-overflow-tooltip="true"
				/>
				<el-table-column
					prop="tableComment"
					label="表描述"
					:show-overflow-tooltip="true"
				/>
				<el-table-column
					prop="createTime"
					label="创建时间"
					width="200"
				/>
				<el-table-column
					prop="updateTime"
					label="更新时间"
					width="200"
				/>
			</el-table>
			<pagination
				v-show="total > 0"
				:total="total"
				v-model:page="queryParams.pageNum"
				v-model:limit="queryParams.pageSize"
				@pagination="getList"
			/>
		</el-row>
		<template #footer style="text-align: center;">
			<div class="dialog-footer">
				<el-button @click="visible = false">取 消</el-button>
				<!-- prettier-ignore -->
				<el-button type="primary" :disabled="okBtnEnabled" @click.native="handleImportTable()" >确 定</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="GenImportTable" setup>
import { ElForm, ElTable } from "element-plus";
import { reactive, ref, getCurrentInstance } from "vue";
import { listDbTable, importTable } from "@/api/tool/gen";
import FormSearch from "@/components/FormSearch/index.vue";
// import ImportTable from "@/api/request/system/tool/importTable";
// const  {
//     queryForm, tableRef, visible, total, dbTableList, okBtnEnabled, queryParams, clickRow, handleSelectionChange, handleQuery, resetQuery,
//     getList, handleImportTable,
// } = ImportTable();


// 避免出现 Vue3警告：[Vue warn]: Extraneous non-emits event listeners (changeParentProps) were passed to component
// https://blog.csdn.net/weixin_47339511/article/details/118530865

const queryForm = ref<InstanceType<typeof ElForm>>();
// 表格
const tableRef = ref<InstanceType<typeof ElTable>>();
const visible = ref<boolean>(false);
// 选中数组值
const tables = ref<any>();
// 总条数
const total = ref<number>(0);
// 表数据
const dbTableList = ref<any>();
// 确定按钮可用
const okBtnEnabled = ref<boolean>(true);
// 查询参数
const queryParams = reactive<any>({
	pageNum: 1,
	pageSize: 10,
	tableName: undefined,
	tableComment: undefined,
});

const emit = defineEmits(["ok", "cleanTableSelect"]);

const { proxy } = getCurrentInstance() as any;

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
		console.log("selection", selection, dbTableList.value);
		return;
	}

	tables.value = selection.map((item: { tableName: any }) => item.tableName);
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
	//proxy.resetForm("queryForm");
	queryForm.value?.resetFields();
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

// 调用父类方法
const celanParentTableSelect = () => {
    emit("cleanTableSelect");
};

// 暴露方法
defineExpose({
	show,
});
</script>
