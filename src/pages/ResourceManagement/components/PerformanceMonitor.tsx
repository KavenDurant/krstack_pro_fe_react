import React, { useState, useEffect, useRef, useMemo } from "react";
import { Card, Select, Spin, message, Empty } from "antd";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import { nodeApi } from "@/api";
import type { PerformanceData, NetworkPerformanceData } from "@/api";

// 限制图表数据点数量为最多 12 个
const MAX_DATA_POINTS = 12;

// 对数据进行采样，保留最多 MAX_DATA_POINTS 个数据点
const sampleData = <T extends { timestamp: number }>(data: T[]): T[] => {
  if (data.length <= MAX_DATA_POINTS) {
    return data;
  }
  const result: T[] = [];
  const step = (data.length - 1) / (MAX_DATA_POINTS - 1);
  for (let i = 0; i < MAX_DATA_POINTS; i++) {
    const index = Math.round(i * step);
    result.push(data[index]);
  }
  return result;
};

interface PerformanceMonitorProps {
  nodeUid: string;
}

type TimeFrame = "hour" | "day" | "week" | "month";

const TIME_FRAME_OPTIONS = [
  { label: "最近1小时", value: "hour" },
  { label: "最近1天", value: "day" },
  { label: "最近1周", value: "week" },
  { label: "最近1月", value: "month" },
];

interface ChartComponentProps {
  data: PerformanceData[];
  title: string;
  color: string;
  unit: string;
  formatter?: (value: number) => string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  data,
  title,
  color,
  unit,
  formatter,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  // 对数据进行采样，限制最多显示 MAX_DATA_POINTS 个数据点
  const sampledData = useMemo(() => sampleData(data), [data]);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const formatTooltipTimestamp = (timestamp: number): string => {
      const date = new Date(timestamp * 1000);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const option: EChartsOption = {
      grid: {
        left: "3%",
        right: "6%", // Adjusted for better label visibility
        bottom: "3%",
        top: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: sampledData.map(item => formatTooltipTimestamp(item.timestamp)),
        axisLabel: {
          rotate: 45,
          fontSize: 10,
          formatter: (value: string) => value.substring(5, 16),
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: formatter || `{value} ${unit}`,
        },
      },
      series: [
        {
          name: title,
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 4,
          itemStyle: {
            color,
          },
          lineStyle: {
            color,
            width: 2,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: color + "40" },
              { offset: 1, color: color + "10" },
            ]),
          },
          data: sampledData.map(item => item.value),
        },
      ],
      tooltip: {
        trigger: "axis",
        formatter: (params: unknown) => {
          const paramArr = params as Array<{
            value: number;
            name: string;
            dataIndex: number;
            marker: string;
            seriesName: string;
          }>;
          if (!paramArr || paramArr.length === 0) return "";

          const param = paramArr[0];
          // param.name is now the full date string from xAxis data
          const dateStr = param.name;

          const value = formatter
            ? formatter(param.value)
            : `${param.value.toFixed(2)} ${unit}`;
          return `${dateStr}<br/>${title}: ${value}`;
        },
      },
    };

    chartInstanceRef.current.setOption(option, true);

    const handleResize = () => {
      chartInstanceRef.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [data, title, color, unit, formatter]);

  useEffect(() => {
    return () => {
      chartInstanceRef.current?.dispose();
    };
  }, []);

  if (sampledData.length === 0) {
    return (
      <div
        style={{
          height: 300,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Empty description="暂无数据" />
      </div>
    );
  }

  return <div ref={chartRef} style={{ width: "100%", height: 300 }} />;
};

const useNetworkChart = (data: NetworkPerformanceData[]) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const [visibleSeries, setVisibleSeries] = useState<{
    rx: boolean;
    tx: boolean;
  }>({
    rx: true,
    tx: true,
  });
  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    // Early return if no data
    if (!data || data.length === 0) {
      return;
    }

    const formatTooltipTimestamp = (timestamp: number): string => {
      const date = new Date(timestamp * 1000);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    // Auto-calculate appropriate unit based on max value
    const maxVal = Math.max(
      ...data.map(d => Math.max(d.rx, d.tx)),
      0 // Ensure at least 0 to avoid -Infinity
    );

    console.log("NetworkChartComponent maxVal:", maxVal);

    // Helper to get raw transformed value for axis
    const getValueInUnit = (bytes: number) => {
      if (maxVal >= 1024 * 1024 * 1024) return bytes / 1024 / 1024 / 1024; // GB/s
      if (maxVal >= 1024 * 1024) return bytes / 1024 / 1024; // MB/s
      if (maxVal >= 1024) return bytes / 1024; // KB/s
      return bytes; // B/s
    };

    const getUnitLabel = () => {
      if (maxVal >= 1024 * 1024 * 1024) return "GB/s";
      if (maxVal >= 1024 * 1024) return "MB/s";
      if (maxVal >= 1024) return "KB/s";
      return "B/s";
    };

    const unitLabel = getUnitLabel();

    const option: EChartsOption = {
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "3%", // Minimal top margin
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.map(item => formatTooltipTimestamp(item.timestamp)),
        axisLabel: {
          rotate: 45,
          fontSize: 10,
          formatter: (value: string) => value.substring(5, 16),
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: (value: number) => `${value.toFixed(2)} ${unitLabel}`,
        },
      },
      series: [
        {
          name: "接收 (In)",
          type: "line",
          smooth: true,
          symbol: "none",
          itemStyle: { color: "#faad14" },
          lineStyle: { width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#faad1440" },
              { offset: 1, color: "#faad1410" },
            ]),
          },
          data: visibleSeries.rx
            ? data.map(item => getValueInUnit(item.rx))
            : [],
        },
        {
          name: "发送 (Out)",
          type: "line",
          smooth: true,
          symbol: "none",
          itemStyle: { color: "#52c41a" },
          lineStyle: { width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#52c41a40" },
              { offset: 1, color: "#52c41a10" },
            ]),
          },
          data: visibleSeries.tx
            ? data.map(item => getValueInUnit(item.tx))
            : [],
        },
      ],
      tooltip: {
        trigger: "axis",
        formatter: (params: any) => {
          if (!Array.isArray(params) || params.length === 0) return "";
          const firstParam = params[0];

          // firstParam.name is now the full date string from xAxis data
          const dateStr = firstParam.name;

          let html = `${dateStr}<br/>`;
          params.forEach((p: any) => {
            if (p.value !== undefined) {
              html += `${p.marker} ${p.seriesName}: ${p.value.toFixed(2)} ${unitLabel}<br/>`;
            }
          });
          return html;
        },
      },
    };

    chartInstanceRef.current.setOption(option, true);

    const handleResize = () => {
      chartInstanceRef.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [data, visibleSeries]); // Re-render when data or visibility changes

  useEffect(() => {
    return () => {
      chartInstanceRef.current?.dispose();
    };
  }, []);

  const toggleSeries = (series: "rx" | "tx") => {
    setVisibleSeries(prev => ({
      ...prev,
      [series]: !prev[series],
    }));
  };

  const legend = (
    <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
      <span
        onClick={() => toggleSeries("rx")}
        style={{
          cursor: "pointer",
          opacity: visibleSeries.rx ? 1 : 0.4,
          textDecoration: visibleSeries.rx ? "none" : "line-through",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 10,
            height: 10,
            backgroundColor: "#faad14",
            marginRight: 4,
            borderRadius: "50%",
          }}
        />
        接收 (In)
      </span>
      <span
        onClick={() => toggleSeries("tx")}
        style={{
          cursor: "pointer",
          opacity: visibleSeries.tx ? 1 : 0.4,
          textDecoration: visibleSeries.tx ? "none" : "line-through",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 10,
            height: 10,
            backgroundColor: "#52c41a",
            marginRight: 4,
            borderRadius: "50%",
          }}
        />
        发送 (Out)
      </span>
    </div>
  );

  if (data.length === 0) {
    return {
      chart: <Empty description="暂无数据" />,
      legend: legend,
    };
  }

  return {
    chart: <div ref={chartRef} style={{ width: "100%", height: 300 }} />,
    legend: legend,
  };
};

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ nodeUid }) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("hour");
  const [cpuData, setCpuData] = useState<PerformanceData[]>([]);
  const [memData, setMemData] = useState<PerformanceData[]>([]);
  const [netData, setNetData] = useState<NetworkPerformanceData[]>([]);
  const [loadavgData, setLoadavgData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(false);
  const hasLoadedRef = useRef(false);

  // Use network chart hook to get both chart and legend
  const networkChartResult = useNetworkChart(netData);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      const [cpuResponse, memResponse, netResponse, loadavgResponse] =
        await Promise.all([
          nodeApi.getPerformanceCpu(nodeUid, timeFrame),
          nodeApi.getPerformanceMem(nodeUid, timeFrame),
          nodeApi.getPerformanceNet(nodeUid, timeFrame),
          nodeApi.getPerformanceLoadavg(nodeUid, timeFrame),
        ]);

      if (cpuResponse.code === 200) {
        setCpuData(cpuResponse.data);
      }
      if (memResponse.code === 200) {
        setMemData(memResponse.data);
      }
      if (netResponse.code === 200) {
        setNetData(netResponse.data);
      }
      if (loadavgResponse.code === 200) {
        setLoadavgData(loadavgResponse.data);
      }
    } catch (error) {
      message.error("获取性能数据失败");
      console.error("Failed to load performance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadPerformanceData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hasLoadedRef.current) {
      loadPerformanceData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFrame]);

  return (
    <div style={{ padding: "0 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Select
          value={timeFrame}
          onChange={setTimeFrame}
          options={TIME_FRAME_OPTIONS}
          style={{ width: 120 }}
        />
      </div>

      <Spin spinning={loading}>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <Card
            title="CPU 使用率"
            variant="outlined"
            styles={{ body: { padding: 16 } }}
          >
            <ChartComponent
              data={cpuData}
              title="CPU 使用率"
              color="#1890ff"
              unit="%"
              formatter={v => `${v.toFixed(2)}%`}
            />
          </Card>

          <Card
            title="内存使用率"
            variant="outlined"
            styles={{ body: { padding: 16 } }}
          >
            <ChartComponent
              data={memData}
              title="内存使用率"
              color="#52c41a"
              unit="%"
              formatter={v => `${v.toFixed(2)}%`}
            />
          </Card>

          <Card
            title="网络流量"
            variant="outlined"
            styles={{ body: { padding: 16 } }}
            extra={networkChartResult.legend}
          >
            {networkChartResult.chart}
          </Card>

          <Card
            title="系统负载"
            variant="outlined"
            styles={{ body: { padding: 16 } }}
          >
            <ChartComponent
              data={loadavgData}
              title="系统负载"
              color="#f5222d"
              unit=""
              formatter={v => v.toFixed(2)}
            />
          </Card>
        </div>
      </Spin>
    </div>
  );
};

export default PerformanceMonitor;
