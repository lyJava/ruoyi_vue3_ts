import type { EChartsOption } from "#/echart";

/**
 * 通用标题配置
 *
 * @param right 距离右边距离
 * @returns
 */
export const comLegend = (right: number | string = 0) => {
	const legend: EChartsOption["legend"] = {
		right,
		top: 0,
		itemWidth: 18,
		itemHeight: 10,
		textStyle: {
			rich: {
				a: {
					fontSize: 14,
					padding: [2, 0, 0, 0],
				},
			},
		},
	};

	return legend;
};

/**
 * 通用线条颜色配置
 * @param c1 颜色1
 * @param c2 颜色2
 * @returns
 */
export const lineColor = (c1: string, c2: string) => {
	return {
		type: "linear",
		x: 0,
		y: 0,
		x2: 0,
		y2: 1,
		colorStops: [
			{
				offset: 0,
				color: c1,
			},
			{
				offset: 1,
				color: c2,
			},
		],
		global: false,
	};
};

/**
 * 通用网格配置
 *
 * @param top 距离顶部
 * @param bottom 距离底部
 * @returns
 */
export const comGrid = (top?: 40, bottom?: 10) => {
	const grid: EChartsOption["grid"] = {
		left: 0,
		right: 0,
		bottom,
		top,
		containLabel: true,
	};
	return grid;
};

/**
 * 通用y轴配置
 *
 * @param data 数据
 * @param showTick 是否显示刻度
 * @returns
 */
export const comXAxis = (data: (string | number)[], showTick: boolean) => {
	const xAxis: EChartsOption["xAxis"] = {
		type: "category",
		boundaryGap: false,
		axisTick: {
			alignWithLabel: true,
			inside: true,
			lineStyle: {
				color: "#E1E8F0",
			},
			show: showTick,
		},
		axisLabel: {
			align: "center",
			color: "rgba(37,51,71, 0.4)",
			fontFamily: "PingFangSC-Medium, PingFang SC",
		},
		axisLine: {
			lineStyle: {
				color: "#E1E8F0",
			},
		},
		offset: 4,
		splitLine: {
			show: false,
		},
		data,
	};

	return xAxis as EChartsOption["xAxis"];
};

/**
 * 通用y轴配置
 *
 * @param name 名称
 * @param left 名称距离y轴距离
 * @returns
 */
export const comYAxis = (name: string, left: number) => {
	const yAxis: EChartsOption["yAxis"] = {
		name,
		type: "value",
		offset: left,
		nameTextStyle: {
			align: "center",
			color: "rgba(37,51,71, 0.75)",
			fontSize: 14,
			fontFamily: "PingFangSC-Medium, PingFang SC",
			fontWeight: "normal",
			fontStyle: "normal",
			verticalAlign: "middle",
			lineHeight: 60,
			backgroundColor: "rgba(0,23,11,0.3)",
			borderType: [5, 10],
			borderDashOffset: 5,
		},
		axisLabel: {
			align: "center",
			color: "rgba(37,51,71, 0.4)",
			fontFamily: "PingFangSC-Medium, PingFang SC",
			show: true,
		},
		axisLine: {
			lineStyle: {
				color: "#E1E8F0",
			},
		},
	};

	return yAxis as EChartsOption["yAxis"];
};

/**
 * 通用工具提示配置
 *
 * @param renderMode 渲染模式
 * @param padding 内边距
 */
export const comTooltip = (
	options: {
		renderMode?: "html" | "richText";
		padding?: number;
	} = {}
) => {
	// 设置默认值
	const { renderMode = "html", padding = 5 } = options;
	const tooltip: EChartsOption["tooltip"] = {
		show: true,
		showContent: true,
		alwaysShowContent: true,
		renderMode,
		padding,
	};
	return tooltip as EChartsOption["tooltip"];
};
