import type {
	LineSeriesOption,
	BarSeriesOption,
	ScatterSeriesOption,
	PieSeriesOption,
	RadarSeriesOption,
	MapSeriesOption,
	TreeSeriesOption,
	TreemapSeriesOption,
	GraphSeriesOption,
	GaugeSeriesOption,
	FunnelSeriesOption,
	ParallelSeriesOption,
	SankeySeriesOption,
	BoxplotSeriesOption,
	CandlestickSeriesOption,
	EffectScatterSeriesOption,
	LinesSeriesOption,
	HeatmapSeriesOption,
	PictorialBarSeriesOption,
	ThemeRiverSeriesOption,
	SunburstSeriesOption,
	CustomSeriesOption,
	DatasetComponentOption,
	VisualMapComponentOption,
	MarkAreaComponentOption,
	MarkLineComponentOption,
	MarkPointComponentOption,
	TitleComponentOption,
	TooltipComponentOption,
	GridComponentOption,
	GraphicComponentOption,
	LegendComponentOption,
} from "echarts";

declare module "#/echart" {
	export type EChartsOption = echarts.ComposeOption<
		| LineSeriesOption
		| BarSeriesOption
		| ScatterSeriesOption
		| PieSeriesOption
		| RadarSeriesOption
		| MapSeriesOption
		| TreeSeriesOption
		| TreemapSeriesOption
		| GraphSeriesOption
		| GaugeSeriesOption
		| FunnelSeriesOption
		| ParallelSeriesOption
		| SankeySeriesOption
		| BoxplotSeriesOption
		| CandlestickSeriesOption
		| EffectScatterSeriesOption
		| LinesSeriesOption
		| HeatmapSeriesOption
		| PictorialBarSeriesOption
		| ThemeRiverSeriesOption
		| SunburstSeriesOption
		| CustomSeriesOption
		| DatasetComponentOption
		| VisualMapComponentOption
		| MarkAreaComponentOption
		| MarkLineComponentOption
		| MarkPointComponentOption
		| TitleComponentOption
		| TooltipComponentOption
		| GridComponentOption
		| GraphicComponentOption
		| LegendComponentOption
	>;
}
