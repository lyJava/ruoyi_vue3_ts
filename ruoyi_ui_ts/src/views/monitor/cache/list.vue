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

<script lang="ts" name="CacheList" setup>
import CacheList from '@/api/request/monitor/cache/list';
// prettier-ignore
const {
    cacheNames, cacheKeys, cacheForm, loading, subLoading, tableHeight, refreshCacheNames, handleClearCacheName, getCacheKeys, refreshCacheKeys, 
    handleClearCacheKey, nameFormatter, keyFormatter, handleCacheValue, handleClearCacheAll, 
} = CacheList();
</script>
<style scoped>
.cache_refresh {
    float: right;
    padding: 2px 15px;
}
</style>