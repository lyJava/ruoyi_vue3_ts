<template>
	<div class="app-container">
		<el-form
			:model="queryParams"
			ref="queryFormRef"
			:inline="true"
			v-show="showSearch"
			label-width="70px"
		>
			<el-form-item label="公告标题" prop="noticeTitle">
				<el-input
					v-model="queryParams.noticeTitle"
					placeholder="请输入公告标题"
					clearable
					@clear="handleQuery"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="操作人员" prop="createBy">
				<el-input
					v-model="queryParams.createBy"
					placeholder="请输入操作人员"
					clearable
					@clear="handleQuery"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="类型" prop="noticeType">
				<el-select
					style="width: 200px;"
					v-model="queryParams.noticeType"
					placeholder="请选择类型"
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
			<el-form-item label="状态" prop="noticeStatus">
				<el-select
					v-model="queryParams.noticeStatus"
					placeholder="状态"
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
					v-hasPermi="['system:notice:add']"
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
					v-hasPermi="['system:notice:edit']"
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
					v-hasPermi="['system:notice:remove']"
					>删除</el-button
				>
			</el-col>
            <!-- prettier-ignore -->
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
		</el-row>

		<el-table
            stripe
			border
			v-loading="loading"
            ref="pageTable"
			:data="noticeList"
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column
				label="序号"
				align="center"
				prop="id"
				width="100"
			/>
			<el-table-column
				label="通知/公告标题"
				align="left"
				prop="noticeTitle"
				:show-overflow-tooltip="true"
			/>
			<el-table-column
				label="公告类型"
				align="center"
				prop="noticeType"
				:formatter="typeFormat"
			/>
			<el-table-column
				label="状态"
				align="center"
				prop="noticeStatus"
				:formatter="statusFormat"
				width="150"
			>
                <template #default="scope">
                    <!-- prettier-ignore -->
                    <DataSingleTag :single-data.sync="scope.row.noticeStatus" :status-options="statusOptions"/>
                </template>
            </el-table-column>
			<el-table-column
				label="创建者"
				align="center"
				prop="createBy"
				width="200"
			/>
			<el-table-column
				label="创建时间"
				align="center"
				prop="createTime"
				width="200"
			>
				<template #default="scope">
					<span>{{
						parseTime(scope.row.createTime, "{y}-{m}-{d}")
					}}</span>
				</template>
			</el-table-column>
			<el-table-column label="修改时间" align="center" prop="updateTime" width="200">
				<template #default="scope">
					<span>{{ dateTimeSub(scope.row.updateTime) }}</span>
				</template>
			</el-table-column>
			<el-table-column
				label="操作"
				align="center"
                width="200"
				fixed="right"
				class-name="small-padding fixed-width"
			>
				<template #default="scope">
					<el-link
                        class="el-link-spacing"
						:underline="false"
						size="small"
						type="primary"
						icon="edit"
						@click="handleUpdate(scope.row)"
						v-hasPermi="['system:notice:edit']"
						>修改</el-link
					>
					<el-link
                        class="el-link-spacing"
						:underline="false"
						size="small"
						type="danger"
						icon="delete"
						@click="handleDelete(scope.row)"
						v-hasPermi="['system:notice:remove']"
						>删除</el-link
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

		<!-- 添加或修改公告对话框 -->
		<el-dialog
			:title="title"
			v-model="open"
			width="780px"
			append-to-body
			destroy-on-close
            @close="cleanSelect"
		>
			<el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
				<el-row>
					<el-col :span="24">
						<el-form-item label="公告标题" prop="noticeTitle">
							<el-input
								v-model="form.noticeTitle"
								placeholder="请输入公告标题"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="公告类型" prop="noticeType">
							<el-select
								v-model="form.noticeType"
								placeholder="请选择"
                                style="width: 100%;"
							>
								<el-option
									v-for="dict in typeOptions"
									:key="dict.dictValue"
									:label="dict.dictLabel"
									:value="dict.dictValue"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="状态" style="float: right;margin-right: 5px;">
							<el-radio-group v-model="form.noticeStatus">
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
						<el-form-item label="内容">
							<editor
								v-model:content="form.noticeContent"								
							/> 
							<!-- <quill-editor :model-value="form.noticeContent" /> -->
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
                <div class="dialog-footer" style="margin-top: 60px;">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
				    <el-button @click="cancel()">关 闭</el-button>
                </div>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="Notice" setup>
import Editor from "@/components/Editor/vue3/index.vue";
import Notice from "@/api/request/system/notice/notice";
// prettier-ignore
const {
    loading, single, multiple, showSearch, total, noticeList, title, open, statusOptions, typeOptions, queryParams, form, formRef, queryFormRef, 
    rules, getList, statusFormat, typeFormat, cancel, handleQuery, resetQuery, handleSelectionChange, handleAdd, handleUpdate, submitForm, 
    handleDelete, pageTable, cleanSelect, 
} = Notice();
</script>
