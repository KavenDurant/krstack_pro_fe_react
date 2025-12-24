import React, { useState, useEffect, useRef } from "react";
import { Card, Select, Spin, message, Empty } from "antd";
import * as echarts from "echarts";
import type { EChartsOption } from "echarts";
import { nodeApi } from "@/api";
import type { PerformanceData } from "@/api";

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

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const formatTimestamp = (timestamp: number): string => {
      const date = new Date(timestamp * 1000);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${month}-${day} ${hours}:${minutes}`;
    };

    const option: EChartsOption = {
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.map(item => formatTimestamp(item.timestamp)),
        axisLabel: {
          rotate: 45,
          fontSize: 10,
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
          data: data.map(item => item.value),
        },
      ],
      tooltip: {
        trigger: "axis",
        formatter: (params: unknown) => {
          const param = (params as Array<{ value: number; name: string }>)[0];
          const value = formatter
            ? formatter(param.value)
            : `${param.value.toFixed(2)} ${unit}`;
          return `${param.name}<br/>${title}: ${value}`;
        },
      },
    };

    chartInstanceRef.current.setOption(option);

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

  if (data.length === 0) {
    return <Empty description="暂无数据" />;
  }

  return <div ref={chartRef} style={{ width: "100%", height: 300 }} />;
};

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ nodeUid }) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("hour");
  const [cpuData, setCpuData] = useState<PerformanceData[]>([]);
  const [memData, setMemData] = useState<PerformanceData[]>([]);
  const [netData, setNetData] = useState<PerformanceData[]>([]);
  const [loadavgData, setLoadavgData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(false);
  const hasLoadedRef = useRef(false);

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
          >
            <ChartComponent
              data={netData}
              title="网络流量"
              color="#faad14"
              unit="MB/s"
              formatter={v => `${v.toFixed(2)} MB/s`}
            />
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
