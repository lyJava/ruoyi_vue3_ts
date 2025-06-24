import { EChartsOption } from "#/echart";

export const createBarChart = (
	props: { xData: any; y1: any; y2: any } = { xData: [], y1: [], y2: [] }
) => {
	const { xData, y1, y2 } = props;
	const option: EChartsOption = {
		color: ["#3FD1FF", "#0075FF"],
		legend: comLegend(),
		grid: comGrid(),
		tooltip: comTooltip(),
		xAxis: comXAxis(xData, true),
		yAxis: comYAxis("单位：kw", 20),
		series: [
			{
				type: "bar",
				data: y1,
                name: "最大需求电量",
                barWidth: 20,
                barGap: "0.5"
			},
			{
				type: "bar",
				data: y2,
                name:"实际使用量",
                barWidth: 15,
                barGap: "0.5"
			},
		],
	};

    return option;
};
