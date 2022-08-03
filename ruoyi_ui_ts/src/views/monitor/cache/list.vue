<template>
	<div class="app-container">
		<el-row :gutter="10">
			<el-col :span="8">
				<el-card style="height: calc(100vh - 125px)">
					<template #header>
						<span>缓存列表</span>
						<el-link
							class="cache_refresh"
                            :underline="false"
							type="primary"
							icon="Refresh"
							@click="refreshCacheNames()"
                            title="点击刷新缓存"
						>刷新</el-link>
					</template>
					<el-table
						v-loading="loading"
						:data="cacheNames"
						:height="tableHeight"
						highlight-current-row
						@row-click="getCacheKeys"
						style="width: 100%"
					>
						<el-table-column
                            align="center"
							label="序号"
							width="60"
							type="index"
						></el-table-column>

						<el-table-column
							label="缓存名称"
							align="center"
							prop="cacheName"
							:show-overflow-tooltip="true"
							:formatter="nameFormatter"
						></el-table-column>

						<el-table-column
							label="备注"
							align="center"
							prop="remark"
							:show-overflow-tooltip="true"
						/>
						<el-table-column
							label="操作"
							width="90"
							align="center"
							class-name="small-padding fixed-width"
						>
							<template #default="scope">
								<el-link
									type="danger"
									icon="delete"
                                    :underline="false"
									@click="handleClearCacheName(scope.row)"
                                    title="点击删除缓存"
								></el-link>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
			</el-col>

			<el-col :span="8">
				<el-card style="height: calc(100vh - 125px)">
					<template #header>
						<span>键名列表</span>
						<el-link
							class="cache_refresh"
							type="primary"
							icon="refresh"
                            :underline="false"
							@click="refreshCacheKeys()"
                            title="点击刷新缓存"
						>刷新</el-link>
					</template>
					<el-table
						v-loading="subLoading"
						:data="cacheKeys"
						:height="tableHeight"
						highlight-current-row
						@row-click="handleCacheValue"
						style="width: 100%"
					>
						<el-table-column
                            align="center"
							label="序号"
							width="60"
							type="index"
						></el-table-column>
						<el-table-column
							label="缓存键名"
							align="center"
							:show-overflow-tooltip="true"
							:formatter="keyFormatter"
						>
						</el-table-column>
						<el-table-column
							label="操作"
							width="90"
							align="center"
							class-name="small-padding fixed-width"
						>
							<template #default="scope">
								<el-link
									type="warning"
									icon="delete"
                                    :underline="false"
									@click="handleClearCacheKey(scope.row)"
                                    title="点击删除缓存"
								></el-link>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
			</el-col>

			<el-col :span="8">
				<el-card :bordered="false" style="height: calc(100vh - 125px)">
					<template #header>
						<span>缓存内容</span>
						<el-link
							class="cache_refresh"
							type="primary"
							icon="delete"
                            :underline="false"
							@click="handleClearCacheAll()"
							>清理全部</el-link
						>
					</template>
					<el-form :model="cacheForm">
						<el-row :gutter="32">
							<el-col :offset="1" :span="22">
								<el-form-item
									label="缓存名称:"
									prop="cacheName"
								>
									<el-input
										v-model="cacheForm.cacheName"
										:readOnly="true"
									/>
								</el-form-item>
							</el-col>
							<el-col :offset="1" :span="22">
								<el-form-item label="缓存键名:" prop="cacheKey">
									<el-input
										v-model="cacheForm.cacheKey"
										:readOnly="true"
									/>
								</el-form-item>
							</el-col>
							<el-col :offset="1" :span="22">
								<el-form-item
									label="缓存内容:"
									prop="cacheValue"
								>
									<el-input
										v-model="cacheForm.cacheValue"
										type="textarea"
										:readOnly="true"
										:autosize="{ minRows: 15 }"
									/>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script setup name="CacheList" lang="ts">
import { getCurrentInstance, ref } from "vue";
// prettier-ignore
import { listCacheName, listCacheKey, getCacheValue, clearCacheName, clearCacheKey, clearCacheAll } from "@/api/monitor/cache";

const { proxy } = getCurrentInstance() as any;
const cacheNames = ref<any>([]);
const cacheKeys = ref<any>([]);
const cacheForm = ref<any>({});
const loading = ref<boolean>(true);
const subLoading = ref<boolean>(false);
const nowCacheName = ref<string>("");
const tableHeight = ref<number>(window.innerHeight - 200);

/** 查询缓存名称列表 */
const getCacheNames = () => {
	loading.value = true;
	listCacheName().then((response: any) => {
		if (response.code === 200) {
			cacheNames.value = response.data;
			loading.value = false;
		}
	});
};

/** 刷新缓存名称列表 */
const refreshCacheNames = () => {
	getCacheNames();
	proxy.$modal.msgSuccess("刷新缓存列表成功");
};

/** 清理指定名称缓存 */
const handleClearCacheName = (row: any) => {
	clearCacheName(row.cacheName).then((response: any) => {
		if (response.code === 200) {
            // prettier-ignore
			proxy.$modal.msgSuccess("清理缓存名称[" + nowCacheName.value + "]成功");
			getCacheKeys();
		}
	});
};

/** 查询缓存键名列表 */
const getCacheKeys = (row?: any) => {
	const cacheName = row ? row.cacheName : nowCacheName.value;
	if (cacheName === "") {
		return;
	}
	subLoading.value = true;
	listCacheKey(cacheName).then((response: any) => {
		if (response.code === 200) {
			cacheKeys.value = response.data;
			subLoading.value = false;
			nowCacheName.value = cacheName;
		}
	});
};

/** 刷新缓存键名列表 */
const refreshCacheKeys = () => {
	getCacheKeys();
	proxy.$modal.msgSuccess("刷新键名列表成功");
};

/** 清理指定键名缓存 */
const handleClearCacheKey = (cacheKey: any) => {
	clearCacheKey(cacheKey).then((response: any) => {
		if (response.code === 200) {
			proxy.$modal.msgSuccess("清理缓存键名[" + cacheKey + "]成功");
			getCacheKeys();
		}
	});
};

/** 列表前缀去除 */
const nameFormatter = (row: any) => {
	return row.cacheName.replace(":", "");
};

/** 键名前缀去除 */
const keyFormatter = (cacheKey: any) => {
	return cacheKey.replace(nowCacheName.value, "");
};

/** 查询缓存内容详细 */
const handleCacheValue = (cacheKey: any) => {
	getCacheValue(nowCacheName.value, cacheKey).then((response: any) => {
		if (response.code === 200) {
			cacheForm.value = response.data;
		}
	});
};

/** 清理全部缓存 */
const handleClearCacheAll = () => {
	clearCacheAll().then((response: any) => {
		if (response.code === 200) {
			proxy.$modal.msgSuccess("清理全部缓存成功");
		}
	});
};

getCacheNames();
</script>
<style scoped>
.cache_refresh {
    float: right;
    padding: 2px 15px;
}
</style>