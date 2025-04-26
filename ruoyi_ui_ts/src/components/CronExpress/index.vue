<template>
	<div>
		<el-tabs type="border-card">
			<el-tab-pane label="秒" v-if="shouldHide('second')">
				<CrontabSecond
					@update="updateCrontabValue"
					:check="checkNumber"
					:cron="cronTabValObj"
					ref="cronSecond"
				/>
			</el-tab-pane>

			<el-tab-pane label="分钟" v-if="shouldHide('min')">
				<CrontabMinute
					@update="updateCrontabValue"
					:check="checkNumber"
					:cron="cronTabValObj"
					ref="cronMinute"
				/>
			</el-tab-pane>

			<el-tab-pane label="小时" v-if="shouldHide('hour')">
				<CrontabHour
					@update="updateCrontabValue"
					:check="checkNumber"
					:cron="cronTabValObj"
					ref="cronHour"
				/>
			</el-tab-pane>

			<el-tab-pane label="日" v-if="shouldHide('day')">
				<CrontabDay
					@update="updateCrontabValue"
					:check="checkNumber"
					:cron="cronTabValObj"
					ref="cronDay"
				/>
			</el-tab-pane>

			<el-tab-pane label="月" v-if="shouldHide('month')">
				<CrontabMonth
					@update="updateCrontabValue"
					:check="checkNumber"
					:cron="cronTabValObj"
					ref="cronMonth"
				/>
			</el-tab-pane>

			<el-tab-pane label="周" v-if="shouldHide('week')">
				<CrontabWeek
					@update="updateCrontabValue"
					:check="checkNumber"
					:cron="cronTabValObj"
					ref="cronWeek"
				/>
			</el-tab-pane>

			<el-tab-pane label="年" v-if="shouldHide('year')">
				<CrontabYear
					@update="updateCrontabValue"
					:check="checkNumber"
					:cron="cronTabValObj"
					ref="cronYear"
				/>
			</el-tab-pane>
		</el-tabs>

		<div class="popup-main">
			<div class="popup-result">
				<p class="title">时间表达式</p>
				<table>
					<thead>
						<tr>
							<th
								v-for="item of tabTitles"
								width="40"
								:key="item"
							>
								{{ item }}
							</th>
							<th>Cron 表达式</th>
						</tr>
					</thead>
					<tbody>
						<tr style="font-size: 16px">
							<td>
								<span>{{ cronTabValObj.second }}</span>
							</td>
							<td>
								<span>{{ cronTabValObj.min }}</span>
							</td>
							<td>
								<span>{{ cronTabValObj.hour }}</span>
							</td>
							<td>
								<span>{{ cronTabValObj.day }}</span>
							</td>
							<td>
								<span>{{ cronTabValObj.month }}</span>
							</td>
							<td>
								<span>{{ cronTabValObj.week }}</span>
							</td>
							<td>
								<span>{{ cronTabValObj.year }}</span>
							</td>
							<td>
								<span>{{ crontabValueString }}</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<CrontabResult :ex="crontabValueString"></CrontabResult>

			<div class="pop_btn">
				<el-button size="default" type="primary" @click="submitFill"
					>确定</el-button
				>
				<el-button size="default" type="warning" @click="clearCron"
					>重置</el-button
				>
				<el-button size="default" @click="hidePopup">取消</el-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import useCron from "./index";
import CrontabSecond from "./second.vue";
import CrontabMinute from "./minute.vue";
import CrontabHour from "./hour.vue";
import CrontabDay from "./day.vue";
import CrontabMonth from "./month.vue";
import CrontabWeek from "./week.vue";
import CrontabYear from "./year.vue";
import CrontabResult from "./result.vue";

const props = defineProps({
	expression: {
		type: String,
		default: "",
	},
	hideComponent: {
		type: Array as () => string[],
		default: () => [],
	},
});

const emit = defineEmits(["hide", "fill"]);

const {
	tabTitles,
	cronSecond,
	cronMinute,
	cronHour,
	cronDay,
	cronWeek,
	cronYear,
	cronTabValObj,
	crontabValueString,
	shouldHide,
	updateCrontabValue,
	checkNumber,
	submitFill,
	clearCron,
	hidePopup,
} = useCron(props, emit);
</script>
<style scoped>
.pop_btn {
	text-align: center;
	margin-top: 20px;
}
.popup-main {
	position: relative;
	margin: 10px auto;
	background: #fff;
	border-radius: 5px;
	font-size: 12px;
	overflow: hidden;
}
.popup-title {
	overflow: hidden;
	line-height: 34px;
	padding-top: 6px;
	background: #f2f2f2;
}
.popup-result {
	box-sizing: border-box;
	line-height: 24px;
	margin: 25px auto;
	padding: 15px 10px 10px;
	border: 1px solid #ccc;
	position: relative;
}
.popup-result .title {
	position: absolute;
	top: -28px;
	left: 50%;
	width: 140px;
	font-size: 14px;
	margin-left: -70px;
	text-align: center;
	line-height: 30px;
	background: #fff;
}
.popup-result table {
	text-align: center;
	width: 100%;
	margin: 0 auto;
}
.popup-result table span {
	display: block;
	width: 100%;
	font-family: arial;
	line-height: 30px;
	height: 30px;
	white-space: nowrap;
	overflow: hidden;
	border: 1px solid #e8e8e8;
}
.popup-result-scroll {
	font-size: 12px;
	line-height: 24px;
	height: 10em;
	overflow-y: auto;
}
</style>
