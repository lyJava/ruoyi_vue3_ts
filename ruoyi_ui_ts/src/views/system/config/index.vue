<template>
	<div class="app-container">
		<el-form
			:model="queryParams"
			ref="queryFormRef"
			:inline="true"
			v-show="showSearch"
			label-width="70px"
		>
			<el-form-item label="参数名称" prop="configName">
				<el-input
					style="width: 240px;"
					v-model="queryParams.configName"
					placeholder="请输入参数名称"
					clearable
					@clear="handleQuery"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="参数键名" prop="configKey">
				<el-input
					style="width: 240px;"
					v-model="queryParams.configKey"
					placeholder="请输入参数键名"
					clearable
					@clear="handleQuery"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="系统内置" prop="configType">
				<el-select
					style="width: 200px;"
					v-model="queryParams.configType"
					placeholder="请选择"
					clearable
					@change="handleQuery"
				>
					<el-option
						v-for="dict in typeOptions"
						:key="dict.dictValue"
						:label="dict.dictLabel"
						:value="dict.dictValue"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="创建时间" style="font-weight: bold">
				<el-date-picker
					v-model="dateRange"
					style="width: 240px"
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
					v-hasPermi="['system:config:add']"
					>新增</el-button
				>
			</el-col>
            <el-col :span="1.5">
				<el-button
					type="warning"
					plain
					icon="download"
					size="small"
					@click="handleExport"
					v-hasPermi="['system:config:export']"
					>导出</el-button
				>
			</el-col>
			<el-col :span="1.5">
				<el-button
					type="danger"
					plain
					icon="refresh"
					size="small"
					@click="handleClearCache"
					v-hasPermi="['system:config:remove']"
					>清理缓存</el-button
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
					v-hasPermi="['system:config:edit']"
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
					v-hasPermi="['system:config:remove']"
					>删除</el-button
				>
			</el-col>
			<!-- prettier-ignore -->
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
		</el-row>

		<el-table
			stripe
			border
			height="560px"
			v-loading="loading"
			ref="pageTableRef"
			:data="configList"
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column
				label="参数主键"
				align="center"
				prop="id"
				width="80"
			/>
			<el-table-column
				label="参数名称"
				align="center"
				width="300"
				prop="configName"
				:show-overflow-tooltip="true"
			/>
			<el-table-column
				label="参数键名"
				align="center"
				width="300"
				prop="configKey"
				:show-overflow-tooltip="true"
			/>
			<el-table-column
				label="参数键值"
				align="center"
				width="200"
				prop="configValue"
			/>
			<el-table-column
				label="系统内置"
				width="150"
				align="center"
				prop="configType"
				:formatter="typeFormat"
			/>
			<el-table-column
				label="备注"
				align="center"
				prop="remark"
				:show-overflow-tooltip="true"
			/>
			<el-table-column
				label="创建时间"
				align="center"
				prop="createTime"
				width="200"
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
				width="200"
				class-name="small-padding fixed-width"
			>
				<template #default="scope">
					<el-link
						class="table_link_btn"
						:underline="false"
						type="primary"
						icon="edit"
						@click="handleUpdate(scope.row)"
						v-hasPermi="['system:config:edit']"
						><span class="table_link_text">修改</span></el-link
					>
					<el-link
						class="table_link_btn"
						:underline="false"
						size="small"
						type="danger"
						icon="delete"
						@click="handleDelete(scope.row)"
						v-hasPermi="['system:config:remove']"
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
			@pagination="getList()"
		/>

		<!-- 添加或修改参数配置对话框 -->
		<el-dialog
			:title="title"
			v-model="open"
			width="30%"
			append-to-body
			@close="cleanSelect()"
		>
			<el-form
				ref="formRef"
				:model="form"
				:rules="rules"
				label-width="80px"
			>
				<el-form-item label="参数名称" prop="configName">
					<el-input
						v-model="form.configName"
						placeholder="请输入参数名称"
					/>
				</el-form-item>
				<el-form-item label="参数键名" prop="configKey">
					<el-input
						v-model="form.configKey"
						placeholder="请输入参数键名"
					/>
				</el-form-item>
				<el-form-item label="参数键值" prop="configValue">
					<el-input
						v-model="form.configValue"
						placeholder="请输入参数键值"
					/>
				</el-form-item>
				<el-form-item label="系统内置" prop="configType">
					<el-radio-group v-model="form.configType">
						<el-radio
							v-for="dict in typeOptions"
							:key="dict.dictValue"
							:value="dict.dictValue"
							>{{ dict.dictLabel }}</el-radio
						>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input
						v-model="form.remark"
						type="textarea"
						placeholder="请输入内容"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<!-- prettier-ignore -->
					<el-button type="primary" @click="submitForm">确 定</el-button>
					<el-button @click="cancel">取 消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="Config" setup>
import Config from "@/api/request/system/config";
// prettier-ignore
const {
    loading, single, multiple, open, showSearch, total, configList, title, typeOptions, dateRange, queryParams, queryFormRef, form, formRef, rules, 
    getList, typeFormat, cancel,handleQuery, resetQuery, handleAdd, handleSelectionChange, handleUpdate, submitForm, handleDelete, handleExport, 
    handleClearCache, pageTableRef, cleanSelect, 
} = Config();
</script>
