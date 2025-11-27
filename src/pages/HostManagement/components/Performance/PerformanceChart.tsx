import React, { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";

interface PerformanceChartProps {
  title: string;
  unit: string;
  series: Array<{
    name: string;
    color: string;
    data: number[];
  }>;
  height?: number;
  times?: string[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ title, unit, series, times, height = 140 }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const stats = useMemo(() => {
    const merged = series.flatMap(s => s.data);
    const points = merged.length ? merged : [0];
    const maxValue = Math.max(...points);
    const avgValue =
      Math.round((points.reduce((a, b) => a + b, 0) / points.length) * 100) / 100;
    const latestValue = series[0]?.data[series[0].data.length - 1] ?? 0;
    return { max: maxValue, avg: avgValue, latest: latestValue };
  }, [series]);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    chart.setOption({
      grid: { left: 20, right: 20, top: 10, bottom: 20 },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: times && times.length ? times : series[0]?.data.map((_, idx) => idx) ?? [],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#999" },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: true, lineStyle: { color: "#f0f0f0" } },
        axisLabel: { color: "#999" },
      },
      tooltip: { trigger: "axis" },
      legend: { top: 0, right: 10, itemWidth: 12, itemHeight: 8, textStyle: { fontSize: 12 } },
      series: series.map(s => ({
        name: s.name,
        type: "line",
        data: s.data,
        smooth: true,
        symbol: "circle",
        symbolSize: 4,
        showSymbol: false,
        lineStyle: { color: s.color, width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: `${s.color}55` },
            { offset: 1, color: `${s.color}11` },
          ]),
        },
      })),
    });

    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [series]);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 600, color: "#000" }}>{title}</div>
        <div style={{ display: "flex", gap: 12, color: "#666", fontSize: 12 }}>
          <span>当前: {stats.latest}{unit}</span>
          <span>平均: {stats.avg}{unit}</span>
          <span>峰值: {stats.max}{unit}</span>
        </div>
      </div>
      <div style={{ background: "#fafafa", borderRadius: 6, padding: 8 }}>
        <div ref={chartRef} style={{ width: "100%", height }} />
      </div>
    </div>
  );
};

export default PerformanceChart;
