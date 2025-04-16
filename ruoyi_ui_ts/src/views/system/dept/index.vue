<template>
	<div class="app-container">
		<el-form
			ref="queryRef"
			:model="queryParams"
			:inline="true"
			v-show="showSearch"
		>
			<el-form-item label="部门名称" prop="deptName">
				<el-input
					style="width: 240px;"
					v-model="queryParams.deptName"
					placeholder="请输入部门名称"
					clearable
                    @clear="handleQuery"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-select
					style="width: 200px;"
					v-model="queryParams.status"
					placeholder="部门状态"
					clearable
					@change="handleQuery"
				>
					<el-option
						v-for="dict in sys_normal_disable"
						:key="dict.value"
						:label="dict.label"
						:value="dict.value"
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
					size="small"
					icon="Plus"
					@click="handleAdd"
					v-hasPermi="['system:dept:add']"
					>新增</el-button
				>
			</el-col>
			<el-col :span="1.5">
				<el-button
					type="primary"
					plain
					size="small"
					:icon="switchIcon"
					@click="handleSwitch()"
					:title="'切换到' + tableSwitch"
					>{{ tableSwitch }}</el-button
				>
			</el-col>
            <el-col :span="1.5" v-if="total === 0">
				<el-button
					type="info"
					plain
					size="small"
					icon="Sort"
					@click="toggleExpandAll()"
					>展开/折叠</el-button
				>
			</el-col>
            <el-col :span="1.5" v-if="!single && ids.length === 1">
				<el-button
					type="success"
					plain
					icon="edit"
					size="small"
                    v-if="!single"
					:disabled="single"
					@click="handleUpdate"
					v-hasPermi="['system:dict:edit']"
					>修改</el-button
				>
			</el-col>
			<el-col :span="1.5" v-if="!multiple && ids.length >= 1">
				<el-button
					type="danger"
					plain
					icon="delete"
					size="small"
					v-if="!multiple"
					:disabled="multiple"
					@click="batchDelete"
					v-hasPermi="['system:dict:remove']"
					>删除</el-button
				>
			</el-col>
			<!-- prettier-ignore -->
			<right-toolbar v-model:showSearch="showSearch" @queryTable="handleQuery" />
		</el-row>

		<el-table
			border
			stripe
			v-if="refreshTable"
			v-loading="loading"
			:data="deptList"
			row-key="id"
			:default-expand-all="isExpandAll"
			:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
		>
			<el-table-column prop="deptName" label="部门名称" />
			<!-- prettier-ignore -->
			<el-table-column prop="id" label="编号" align="left" width="120" />
			<el-table-column prop="leader" label="负责人" />
			<el-table-column prop="phone" label="联系手机" />
			<el-table-column prop="email" label="邮箱" />
			<el-table-column prop="orderNum" label="排序" width="100"/>
			<el-table-column prop="deptStatus" label="状态" width="150">
				<template #default="scope">
					<!-- prettier-ignore -->
					<data-single-tag :single-data.sync="scope.row.deptStatus" :status-options="statusOptions"/>
				</template>
			</el-table-column>
			<el-table-column
				label="创建日期"
				align="center"
				prop="createTime"
				width="300"
			>
				<template #default="scope">
					<span>{{ dateTimeSub(scope.row.createTime) }}</span>
				</template>
			</el-table-column>
            <el-table-column
				label="修改日期"
				align="center"
				prop="updateTime"
				width="300"
			>
				<template #default="scope">
					<span>{{ dateTimeSub(scope.row.updateTime) }}</span>
				</template>
			</el-table-column>
			<el-table-column
				label="操作"
				align="center"
				fixed="right"
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
						v-hasPermi="['system:dept:edit']"
						><span class="table_link_text">修改</span></el-link
					>
					<el-link
						class="table_link_btn"
						:underline="false"
						type="primary"
						icon="plus"
						@click="handleAdd(scope.row)"
						v-hasPermi="['system:dept:add']"
						><span class="table_link_text">新增</span></el-link
					>
					<el-link
						class="table_link_btn"
						:underline="false"
						v-if="scope.row.parentId != 0"
						type="danger"
						icon="delete"
						@click="handleDelete(scope.row)"
						v-hasPermi="['system:dept:remove']"
						><span class="table_link_text">删除</span></el-link
					>
				</template>
			</el-table-column>
		</el-table>

		<el-table
			border
			stripe
            ref="pageTableRef"
			v-if="pageTable"
			v-loading="pageLoading"
			:data="pageTableList"
			@selection-change="multipleSelection"
		>
			<el-table-column type="selection" align="center" width="55" />
			<el-table-column prop="deptName" label="部门名称" />
			<el-table-column prop="parentName" label="上级部门" />
			<el-table-column prop="leader" label="负责人" />
			<el-table-column prop="phone" label="联系手机" />
			<el-table-column prop="email" label="邮箱" />
			<!-- prettier-ignore -->
			<el-table-column prop="id" label="编号" align="center" width="120" />
			<el-table-column prop="orderNum" label="排序" width="120"/>
			<el-table-column
				prop="deptStatus"
				label="状态"
				align="center"
				width="120"
			>
				<template #default="scope">
					<data-single-tag
						:single-data.sync="scope.row.deptStatus"
						:status-options="statusOptions"
					/>
				</template>
			</el-table-column>
			<el-table-column
				label="创建时间"
				align="center"
				prop="createTime"
				width="300"
			>
				<template #default="scope">
					<span>{{ scope.row.createTime }}</span>
				</template>
			</el-table-column>
            <el-table-column
				label="修改时间"
				align="center"
				prop="updateTime"
				width="300"
			>
				<template #default="scope">
					<span>{{ scope.row.updateTime }}</span>
				</template>
			</el-table-column>
			<el-table-column
				label="操作"
				align="center"
				fixed="right"
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
						v-hasPermi="['system:dept:edit']"
						><span class="table_link_text">修改</span></el-link
					>
					<el-link
						class="table_link_btn"
						:underline="false"
						type="primary"
						icon="plus"
						@click="handleAdd(scope.row)"
						v-hasPermi="['system:dept:add']"
						><span class="table_link_text">新增</span></el-link
					>
					<el-link
						class="table_link_btn"
						:underline="false"
						v-if="scope.row.parentId != 0"
						type="danger"
						icon="delete"
						@click="handleDelete(scope.row)"
						v-hasPermi="['system:dept:remove']"
						><span class="table_link_text">删除</span></el-link
					>
				</template>
			</el-table-column>
		</el-table>

		<pagination
			v-show="pageTable && total > 0"
			:total="total"
			v-model:page="queryParams.pageNum"
			v-model:limit="queryParams.pageSize"
			@pagination="getPage()"
		/>

		<!-- 添加或修改部门对话框 -->
		<el-dialog :title="title" v-model="open" width="30%" append-to-body @closed="cleanSelect()">
			<el-form
				ref="deptRef"
				:model="form"
				:rules="rules"
				label-width="100px"
			>
				<el-row>
					<el-col :span="24" v-if="form.parentId !== 0">
						<el-form-item label="上级部门" prop="parentId">
							<!-- prettier-ignore -->
							<el-tree-select
                                v-model="form.parentId"
                                :data="deptOptions"
                                :props="{ value: 'id', label: 'deptName', children: 'children' }"
                                value-key="id"
                                placeholder="选择上级部门"
                                check-strictly
                                filterable
                                :render-after-expand="false"
                                style="width: 100%;"
                            />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="部门名称" prop="deptName">
							<el-input
								v-model="form.deptName"
								placeholder="请输入部门名称"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="显示排序" prop="orderNum">
							<el-input-number
								v-model="form.orderNum"
								controls-position="right"
								:min="0"
								style="width: 100%"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="负责人" prop="leader">
							<el-input
								v-model="form.leader"
								placeholder="请输入负责人"
								maxlength="20"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="联系电话" prop="phone">
							<el-input
								v-model="form.phone"
								placeholder="请输入联系电话"
								maxlength="11"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="邮箱" prop="email">
							<el-input
								v-model="form.email"
								placeholder="请输入邮箱"
								maxlength="50"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="部门状态">
							<el-radio-group v-model="form.deptStatus">
								<el-radio
									v-for="dict in sys_normal_disable"
									:key="dict.value"
									:value="dict.value"
									>{{ dict.label }}</el-radio
								>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<!-- prettier-ignore -->
					<el-button type="primary" @click="submitForm()">确 定</el-button>
					<el-button @click="cancel()">取 消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="Dept" setup>
import Dept from "@/api/request/system/dept";
// prettier-ignore
const {
    loading, open, showSearch, title, deptOptions, deptList,  isExpandAll, refreshTable, queryParams, form, rules, sys_normal_disable, queryRef, 
    statusOptions, deptRef, single, multiple, pageTable, pageLoading, total, pageTableList, switchIcon, tableSwitch, getPage, handleSwitch, cancel,
    multipleSelection, batchDelete, handleQuery, resetQuery, handleAdd, toggleExpandAll, handleUpdate, submitForm, handleDelete, ids, pageTableRef,
    cleanSelect,
} = Dept();
</script>
