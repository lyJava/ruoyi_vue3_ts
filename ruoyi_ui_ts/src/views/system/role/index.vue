<template>
	<div class="app-container">
		<el-form
			:model="queryParams"
			ref="queryFormRef"
			v-show="showSearch"
			:inline="true"
			label-width="70px"
		>
			<el-form-item label="角色名称" prop="roleName" for="roleName">
				<el-input
					id="roleName"
					style="width: 240px;"
					v-model="queryParams.roleName"
					placeholder="请输入角色名称"
					clearable
					@clear="handleQuery"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="权限字符" prop="roleKey" for="roleKey">
				<el-input
					id="roleKey"
					v-model="queryParams.roleKey"
					placeholder="请输入权限字符"
					clearable
					style="width: 240px"
					@clear="handleQuery()"
                    @keyup.enter.native="handleQuery()"
				/>
			</el-form-item>
			<el-form-item label="状态" prop="status" for="roleStatus">
				<el-select
					id="roleStatus"
					style="width: 240px;"
					v-model="queryParams.status"
					placeholder="角色状态"
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
					style="width: 240px;"
					v-model="dateRange"
					format="YYYY-MM-DD"
					value-format="YYYY-MM-DD"
					type="daterange"
					range-separator="-"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					clearable
					@change="handleQuery"
				></el-date-picker>
			</el-form-item>
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
					v-hasPermi="['system:role:add']"
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
					v-hasPermi="['system:role:export']"
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
					v-hasPermi="['system:role:edit']"
					>修改</el-button
				>
			</el-col>
			<el-col :span="1.5" v-if="!multiple">
				<el-button
					type="danger"
					plain
					icon="delete"
					size="small"
					:loading="exportLoading"
					:disabled="multiple"
					@click="handleDelete"
					v-hasPermi="['system:role:remove']"
					>删除</el-button
				>
			</el-col>
			<!-- prettier-ignore -->
			<right-toolbar v-model:showSearch="showSearch" @queryTable="getList" />
		</el-row>

		<el-table
			stripe
			border
			ref="pageTable"
			v-loading="loading"
			:data="roleList"
			@selection-change="handleSelectionChange"
		>
            <!-- prettier-ignore -->
			<el-table-column type="selection" width="55" align="center" :selectable="checkSelected"/>
            <!-- prettier-ignore -->
			<el-table-column label="角色编号" prop="id" width="150" />
            <!-- prettier-ignore -->
			<el-table-column label="角色名称" prop="roleName" show-overflow-tooltip />
            <!-- prettier-ignore -->
			<el-table-column label="权限字符" prop="roleKey" show-overflow-tooltip width="200" />
            <!-- prettier-ignore -->
			<el-table-column label="显示顺序" prop="roleSort" width="200" />
            <!-- prettier-ignore -->
			<el-table-column label="备注信息" prop="remarks" show-overflow-tooltip width="350" />
			<el-table-column label="状态" align="center" width="200">
				<template #default="scope">
					<!--默认active颜色#1890FF -->
                    <!-- prettier-ignore -->
					<status-switch v-if="scope.row.id !== '1'" :status-data.sync="scope.row.roleStatus" @click="handleStatusChange(scope.row)" />
                    <!-- prettier-ignore -->
                    <status-switch v-else :status-data.sync="scope.row.roleStatus" :disabled="true"/>
				</template>
			</el-table-column>
            <!-- prettier-ignore -->
			<el-table-column label="创建时间" align="center" prop="createTime" width="200">
				<template #default="scope">
					<span>{{ dateTimeSub(scope.row.createTime) }}</span>
				</template>
			</el-table-column>
            <el-table-column label="修改时间" align="center" prop="updateTime" width="250">
				<template #default="scope">
					<span>{{ scope.row.updateTime }}</span>
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
					<div v-if="scope.row.id == '1'" style="color: rgb(141, 136, 136);font-size: 14px;font-weight: bolder;">
						禁止操作
					</div>
					<div v-else>
						<el-link
							class="el-link-spacing"
							:underline="false"
							size="small"
							type="primary"
							icon="edit"
							@click="handleUpdate(scope.row)"
							v-hasPermi="['system:role:edit']"
							><span class="table_link_text">修改</span></el-link
						>
						<el-link
							class="el-link-spacing"
							:underline="false"
							size="small"
							type="primary"
							icon="circle-check"
							@click="handleDataScope(scope.row)"
							v-hasPermi="['system:role:edit']"
							><span class="table_link_text">数据权限</span></el-link
						>
						<el-link
							class="el-link-spacing"
							:underline="false"
							size="small"
							type="danger"
							icon="delete"
							@click="handleDelete(scope.row)"
							v-hasPermi="['system:role:remove']"
							><span class="table_link_text">删除</span></el-link
						>
					</div>
					
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

		<!-- 添加或修改角色配置对话框 -->
		<el-dialog
			:title="title"
			v-model="open"
			width="30%"
			append-to-body
			destroy-on-close
			@close="cleanSelect"
		>
			<el-form
				ref="formRef"
				:model="form"
				:rules="rules"
				label-width="90px"
			>
				<el-row>
					<el-col :span="12">
						<el-form-item label="角色名称" prop="roleName">
							<el-input
								v-model="form.roleName"
								placeholder="请输入角色名称"
								style="width: 100%"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="权限字符" prop="roleKey">
							<el-input
								v-model="form.roleKey"
								placeholder="请输入权限字符"
								style="width: 100%"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="角色顺序" prop="roleSort" for="roleSort">
							<el-input-number
								id="roleSort"
								v-model="form.roleSort"
								controls-position="right"
								:min="0"
								style="width: 100%"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="角色状态">
							<el-radio-group v-model="form.status">
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
						<el-form-item label="菜单权限">
                            <!-- prettier-ignore -->
							<el-checkbox
								v-model="menuExpand"
								@change="handleCheckedTreeExpand($event, 'menu')"
								>展开/折叠</el-checkbox
							>
                            <!-- prettier-ignore -->
							<el-checkbox
								v-model="menuNodeAll"
								@change="handleCheckedTreeNodeAll($event, 'menu')"
								>全选/全不选</el-checkbox
							>
							
                            <!-- prettier-ignore -->
							<el-checkbox
								v-model="form.menuCheckStrictly"
								@change="handleCheckedTreeConnect($event, 'menu')"
								>父子联动</el-checkbox
							>
							<el-tree
								class="tree-border"
								:data="menuOptions"
								show-checkbox
								ref="menuRef"
								node-key="id"
								:check-strictly="!form.menuCheckStrictly"
								empty-text="加载中，请稍后"
								:props="defaultProps"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="备注">
							<el-input
								v-model="form.remarks"
								type="textarea"
								:autosize="{ minRows: 4 }"
								placeholder="请输入内容"
							/>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
                    <!-- prettier-ignore -->
					<el-button type="primary" @click="submitForm">确 定</el-button>
					<el-button @click="open = false">取 消</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 分配角色数据权限对话框 -->
		<el-dialog
			:title="title"
			v-model="openDataScope"
			width="20%"
			append-to-body
			destroy-on-close
			@close="cleanSelect()"
		>
			<el-form :model="form" label-width="80px">
				<el-form-item label="角色名称">
					<el-input v-model="form.roleName" :disabled="true" />
				</el-form-item>
				<el-form-item label="权限字符">
					<el-input v-model="form.roleKey" :disabled="true" />
				</el-form-item>
				<el-form-item label="权限范围">
					<el-select
						v-model="form.dataScope"
						@change="dataScopeSelectChange"
					>
						<el-option
							v-for="item in dataScopeOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="数据权限" v-show="form.dataScope == 2">
					<el-checkbox
						v-model="deptExpand"
						@change="handleCheckedTreeExpand($event, 'dept')"
						>展开/折叠</el-checkbox
					>
					<el-checkbox
						v-model="deptNodeAll"
						@change="handleCheckedTreeNodeAll($event, 'dept')"
						>全选/全不选</el-checkbox
					>
					<el-checkbox
						v-model="form.deptCheckStrictly"
						@change="handleCheckedTreeConnect($event, 'dept')"
						>父子联动</el-checkbox
					>
					<el-tree
						class="tree-border"
						:data="deptOptions"
						show-checkbox
						default-expand-all
						ref="deptRef"
						node-key="id"
						:check-strictly="!form.deptCheckStrictly"
						empty-text="加载中，请稍后"
						:props="defaultProps"
					></el-tree>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<!-- prettier-ignore -->
					<el-button type="primary" @click="submitDataScope">确 定</el-button>
					<el-button @click="openDataScope = false">取 消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="Role" setup>
import Role from "@/api/request/system/role/role";
// prettier-ignore
const {
        menuRef, loading, exportLoading, deptRef, single, multiple, showSearch, total, roleList, title, open, openDataScope, menuExpand, menuNodeAll,
        deptExpand, deptNodeAll, dateRange, statusOptions, dataScopeOptions, menuOptions, deptOptions, queryParams, form, defaultProps, rules, formRef, 
        queryFormRef, getList, handleStatusChange, handleQuery, resetQuery, handleSelectionChange, handleCheckedTreeExpand, 
        handleCheckedTreeNodeAll, handleCheckedTreeConnect, handleAdd, handleUpdate, dataScopeSelectChange, handleDataScope, submitForm, cleanSelect,
        submitDataScope, handleDelete, handleExport, pageTable, checkSelected
    } = Role();
</script>
