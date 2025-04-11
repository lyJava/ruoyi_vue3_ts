<template>
	<div class="app-container">
		<el-form
			:model="queryParams"
			ref="queryRef"
			:inline="true"
			v-show="showSearch"
		>
			<el-form-item label="表名称" prop="tableName">
				<el-input
					style="width: 240px;"
					v-model="queryParams.tableName"
					placeholder="请输入表名称"
					clearable
					@change="handleQuery"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="表描述" prop="tableComment">
				<el-input
					style="width: 240px;"
					v-model="queryParams.tableComment"
					placeholder="请输入表描述"
					clearable
                    @change="handleQuery"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="swagger注释" prop="swagger">
				<el-select
					style="width: 120px;"
					v-model="queryParams.swagger"
					placeholder="请选择"
					clearable
					@change="handleQuery"
				>
					<el-option label="否" value="0"></el-option>
					<el-option label="是" value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="excel注释" prop="excelExport">
				<el-select
					style="width: 120px;"
					v-model="queryParams.excelExport"
					placeholder="请选择"
					clearable
					@change="handleQuery"
				>
					<el-option label="否" value="0"></el-option>
					<el-option label="是" value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="vue版本" prop="vueVersion">
				<el-select
					style="width: 120px;"
					v-model="queryParams.vueVersion"
					placeholder="请选择"
					clearable
					@change="handleQuery"
				>
					<el-option label="vue2" value="2"></el-option>
					<el-option label="vue3" value="3"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="创建时间" style="width: 400px; font-weight: bold">
				<el-date-picker
					v-model="dateRange"
                    format="YYYY-MM-DD"
					value-format="YYYY-MM-DD"
					type="daterange"
					range-separator="-"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
                    @change="handleQuery"
				></el-date-picker>
			</el-form-item>
			<!-- prettier-ignore -->
			<form-search @reset="resetQuery" @search="handleQuery" />
		</el-form>

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button
					type="primary"
					plain
					icon="download"
					size="small"
					:disabled="genCodeEnabled"
					@click="handleGenTable"
					v-hasPermi="['tool:gen:code']"
					>生成</el-button
				>
			</el-col>
			<el-col :span="1.5">
				<el-button
					type="info"
					plain
					size="small"
					icon="upload"
					@click="openImportTable"
					v-hasPermi="['tool:gen:import']"
					>导入</el-button
				>
			</el-col>
            <el-col :span="1.5">
				<el-button
					type="primary"
					plain
					size="small"
					icon="switch"
					@click="switchEdit"
					>{{editTypeTitle}}</el-button
				>
			</el-col>
			<el-col :span="1.5" v-if="!single">
				<el-button
					type="success"
					plain
					size="small"
					icon="edit"
					:disabled="single"
					@click="handleEditTable"
					v-hasPermi="['tool:gen:edit']"
					>修改</el-button
				>
			</el-col>
			<el-col :span="1.5" v-if="!multiple">
				<el-button
					type="danger"
					plain
					size="small"
					icon="delete"
					:disabled="multiple"
					@click="handleDelete"
					v-hasPermi="['tool:gen:remove']"
					>删除</el-button
				>
			</el-col>
			<right-toolbar
				v-model:showSearch="showSearch"
				@queryTable="getPageList()"
			></right-toolbar>
		</el-row>

		<el-table
			ref="pageTableRef"
			stripe
			border
			v-loading="loading"
			:data="tableList"
			@selection-change="handleSelectionChange"
		>
			<el-table-column
				type="selection"
				align="center"
				width="55"
			></el-table-column>
			<el-table-column
				label="序号"
				type="index"
				width="100"
				align="center"
			>
				<template #default="scope">
					<!-- prettier-ignore -->
					<span>{{( (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1) }}</span>
				</template>
			</el-table-column>
			<el-table-column
				label="表名称"
				align="center"
				prop="tableName"
				:show-overflow-tooltip="true"
			/>
			<el-table-column
				label="表描述"
				align="center"
				prop="tableComment"
				:show-overflow-tooltip="true"
			/>
			<el-table-column
				label="实体"
				align="center"
				prop="className"
				:show-overflow-tooltip="true"
			/>
			<el-table-column
				v-if="false"
				label="swagger注释"
				align="left"
				prop="swagger"
				width="200"
			>
				<template #default="scope">
					<span>{{ scope.row.swagger ? "是" : "否" }}</span>
				</template>
			</el-table-column>
			<el-table-column
				header-align="center"
				align="center"
				prop="swagger"
				label="swagger注释"
			>
				<template #default="scope">
					<!-- prettier-ignore -->
                    <el-tooltip
                        class="box-item"
                        effect="light"
                        :content="scope.row.swagger === 1 ? '点击禁用' : '点击启用'"
                        placement="right"
                    >
                        <el-switch
                            v-model="scope.row.swagger"
                            class="mb-2"
                            :active-value="1"
                            :inactive-value="0"
                            style="--el-switch-on-color: #00CD00; --el-switch-off-color: #CDBA96"
                            @change="changeStatus($event, scope.row, 's')"
                        />
                    </el-tooltip>
				</template>
			</el-table-column>
			<el-table-column
				header-align="center"
				align="center"
				prop="excelExport"
				width="200"
				label="excel注释"
			>
				<!-- <template #default="scope">
					<span>{{ scope.row.excelExport === 0 ? "否" : "是" }}</span>
				</template> -->
				<!-- prettier-ignore -->
				<template #default="scope">
                    <el-tooltip
                        class="box-item"
                        effect="light"
                        :content="scope.row.excelExport === 1 ? '点击禁用' : '点击启用'"
                        placement="right"
                    >
                        <el-switch
                            v-model="scope.row.excelExport"
                            class="mb-2"
                            :active-value="1"
                            :inactive-value="0"
                            style="--el-switch-on-color: #00CD00; --el-switch-off-color: #CDBA96"
                            @change="changeStatus($event, scope.row, 'e')"
                        />
                    </el-tooltip>
                </template>
			</el-table-column>
			<el-table-column
				header-align="center"
				align="center"
				width="120"
				label="vue版本"
			>
				<template #default="scope">
					<el-select
						v-model="scope.row.vueVersion"
						@change="changeStatus($event, scope.row, 'v')"
					>
						<el-option label="2" value="2"></el-option>
						<el-option label="3" value="3"></el-option>
					</el-select>
				</template>
			</el-table-column>
			<el-table-column
				header-align="center"
				align="center"
				prop="remark"
				width="200"
				show-overflow-tooltip
				label="备注信息"
			>
			</el-table-column>
            <!-- dateTimeSub -->
			<el-table-column
				label="创建时间"
				align="center"
				prop="createTime"
				width="200"
			><template #default="scope">
                {{dateTimeSub(scope.row.createTime)}}
            </template>
            </el-table-column>
			<el-table-column
				label="更新时间"
				align="center"
				prop="updateTime"
				width="200"
			><template #default="scope">
                {{dateTimeSub(scope.row.updateTime)}}
            </template>
            </el-table-column>
			<el-table-column
				label="操作"
				align="center"
				width="400"
				class-name="small-padding fixed-width"
			>
				<template #default="scope">
					<el-link
						class="table_link_btn"
						:underline="false"
						type="primary"
						icon="View"
						@click="handlePreview(scope.row)"
						v-hasPermi="['tool:gen:preview']"
						><span class="table_link_text">预览</span></el-link
					>
					<el-link
						class="table_link_btn"
						:underline="false"
						type="primary"
						icon="Edit"
						@click="handleEditTable(scope.row)"
						v-hasPermi="['tool:gen:edit']"
						><span class="table_link_text">编辑</span></el-link
					>
					<el-link
						class="table_link_btn"
						:underline="false"
						type="primary"
						icon="Download"
						@click="handleGenTable(scope.row)"
						v-hasPermi="['tool:gen:code']"
						><span class="table_link_text">生成代码</span></el-link
					>
					<el-link
						class="table_link_btn"
						:underline="false"
						type="warning"
						icon="Refresh"
						@click="handleSynchDb(scope.row)"
						v-hasPermi="['tool:gen:edit']"
						><span class="table_link_text">同步</span></el-link
					>
					<el-link
						class="table_link_btn"
						:underline="false"
						type="danger"
						icon="Delete"
						@click="handleDelete(scope.row)"
						v-hasPermi="['tool:gen:remove']"
						><span class="table_link_text">删除</span></el-link
					>
				</template>
			</el-table-column>
		</el-table>
		<pagination
			v-show="total > 0"
			:total="total"
			v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize"
			@pagination="getPageList()"
		/>
		<!-- 预览界面 -->
		<el-dialog
			:title="preview.title"
			v-model="preview.open"
			width="80%"
			top="5vh"
			append-to-body
			custom-class="scrollbar"
            @close="viewCodeClose()"
		>
			<el-tabs v-model="preview.activeName" type="border-card">
				<!-- prettier-ignore -->
				<el-tab-pane
					v-for="(value, key) in preview.data"
					:label="key.toString().substring(key.toString().lastIndexOf('/') + 1,key.toString().indexOf('.vm'))"
					:name="key.toString().substring(key.toString().lastIndexOf('/') + 1,key.toString().indexOf('.vm'))"
					:key="value"
				>
					<el-link
						:underline="false"
						icon="documentCopy"
						v-copyText="value"
						v-copyText:callback="copyTextSuccess"
						style="float: right;margin-top: 30px;"
						>复制</el-link
					>
					<highlightjs :code="value"/>
				</el-tab-pane>
			</el-tabs>
		</el-dialog>
        <!-- prettier-ignore -->
		<import-table ref="importRef" @ok="handleQuery()" @cleanTableSelect="cleanSelect()"/>
        <!-- 弹窗编辑模式 -->
        <div class="div_dialog">
            <el-dialog
                title="编辑"
                v-model="editVisable"
                width="100%"
                @close="cleanSelect()"
                destroy-on-close
                custom-class="import-dialog"
            >
				<!-- prettier-ignore -->
                <edit-table ref="editTableRef" :tableId="tableId" @cleanTableSelect="cleanSelect()" @ok="handleQuery()"/>
                <template #footer>
                    <!-- prettier-ignore -->
                    <div class="dialog-footer" style="text-align: center;margin-top: -2vh;">
                        <el-button @click="editVisable = false">取 消</el-button>
                        <!-- prettier-ignore -->
                        <el-button type="primary" @click="submitChildForm()">确 定</el-button>
                    </div>
                </template>
            </el-dialog>
        </div>
	</div>
</template>

<script lang="ts" name="Gen" setup>
import importTable from "./importTable.vue";
import editTable from "./editTable.vue";
import Gen from "@/api/request/system/tool/gen";
// prettier-ignore
const {
    loading, queryRef, pageTableRef, showSearch, genCodeEnabled, single, multiple, total, tableList, dateRange,  queryParams, preview, getPageList,
    handleQuery, resetQuery, openImportTable, copyTextSuccess, handlePreview, handleSelectionChange, handleDelete, handleEditTable, editTableRef,
    handleGenTable, handleSynchDb, changeStatus, viewCodeClose, cleanSelect, editVisable, tableId, submitChildForm, switchEdit, editTypeTitle
} = Gen();
</script>
<style lang="scss" scoped>
pre {
	margin: -28px 0 0 0 !important;
	font-size: 1.2em !important;
	/* prettier-ignore */
	font-family: "Consolas", "Bitstream Vera Sans Mono", "Courier New", Courier, "Poppins", sans-serif, monospace !important;
}

.div_dialog{
    //弹出层的高度
    ::deep .el-dialog.import-dialog{
      height: auto;
      max-height: 50vh;
      overflow-y: auto;
    }
    //弹出层里内容的高度
    ::deep .el-dialog__body{
      max-height: 60vh!important;
    }
  }

</style>
