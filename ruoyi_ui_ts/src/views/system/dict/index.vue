<template>
	<div class="app-container">
		<el-form
			:model="queryParams"
			ref="queryFormRef"
			:inline="true"
			v-show="showSearch"
			label-width="70px"
		>
			<el-form-item label="字典名称" prop="dictName">
				<el-input
					style="width: 240px"
					v-model="queryParams.dictName"
					placeholder="请输入字典名称"
					clearable
					@clear="handleQuery"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="字典类型" prop="dictType">
				<el-input
					style="width: 240px"
					v-model="queryParams.dictType"
					placeholder="请输入字典类型"
					clearable
					@clear="handleQuery"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-select
					v-model="queryParams.status"
					placeholder="字典状态"
					clearable
					@change="handleQuery"
					style="width: 240px"
				>
					<el-option
						v-for="dict in statusOptions"
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
					v-hasPermi="['system:dict:add']"
					>新增</el-button
				>
			</el-col>
			<el-col :span="1.5">
				<el-button
					type="success"
					plain
					icon="refresh"
					size="small"
					@click="handleRefreshCache"
					v-hasPermi="['system:dict:remove']"
					>刷新缓存</el-button
				>
			</el-col>
			<el-col :span="1.5">
				<el-button
					type="danger"
					plain
					icon="delete"
					size="small"
					@click="handleClearCache"
					v-hasPermi="['system:dict:remove']"
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
					v-hasPermi="['system:dict:edit']"
					>修改</el-button
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
			<!-- prettier-ignore -->
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
		</el-row>

		<el-table
			stripe
			border
			height="560px"
			v-loading="loading"
            ref="pageTableRef"
			:data="typeList"
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="字典编号" align="center" prop="dictId" width="120"/>
			<el-table-column
				label="字典名称"
				align="center"
				prop="dictName"
				:show-overflow-tooltip="true"
			/>
			<el-table-column
				label="字典类型"
				align="center"
				:show-overflow-tooltip="true"
			>
				<template #default="scope">
					<router-link
						:to="'/system/dict-data/index/' + scope.row.dictId"
						class="link-type"
					>
						<span>{{ scope.row.dictType }}</span>
					</router-link>
				</template>
			</el-table-column>
			<el-table-column
				label="状态"
				align="center"
				prop="status"
                width="250"
			>
				<template #default="scope">
					<!-- prettier-ignore -->
					<!-- <data-single-tag :single-data.sync="scope.row.status" :status-options="statusOptions"/> -->
                    <!-- prettier-ignore -->
                   <status-switch
                        :status-data.sync="scope.row.status"
                        :activeColor.sync="'#00CD00'"
                        :inactiveColor.sync="'#CDBA96'"
                        @handleChange.native="updateStatus($event, scope.row)"
                        :title="scope.row.status === '0' ? '点击停用' : '点击启用'"
                    /> 
                    <!-- <el-switch
                        v-model="scope.row.status"
                        class="mb-2"
                        :active-value="0"
                        :inactive-value="1"
                        style="--el-switch-on-color: #00CD00; --el-switch-off-color: #CDBA96"
                        @change.native="updateStatus($event, scope.row)"
                    /> -->
				</template>
			</el-table-column>
			<el-table-column
				label="备注"
				align="center"
				prop="remark"
                width="400"
				:show-overflow-tooltip="true"
			/>
			<el-table-column label="创建时间" align="center" prop="createTime" width="300">
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
			>
				<template #default="scope">
					<el-link
						class="table_link_btn"
						:underline="false"
						type="primary"
						icon="edit"
						@click="handleUpdate(scope.row)"
						v-hasPermi="['system:dict:edit']"
						><span class="table_link_text">修改</span></el-link
					>
					<el-link
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

		<!-- 添加或修改对话框 -->
		<el-dialog :title="title" v-model="open" width="500px" append-to-body @closed="cleanSelect()">
			<el-form
				ref="formRef"
				:model="form"
				:rules="rules"
				label-width="80px"
			>
				<el-form-item label="字典名称" prop="dictName">
					<el-input
						v-model="form.dictName"
						placeholder="请输入字典名称"
					/>
				</el-form-item>
				<el-form-item label="字典类型" prop="dictType">
					<el-input
						v-model="form.dictType"
						placeholder="请输入字典类型"
					/>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-radio-group v-model="form.status">
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
						v-model="form.remark"
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

<script lang="ts" name="Dict" setup>
import Dict from "@/api/request/system/dict";
// prettier-ignore
const {
    loading, single, multiple, showSearch, total, typeList, title, open, statusOptions, queryParams, dateRange, form, formRef, queryFormRef, rules, 
    getList, cancel, handleQuery, resetQuery, handleSelectionChange, handleAdd, handleUpdate, updateStatus, submitForm, handleDelete, 
    handleExport, handleRefreshCache, handleClearCache, pageTableRef, cleanSelect
} = Dict();
</script>
