<template>
	<div class="app-container">
		<el-form
			:model="queryParams"
			ref="queryFormRef"
			:inline="true"
			v-show="showSearch"
			label-width="70px"
		>
			<el-form-item label="字典名称" prop="dictType">
				<el-select
					style="width: 240px;"
					v-model="queryParams.dictType"
					placeholder="请选择"
					clearable
                    filterable
                    @change="handleQuery"
				>
					<el-option
						v-for="item in typeOptions"
						:key="item.dictId"
						:label="item.dictName"
						:value="item.dictType"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="字典标签" prop="dictLabel">
				<el-input
					v-model="queryParams.dictLabel"
					placeholder="请输入字典标签"
					clearable
					@clear="handleQuery"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="状态" prop="dictStatus">
				<el-select
					style="width: 150px;"
					v-model="queryParams.dictStatus"
					placeholder="状态"
					clearable
                    @change="handleQuery"
				>
					<el-option
						v-for="dict in statusOptions"
						:key="dict.dictValue"
						:label="dict.dictLabel"
						:value="dict.dictValue"
					/>
				</el-select>
			</el-form-item>
            <el-form-item label="创建时间" style="font-weight: bold;">
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
					icon="plus"
					size="small"
					@click="handleAdd"
					v-hasPermi="['system:dict:add']"
					>新增</el-button
				>
			</el-col>
			<el-col :span="1.5" v-if="!single">
				<el-button
					type="success"
					plain
					icon="edit"
					size="small"
					:disabled="single"
					@click="handleUpdate"
					v-hasPermi="['system:dict:edit']"
					>修改</el-button
				>
			</el-col>
			<el-col :span="1.5" v-if="!multiple">
				<el-button
					type="danger"
					plain
					icon="delete"
					size="small"
					:disabled="multiple"
					@click="handleDelete"
					v-hasPermi="['system:dict:remove']"
					>删除</el-button
				>
			</el-col>
			<el-col :span="1.5">
				<el-button
					type="warning"
					plain
					icon="download"
					size="small"
					@click="handleExport"
					v-hasPermi="['system:dict:export']"
					>导出</el-button
				>
			</el-col>
			<el-col :span="1.5">
				<el-button
					type="warning"
					plain
					icon="close"
					size="small"
					@click="handleClose"
					>关闭</el-button>
			</el-col>
			<!-- prettier-ignore -->
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
		</el-row>

		<el-table
			border
            stripe
			v-loading="loading"
            ref="pageTableRef"
			:data="dataList"
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="字典ID" align="center" prop="id" width="100"/>
			<el-table-column label="字典编码" align="center" prop="dictType" width="200"/>
			<el-table-column label="字典标签" align="center" prop="dictLabel" width="250">
				<template #default="scope">
					<!-- prettier-ignore -->
					<span v-if="scope.row.listClass == '' || scope.row.listClass == 'info'">{{ scope.row.dictLabel }}</span>
					<!-- prettier-ignore -->
					<el-tag v-else :type="scope.row.listClass == 'primary' ? 'info' : scope.row.listClass">{{ scope.row.dictLabel }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="字典键值" align="center" prop="dictValue" />
			<el-table-column label="字典排序" align="center" prop="dictSort" />
			<el-table-column
				label="启用/停用状态"
				align="center"
				prop="dictStatus"
				:formatter="statusFormat"
			/>
			<el-table-column
				label="备注"
				align="center"
				prop="remarks"
				:show-overflow-tooltip="true"
			/>
			<el-table-column
				label="创建时间"
				align="center"
				prop="createTime"
				width="300"
			>
				<template #default="scope">
					<span>{{ dateTimeSub(scope.row.createTime) }}</span>
				</template>
			</el-table-column>
			<el-table-column label="修改时间" align="center" prop="updateTime" width="300">
				<template #default="scope">
					<span>{{ dateTimeSub(scope.row.updateTime) }}</span>
				</template>
			</el-table-column>
			<el-table-column
				label="操作"
				align="center"
				fixed="right"
                width="250"
				class-name="small-padding fixed-width"
			>
				<template #default="scope">
					<el-link
						class="table_link_btn"
						:underline="false"
						size="small"
						type="primary"
						icon="edit"
						@click="handleUpdate(scope.row)"
						v-hasPermi="['system:dict:edit']"
						><span class="table_link_text">修改</span></el-link
					>
					<el-link
						class="table_link_btn"
						:underline="false"
						size="small"
						type="danger"
						icon="delete"
						@click="handleDelete(scope.row)"
						v-hasPermi="['system:dict:remove']"
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
			@pagination="getList"
		/>

		<!-- 添加或修改参数配置对话框 -->
		<el-dialog :title="title" v-model="open" width="500px" append-to-body @close="cleanSelect">
			<el-form
				ref="formRef"
				:model="form"
				:rules="rules"
				label-width="80px"
			>
				<el-form-item label="字典类型">
					<el-input v-model="form.dictType" :disabled="true" />
				</el-form-item>
				<el-form-item label="数据标签" prop="dictLabel">
					<el-input
						v-model="form.dictLabel"
						placeholder="请输入数据标签"
					/>
				</el-form-item>
				<el-form-item label="数据键值" prop="dictValue">
					<el-input
						v-model="form.dictValue"
						placeholder="请输入数据键值"
					/>
				</el-form-item>
				<el-form-item label="显示排序" prop="dictSort">
					<el-input-number
						v-model="form.dictSort"
						controls-position="right"
						:min="0"
					/>
				</el-form-item>
				<el-form-item label="状态" prop="dictStatus">
					<el-radio-group v-model="form.dictStatus">
						<el-radio
							v-for="dict in statusOptions"
							:key="dict.dictValue"
							:value="dict.dictValue"
							>{{ dict.dictLabel }}</el-radio
						>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input
						v-model="form.remarks"
						type="textarea"
						placeholder="请输入内容"
					></el-input>
				</el-form-item>
			</el-form>
            <template #footer>
                <div class="dialog-footer">
				<!-- prettier-ignore -->
				<el-button type="primary" @click="submitForm">确 定</el-button>
				<el-button @click="cancel()">取 消</el-button>
			</div>
            </template>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="Data" setup>
import Data from "@/api/request/system/dict/data";
// prettier-ignore
const {
    loading, single, multiple, showSearch, total, dataList, title, open, statusOptions, typeOptions, dateRange, queryParams, form, formRef, 
    queryFormRef, rules, pageTableRef, getList, statusFormat, cancel, handleQuery, resetQuery, handleSelectionChange, handleAdd, handleUpdate, 
    submitForm, handleDelete, handleExport, handleClose, cleanSelect, 
} = Data();
</script>
