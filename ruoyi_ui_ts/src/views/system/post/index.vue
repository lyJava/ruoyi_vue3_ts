<template>
	<div class="app-container">
		<el-form
			:model="queryParams"
			ref="queryFormRef"
			:inline="true"
			v-show="showSearch"
			label-width="70px"
		>
			<el-form-item label="岗位编码" prop="postCode">
				<el-input
					v-model="queryParams.postCode"
					placeholder="请输入岗位编码"
					clearable
					@clear="handleQuery"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="岗位名称" prop="postName">
				<el-input
					v-model="queryParams.postName"
					placeholder="请输入岗位名称"
					clearable
					@clear="handleQuery"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="状态" prop="postStatus">
				<el-select
					style="width: 200px;"
					v-model="queryParams.postStatus"
					placeholder="岗位状态"
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
			<el-form-item label="创建时间" style="font-weight: bold">
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
					v-hasPermi="['system:post:add']"
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
					v-hasPermi="['system:post:export']"
					>导出</el-button
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
					v-hasPermi="['system:post:edit']"
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
					v-hasPermi="['system:post:remove']"
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
			:data="postList"
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column
				label="岗位编号"
				align="center"
				prop="id"
				width="100"
			/>
			<el-table-column
				label="岗位编码"
				align="center"
				prop="postCode"
				width="300"
			/>
			<el-table-column
				label="岗位名称"
				align="center"
				prop="postName"
				width="300"
			/>
			<el-table-column
				label="岗位排序"
				align="center"
				prop="postSort"
				width="200"
			/>
			<el-table-column
				label="状态"
				align="center"
				width="200"
				prop="postStatus"
				:formatter="statusFormat"
			>
				<template #default="scope">
					<!-- prettier-ignore -->
					<data-single-tag :single-data.sync="scope.row.postStatus" :status-options="statusOptions"/>
				</template>
			</el-table-column>
			<el-table-column label="备注" align="center" prop="remarks" />
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
			<el-table-column
				label="操作"
				header-align="center"
				align="center"
				fixed="right"
				width="200"
				class-name="small-padding fixed-width"
			>
				<template #default="scope">
					<el-link
						:underline="false"
						class="el-link-spacing"
						size="small"
						type="primary"
						icon="edit"
						@click="handleUpdate(scope.row)"
						v-hasPermi="['system:post:edit']"
						><span class="table_link_text">修改</span></el-link
					>
					<el-link
						:underline="false"
						class="el-link-spacing"
						size="small"
						type="danger"
						icon="delete"
						@click="handleDelete(scope.row)"
						v-hasPermi="['system:post:remove']"
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

		<!-- 添加或修改岗位对话框 -->
		<el-dialog
			:title="title"
			v-model="open"
			width="30%"
			append-to-body
			destroy-on-close
			@close="cleanSelect()"
		>
			<el-form
				ref="formRef"
				:model="form"
				:inline="true"
				:rules="rules"
				label-width="100px"
			>
				<el-row>
					<el-col :span="12">
						<el-form-item label="岗位名称" prop="postName">
							<!-- prettier-ignore -->
							<el-input v-model="form.postName" placeholder="请输入岗位名称" style="width: 240px;"/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="岗位编码" prop="postCode">
							<!-- prettier-ignore -->
							<el-input v-model="form.postCode" placeholder="请输入编码名称" style="width: 240px;"/>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="岗位顺序" prop="postSort">
							<!-- prettier-ignore -->
							<el-input-number v-model="form.postSort" controls-position="right" :min="0" style="width: 240px;" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="岗位状态" prop="postStatus">
							<el-radio-group v-model="form.postStatus">
								<el-radio
									v-for="dict in statusOptions"
									:key="dict.dictValue"
									:value="dict.dictValue"
									>{{ dict.dictLabel }}</el-radio
								>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="备注" prop="remark">
							<el-input
								v-model="form.remarks"
								type="textarea"
								placeholder="请输入备注"
								:autosize="{ minRows: 4, maxRows: 8 }"
								style="width: 606px"
							/>
						</el-form-item>
					</el-col>
				</el-row>
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

<script lang="ts" name="Post" setup>
import Post from "@/api/request/system/post/post";
// prettier-ignore
const {
    loading, single, multiple, showSearch, total, postList, title, open, queryParams, queryFormRef, form, dateRange, formRef, rules, statusOptions,
    getList, statusFormat, cancel, handleQuery, resetQuery, handleSelectionChange, handleAdd, handleUpdate, submitForm, handleDelete, handleExport,
    pageTableRef, cleanSelect,
} = Post();
</script>
