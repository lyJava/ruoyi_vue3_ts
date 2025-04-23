<template>
	<div class="app-container">
		<el-form
			:model="queryParams"
			ref="queryRef"
			:inline="true"
			v-show="showSearch"
		>
			<el-form-item label="菜单名称" prop="menuName">
				<el-input
					style="width: 240px;"
					v-model="queryParams.menuName"
					placeholder="请输入菜单名称"
					clearable
					@clear="handleQuery"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="状态" prop="menuStatus">
				<el-select
					style="width: 240px;"
					v-model="queryParams.menuStatus"
					placeholder="菜单状态"
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
			<el-form-item label="创建时间" style="font-weight: bold">
				<el-date-picker
					style="width: 240px;"
					v-model="dateRange"
					format="YYYY-MM-DD"
					value-format="YYYY-MM-DD"
					type="daterange"
					range-separator="-"
					start-placeholder="开始时间"
					end-placeholder="截止时间"
					clearable
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
					size="small"
					icon="plus"
					@click="handleAdd"
					v-hasPermi="['system:menu:add']"
					>新增</el-button
				>
			</el-col>
			<el-col :span="1.5">
				<el-button
					type="primary"
					plain
					size="small"
					:icon="switchIcon"
					@click="handleSwitch"
					:title="'切换到' + tableSwitch"
					>{{ tableSwitch }}</el-button
				>
			</el-col>
            <el-col :span="1.5" v-if="total === 0">
				<el-button
					type="info"
					plain
					size="small"
					icon="sort"
					@click="toggleExpandAll"
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
					@click="handleDelete"
					v-hasPermi="['system:dict:remove']"
					>删除</el-button
				>
			</el-col>
			<!-- prettier-ignore -->
			<right-toolbar v-model:showSearch="showSearch" @queryTable="handleQuery" />
		</el-row>

		<el-table
			v-if="refreshTable"
			v-loading="loading"
			:data="menuList"
			row-key="id"
			:default-expand-all="isExpandAll"
			:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
		>
			<!-- prettier-ignore -->
			<el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="300" />
			<el-table-column
				prop="icon"
				label="图标"
				align="center"
				width="150"
			>
				<template #default="scope">
					<svg-icon :icon-class="scope.row.icon" />
				</template>
			</el-table-column>
			<!-- prettier-ignore -->
			<el-table-column prop="orderNum" label="排序" align="center" width="200" />
			<!-- prettier-ignore -->
			<el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true" />
			<!-- prettier-ignore -->
			<el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true" />
			<el-table-column prop="menuStatus" label="状态" width="100">
				<template #default="scope">
					<dict-tag
						:options="sys_normal_disable"
						:value="scope.row.menuStatus"
					/>
				</template>
			</el-table-column>
			<el-table-column label="创建时间" align="center" prop="createTime" width="200">
				<template #default="scope">
					<span>{{ dateTimeSub(scope.row.createTime) }}</span>
				</template>
			</el-table-column>
            <el-table-column
				label="修改时间"
				align="center"
				prop="updateTime"
				width="200"
			>
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
						icon="Edit"
						@click="handleUpdate(scope.row)"
						v-hasPermi="['system:menu:edit']"
						><span class="table_link_text">修改</span></el-link
					>
					<el-link
						class="table_link_btn"
						:underline="false"
						type="primary"
						icon="Plus"
						@click="handleAdd(scope.row)"
						v-hasPermi="['system:menu:add']"
						><span class="table_link_text">新增</span></el-link
					>
					<el-link
						class="table_link_btn"
						:underline="false"
						type="danger"
						icon="Delete"
						@click="handleDelete(scope.row)"
						v-hasPermi="['system:menu:remove']"
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
			:data="menuPage"
			@selection-change="multipleSelection"
		>
			<el-table-column type="selection" align="center" width="55" />
			<!-- prettier-ignore -->
			<el-table-column prop="id" label="编号" align="center" width="200"/>
			<!-- prettier-ignore -->
			<el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="300"/>
			<el-table-column
				prop="icon"
				label="图标"
				align="center"
				width="200"
			>
				<template #default="scope">
					<svg-icon :icon-class="scope.row.icon" />
				</template>
			</el-table-column>
			<!-- prettier-ignore -->
			<el-table-column prop="orderNum" label="排序" align="center" width="200" />
			<!-- prettier-ignore -->
			<el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true" />
			<!-- prettier-ignore -->
			<el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true" />
			<el-table-column
				prop="menuStatus"
				label="状态"
				align="center"
				width="200"
			>
				<template #default="scope">
					<dict-tag
						:options="sys_normal_disable"
						:value="scope.row.menuStatus"
					/>
				</template>
			</el-table-column>
			<el-table-column
				label="创建时间"
				align="center"
				prop="createTime"
				width="200"
			>
				<template #default="scope">
					<span>{{ scope.row.createTime }}</span>
				</template>
			</el-table-column>
            <el-table-column
				label="修改时间"
				align="center"
				prop="updateTime"
				width="200"
			>
				<template #default="scope">
					<span>{{ scope.row.updateTime }}</span>
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
						icon="Edit"
						@click="handleUpdate(scope.row)"
						v-hasPermi="['system:menu:edit']"
						><span class="table_link_text">修改</span></el-link
					>
                    <el-link
						class="table_link_btn"
						:underline="false"
						type="primary"
						icon="Plus"
						@click="handleAdd(scope.row)"
						v-hasPermi="['system:menu:add']"
						><span class="table_link_text">新增</span></el-link
					>
					<el-link
						class="table_link_btn"
						:underline="false"
						type="danger"
						icon="Delete"
						@click="handleDelete(scope.row)"
						v-hasPermi="['system:menu:remove']"
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

		<!-- 添加或修改菜单对话框 -->
		<el-dialog :title="title" v-model="open" width="30%" append-to-body @closed="cleanSelect()">
			<el-form
				ref="menuRef"
				:model="form"
				:rules="rules"
				label-width="110px"
			>
				<el-row>
					<el-col :span="12">
						<el-form-item label="上级菜单">
							<!-- prettier-ignore -->
							<el-tree-select
								v-model="form.parentId"
								:data="menuOptions"
								:props="elTreeProps"
								value-key="id"
								placeholder="选择上级菜单"
								check-strictly
                                style="width: 100%;"
                                :render-after-expand="false"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="菜单类型" prop="menuType">
							<el-radio-group v-model="form.menuType">
								<el-radio value="M">目录</el-radio>
								<el-radio value="C">菜单</el-radio>
								<el-radio value="F">按钮</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if="form.menuType != 'F'">
						<el-form-item label="菜单图标" prop="icon">
							<el-popover
								placement="bottom-start"
								:width="560"
								:visible="showChooseIcon"
								trigger="click"
								:persistent="true"
							>
								<template #reference>
									<!-- prettier-ignore -->
									<el-input v-model="form.icon" placeholder="点击选择图标" @click.native="showSelectIcon" readonly >
										<template #prefix>
                                            <!-- prettier-ignore -->
											<svg-icon
												v-if="form.icon"
												:icon-class="form.icon"
												class="el-input__icon"
												style="height: 32px;width: 16px;"
											/>
                                            <!-- prettier-ignore -->
											<el-icon v-else style="height: 32px;width: 16px;"><search/></el-icon>
										</template>
									</el-input>
								</template>
								<!-- prettier-ignore -->
								<icon-select ref="iconSelectRef" @visible="showSelectIcon" @selected="selected" v-click-outside="hideSelectIcon" />
							</el-popover>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="菜单名称" prop="menuName">
							<el-input
								v-model="form.menuName"
								placeholder="请输入菜单名称"
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
					<el-col :span="12" v-if="form.menuType != 'F'">
						<el-form-item>
							<template #label>
								<span>
									<el-tooltip
										content="选择是外链则路由地址需要以`http(s)://`开头"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
									是否外链
								</span>
							</template>
							<el-radio-group v-model="form.isFrame">
								<el-radio value="0">是</el-radio>
								<el-radio value="1">否</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="form.menuType != 'F'">
						<el-form-item prop="routerPath">
							<template #label>
								<span>
									<el-tooltip
										content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
									路由地址
								</span>
							</template>
							<el-input
								v-model="form.routerPath"
								placeholder="请输入路由地址"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="form.menuType == 'C'">
						<el-form-item prop="component">
							<template #label>
								<span>
									<el-tooltip
										content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
									组件路径
								</span>
							</template>
							<el-input
								v-model="form.component"
								placeholder="请输入组件路径"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="form.menuType != 'M'">
						<el-form-item>
							<el-input
								v-model="form.perms"
								placeholder="请输入权限标识"
								maxlength="100"
							/>
							<template #label>
								<span>
									<el-tooltip
										content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
									权限字符
								</span>
							</template>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="form.menuType == 'C'">
						<el-form-item>
							<el-input
								v-model="form.query"
								placeholder="请输入路由参数"
								maxlength="255"
							/>
							<template #label>
								<span>
									<el-tooltip
										content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`'
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
									路由参数
								</span>
							</template>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="form.menuType == 'C'">
						<el-form-item>
							<template #label>
								<span>
									<el-tooltip
										content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
									是否缓存
								</span>
							</template>
							<el-radio-group v-model="form.isCache">
								<el-radio value="0">缓存</el-radio>
								<el-radio value="1">不缓存</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="form.menuType != 'F'">
						<el-form-item>
							<template #label>
								<span>
									<el-tooltip
										content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
									显示状态
								</span>
							</template>
							<el-radio-group v-model="form.visible">
								<el-radio
									v-for="dict in sys_show_hide"
									:key="dict.value"
									:value="dict.value"
									>{{ dict.label }}</el-radio
								>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="form.menuType != 'F'">
						<el-form-item>
							<template #label>
								<span>
									<el-tooltip
										content="选择停用则路由将不会出现在侧边栏，也不能被访问"
										placement="top"
									>
										<el-icon><question-filled /></el-icon>
									</el-tooltip>
									菜单状态
								</span>
							</template>
							<el-radio-group v-model="form.menuStatus">
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

<script lang="ts" name="Menu" setup>
import SvgIcon from "@/components/SvgIcon/index.vue";
import IconSelect from "@/components/IconSelect/index.vue";
import Menu from "@/api/request/system/menu";
import { ClickOutside as vClickOutside } from "element-plus";
// prettier-ignore
const {
    loading, open, queryRef, showSearch, title, menuList, menuOptions, isExpandAll, refreshTable, showChooseIcon, iconSelectRef, menuRef, queryParams,
    form, rules, sys_show_hide, sys_normal_disable, dateRange, elTreeProps, total, menuPage, pageTable, single, multiple, pageLoading, dateRange2,
    cancel, showSelectIcon, selected, handleQuery, resetQuery, handleAdd, toggleExpandAll, handleUpdate, submitForm, hideSelectIcon, 
    handleDelete, handleSwitch, getPage, multipleSelection, switchIcon, tableSwitch, ids, pageTableRef, cleanSelect,
} = Menu();
</script>
<style scoped lang="scss">
.icon-body {
	width: 100%;
	padding: 10px;
	.icon-list {
		height: 200px;
		overflow-y: scroll;
		div {
			height: 40px;
			line-height: 40px;
			font-size: 16px;
			margin: 5px 0 -5px 10px;
			cursor: pointer;
			width: 30%;
			float: left;
		}
		span {
			display: inline-block;
			vertical-align: -0.15em;
			fill: currentColor;
			overflow: hidden;
		}
	}
}
</style>
