import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { ResponsiveBoxPlot } from "@nivo/boxplot";

interface ChartRendererProps {
  chart: Chart;
  data: any[];
  schema?: Schema;
}

export default function ChartRenderer({
  chart,
  data,
  schema,
}: ChartRendererProps) {
  const theme = useTheme();

  // Process data based on chart configuration
  const processedData = useMemo(() => {
    if (!schema || !data.length) return [];

    // Parse field identifiers (format: "Section Name|Field Name")
    let xSectionName = "";
    let xFieldName = "";
    let ySectionName = "";
    let yFieldName = "";

    if (chart.xAxis) {
      const xParts = chart.xAxis.split(" - ");
      if (xParts.length === 2) {
        xSectionName = xParts[0];
        xFieldName = xParts[1];
      } else {
        // Backwards compatibility: if no - separator, assume it's just field name
        xFieldName = chart.xAxis;
      }
    }

    if (chart.yAxis) {
      const yParts = chart.yAxis.split(" - ");
      if (yParts.length === 2) {
        ySectionName = yParts[0];
        yFieldName = yParts[1];
      } else {
        // Backwards compatibility: if no - separator, assume it's just field name
        yFieldName = chart.yAxis;
      }
    }

    // Find field indices by section and field name
    // Build flat array with section tracking for absolute indices
    let xFieldIndex = -1;
    let yFieldIndex = -1;
    let absoluteIndex = 0;

    for (
      let sectionIdx = 0;
      sectionIdx < schema.sections.length;
      sectionIdx++
    ) {
      const section = schema.sections[sectionIdx];

      for (let fieldIdx = 0; fieldIdx < section.fields.length; fieldIdx++) {
        const field = section.fields[fieldIdx];

        // Check X-axis field
        if (xFieldIndex === -1 && field.name === xFieldName) {
          // If section name was specified, only match if it's the right section
          if (!xSectionName || section.title === xSectionName) {
            xFieldIndex = absoluteIndex;
          }
        }

        // Check Y-axis field
        if (yFieldIndex === -1 && yFieldName && field.name === yFieldName) {
          // If section name was specified, only match if it's the right section
          if (!ySectionName || section.title === ySectionName) {
            yFieldIndex = absoluteIndex;
          }
        }

        absoluteIndex++;
      }
    }

    if (xFieldIndex === -1) return [];

    // For line charts, we need to determine what field to group by for multiple lines
    // Typically: X-axis = Match Number, group by Team Number to create one line per team
    let groupByFieldIndex = -1;
    let groupByFieldName = "";
    
    if (chart.type === "line" && chart.groupBy) {
      // Use explicit groupBy field if specified
      const groupByParts = chart.groupBy.split(" - ");
      if (groupByParts.length === 2) {
        groupByFieldName = groupByParts[1];
        // Find the field index for groupBy
        absoluteIndex = 0;
        for (let sectionIdx = 0; sectionIdx < schema.sections.length; sectionIdx++) {
          const section = schema.sections[sectionIdx];
          for (let fieldIdx = 0; fieldIdx < section.fields.length; fieldIdx++) {
            const field = section.fields[fieldIdx];
            if (field.name === groupByFieldName && (section.title === groupByParts[0] || !groupByParts[0])) {
              groupByFieldIndex = absoluteIndex;
              break;
            }
            absoluteIndex++;
          }
          if (groupByFieldIndex !== -1) break;
        }
      }
    } else if (chart.type === "line" && xFieldName === "Match Number") {
      // Auto-detect: if X-axis is Match Number, group by Team Number
      absoluteIndex = 0;
      for (let sectionIdx = 0; sectionIdx < schema.sections.length; sectionIdx++) {
        const section = schema.sections[sectionIdx];
        for (let fieldIdx = 0; fieldIdx < section.fields.length; fieldIdx++) {
          const field = section.fields[fieldIdx];
          if (field.name === "Team Number") {
            groupByFieldIndex = absoluteIndex;
            groupByFieldName = "Team Number";
            break;
          }
          absoluteIndex++;
        }
        if (groupByFieldIndex !== -1) break;
      }
    }

    // Group data - for line charts with grouping, use nested map; otherwise simple map
    let groupedByLine: Map<string, Map<string, number[]>> | null = null;
    let groupedSimple: Map<string, number[]> | null = null;

    if (chart.type === "line" && groupByFieldIndex !== -1) {
      groupedByLine = new Map<string, Map<string, number[]>>();
    } else {
      groupedSimple = new Map<string, number[]>();
    }

    data.forEach((item) => {
      if (!item || !item.decoded || !item.decoded.data) return;

      const xValue = item.decoded.data[xFieldIndex];
      if (xValue === undefined || xValue === null) return;

      const xKey = String(xValue);

      let yValue = 1; // Default for count when no y-axis
      if (yFieldIndex !== -1) {
        const rawYValue = item.decoded.data[yFieldIndex];
        if (rawYValue !== undefined && rawYValue !== null) {
          const numValue = Number(rawYValue);
          if (!isNaN(numValue)) {
            yValue = numValue;
          }
        }
      }

      if (chart.type === "line" && groupByFieldIndex !== -1 && groupedByLine) {
        // For line charts with grouping: group by team/groupBy, then by X-axis value
        const groupValue = item.decoded.data[groupByFieldIndex];
        if (groupValue === undefined || groupValue === null) return;
        const groupKey = String(groupValue);
        
        if (!groupedByLine.has(groupKey)) {
          groupedByLine.set(groupKey, new Map<string, number[]>());
        }
        const groupMap = groupedByLine.get(groupKey)!;
        
        if (!groupMap.has(xKey)) {
          groupMap.set(xKey, []);
        }
        groupMap.get(xKey)!.push(yValue);
      } else if (groupedSimple) {
        // For other chart types or line charts without grouping: group by X-axis value
        if (!groupedSimple.has(xKey)) {
          groupedSimple.set(xKey, []);
        }
        groupedSimple.get(xKey)!.push(yValue);
      }
    });

    // Handle line charts - create one line per group (team)
    // Format: [{ id: "123", data: [{x: 1, y: 10}, {x: 2, y: 15}] }, { id: "456", data: [...] }]
    if (chart.type === "line" && groupByFieldIndex !== -1 && groupedByLine) {
      const result: Array<{ id: string; data: Array<{ x: string | number; y: number }> }> = [];
      
      groupedByLine.forEach((xValueMap, groupKey) => {
        const lineData: Array<{ x: string | number; y: number }> = [];
        
        // For each X-axis value (e.g., match number), aggregate the Y-values
        xValueMap.forEach((yValues, xKey) => {
          let aggregatedValue = 0;
          
          switch (chart.aggregation || "average") {
            case "sum":
              aggregatedValue = yValues.reduce((a, b) => a + b, 0);
              break;
            case "average":
              aggregatedValue = yValues.reduce((a, b) => a + b, 0) / yValues.length;
              break;
            case "count":
              aggregatedValue = yValues.length;
              break;
            case "min":
              aggregatedValue = Math.min(...yValues);
              break;
            case "max":
              aggregatedValue = Math.max(...yValues);
              break;
          }
          
          // Try to convert X-key to number if possible (for proper sorting)
          const xNum = Number(xKey);
          const xValue = !isNaN(xNum) && isFinite(xNum) ? xNum : xKey;
          
          lineData.push({
            x: xValue,
            y: aggregatedValue,
          });
        });
        
        // Sort line data by X value
        lineData.sort((a, b) => {
          const aNum = typeof a.x === 'number' ? a.x : Number(a.x);
          const bNum = typeof b.x === 'number' ? b.x : Number(b.x);
          if (!isNaN(aNum) && !isNaN(bNum)) {
            return aNum - bNum;
          }
          return String(a.x).localeCompare(String(b.x));
        });
        
        if (lineData.length > 0) {
          result.push({
            id: groupKey,
            data: lineData,
          });
        }
      });
      
      // Sort lines if sortMode is specified
      if (chart.sortMode && result.length > 0) {
        if (chart.sortMode === "ascending") {
          result.sort((a, b) => {
            const aAvg = a.data.reduce((sum, d) => sum + d.y, 0) / a.data.length;
            const bAvg = b.data.reduce((sum, d) => sum + d.y, 0) / b.data.length;
            return aAvg - bAvg;
          });
        } else if (chart.sortMode === "descending") {
          result.sort((a, b) => {
            const aAvg = a.data.reduce((sum, d) => sum + d.y, 0) / a.data.length;
            const bAvg = b.data.reduce((sum, d) => sum + d.y, 0) / b.data.length;
            return bAvg - aAvg;
          });
        }
      }
      
      return result;
    }

    // Handle boxplot differently - it needs flat array of individual data points
    // Format: [{ group: "123", value: 1 }, { group: "123", value: 2 }, ...]
    if (chart.type === "boxplot") {
      if (!groupedSimple) return [];
      const result: Array<{ group: string; value: number }> = [];
      let allValues: number[] = []; // Collect all values for min/max calculation

      groupedSimple.forEach((values: number[], key: string) => {
        // Filter out invalid values and keep all raw values
        values.forEach((v: number) => {
          const num = typeof v === 'number' ? v : Number(v);
          if (!isNaN(num) && isFinite(num) && num !== null && num !== undefined) {
            result.push({
              group: String(key),
              value: num,
            });
            allValues.push(num);
          }
        });
      });

      // Sort by median value if sortMode is specified
      // For flat array format, we need to group by group first, calculate median, then sort
      if (chart.sortMode && result.length > 0) {
        // Group data points by group to calculate medians
        const groupMedians = new Map<string, number[]>();
        result.forEach((item) => {
          if (!groupMedians.has(item.group)) {
            groupMedians.set(item.group, []);
          }
          groupMedians.get(item.group)!.push(item.value);
        });

        const getMedian = (arr: number[]) => {
          const sorted = [...arr].sort((a, b) => a - b);
          const mid = Math.floor(sorted.length / 2);
          return sorted.length % 2 === 0
            ? (sorted[mid - 1] + sorted[mid]) / 2
            : sorted[mid];
        };

        // Calculate median for each group
        const groupMedianMap = new Map<string, number>();
        groupMedians.forEach((values, group) => {
          groupMedianMap.set(group, getMedian(values));
        });

        // Sort the flat array by group median
        if (chart.sortMode === "ascending") {
          result.sort((a, b) => {
            const medianA = groupMedianMap.get(a.group) || 0;
            const medianB = groupMedianMap.get(b.group) || 0;
            return medianA - medianB;
          });
        } else if (chart.sortMode === "descending") {
          result.sort((a, b) => {
            const medianA = groupMedianMap.get(a.group) || 0;
            const medianB = groupMedianMap.get(b.group) || 0;
            return medianB - medianA;
          });
        }
      }

      // Store min/max in result metadata for use in rendering
      if (allValues.length > 0) {
        const minValue = Math.min(...allValues);
        const maxValue = Math.max(...allValues);
        // Add padding of 5% to the range
        const range = maxValue - minValue;
        const padding = range * 0.05 || 1;
        (result as any).__minValue = minValue - padding;
        (result as any).__maxValue = maxValue + padding;
      }

      return result;
    }

    // For line charts without grouping, create a single line
    if (chart.type === "line" && groupByFieldIndex === -1 && groupedSimple) {
      const result: Array<{ id: string; data: Array<{ x: string | number; y: number }> }> = [];
      const lineData: Array<{ x: string | number; y: number }> = [];
      
      groupedSimple.forEach((values, xKey) => {
        let aggregatedValue = 0;
        
        switch (chart.aggregation || "average") {
          case "sum":
            aggregatedValue = values.reduce((a, b) => a + b, 0);
            break;
          case "average":
            aggregatedValue = values.reduce((a, b) => a + b, 0) / values.length;
            break;
          case "count":
            aggregatedValue = values.length;
            break;
          case "min":
            aggregatedValue = Math.min(...values);
            break;
          case "max":
            aggregatedValue = Math.max(...values);
            break;
        }
        
        const xNum = Number(xKey);
        const xValue = !isNaN(xNum) && isFinite(xNum) ? xNum : xKey;
        
        lineData.push({
          x: xValue,
          y: aggregatedValue,
        });
      });
      
      // Sort by X value
      lineData.sort((a, b) => {
        const aNum = typeof a.x === 'number' ? a.x : Number(a.x);
        const bNum = typeof b.x === 'number' ? b.x : Number(b.x);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        }
        return String(a.x).localeCompare(String(b.x));
      });
      
      if (lineData.length > 0) {
        result.push({
          id: chart.name || "data",
          data: lineData,
        });
      }
      
      return result;
    }

    // For other chart types (bar, pie, scatter), aggregate the values
    if (!groupedSimple) return [];
    const result: any[] = [];
    groupedSimple.forEach((values, key) => {
      let aggregatedValue = 0;
      
      switch (chart.aggregation) {
        case "sum":
          aggregatedValue = values.reduce((a, b) => a + b, 0);
          break;
        case "average":
          aggregatedValue = values.reduce((a, b) => a + b, 0) / values.length;
          break;
        case "count":
          aggregatedValue = values.length;
          break;
        case "min":
          aggregatedValue = Math.min(...values);
          break;
        case "max":
          aggregatedValue = Math.max(...values);
          break;
      }

      result.push({
        id: key,
        label: key,
        value: aggregatedValue,
        x: key,
        y: aggregatedValue,
      });
    });

    // Sort result if sortMode is specified (for bar charts)
    if (chart.sortMode && chart.type === "bar") {
      if (chart.sortMode === "ascending") {
        result.sort((a, b) => a.value - b.value);
      } else if (chart.sortMode === "descending") {
        result.sort((a, b) => b.value - a.value);
      }
      // "none" or undefined means no sorting
    }

    return result;
  }, [chart, data, schema]);

  const chartTheme = {
    axis: {
      ticks: {
        text: { fill: theme.palette.text.primary },
      },
      legend: {
        text: { fill: theme.palette.text.primary },
      },
    },
    legends: {
      text: { fill: theme.palette.text.primary },
    },
    labels: {
      text: { fill: theme.palette.text.primary },
    },
    tooltip: {
      container: {
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
      },
    },
  };

  if (processedData.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          overflow: "visible",
        }}
      >
        <Typography color="text.secondary">No data available</Typography>
      </Box>
    );
  }

  const chartContainerSx = {
    width: "100%",
    height: "100%",
    overflow: "visible" as const,
    position: "relative" as const,
  };

  switch (chart.type) {
    case "bar":
      return (
        <Box sx={chartContainerSx}>
        <ResponsiveBar
          data={processedData}
          keys={["value"]}
          indexBy="id"
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          padding={0.3}
          colors={{ scheme: "nivo" }}
          theme={chartTheme}
          axisBottom={{
            tickRotation: -45,
            legend: chart.xAxis,
            legendPosition: "middle",
            legendOffset: 40,
          }}
          axisLeft={{
            legend: chart.yAxis || "Value",
            legendPosition: "middle",
            legendOffset: -50,
          }}
        />
        </Box>
      );

    case "line":
      return (
        <Box sx={chartContainerSx}>
        <ResponsiveLine
          data={processedData}
          margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "linear", min: "auto", max: "auto" }}
          yScale={{ type: "linear", min: "auto", max: "auto" }}
          curve="monotoneX"
          colors={{ scheme: "nivo" }}
          theme={chartTheme}
          axisBottom={{
            legend: chart.xAxis,
            legendPosition: "middle",
            legendOffset: 40,
          }}
          axisLeft={{
            legend: chart.yAxis || "Value",
            legendPosition: "middle",
            legendOffset: -50,
          }}
          pointSize={8}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          enableSlices={false}
          useMesh={true}
          enableTouchCrosshair={true}
          legends={Array.isArray(processedData) && processedData.length > 1 && processedData[0]?.id ? [
            {
              anchor: "bottom-right",
              direction: "column",
              translateX: 100,
              itemWidth: 80,
              itemHeight: 20,
              symbolShape: "circle",
            },
          ] : []}
        />
        </Box>
      );

    case "pie":
      return (
        <Box sx={chartContainerSx}>
        <ResponsivePie
          data={processedData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={{ scheme: "nivo" }}
          theme={chartTheme}
          arcLinkLabelsTextColor={theme.palette.text.primary}
          arcLabelsTextColor={theme.palette.background.paper}
        />
        </Box>
      );

    case "scatter":
      return (
        <Box sx={chartContainerSx}>
        <ResponsiveScatterPlot
          data={[
            {
              id: chart.name,
              data: processedData.map((d) => ({ x: d.x, y: d.y })),
            },
          ]}
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          xScale={{ type: "linear" }}
          yScale={{ type: "linear" }}
          colors={{ scheme: "nivo" }}
          theme={chartTheme}
          axisBottom={{
            legend: chart.xAxis,
            legendPosition: "middle",
            legendOffset: 40,
          }}
          axisLeft={{
            legend: chart.yAxis || "Value",
            legendPosition: "middle",
            legendOffset: -50,
          }}
        />
        </Box>
      );

    case "boxplot":
      return (
        <Box sx={chartContainerSx}>
        <ResponsiveBoxPlot
          theme={chartTheme as any}
          data={processedData}
          margin={{ top: 40, right: 140, bottom: 80, left: 60 }}
          minValue="auto"
          maxValue="auto"
          colors={{ scheme: "nivo" }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: chart.xAxis,
            legendPosition: "middle",
            legendOffset: 60,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: chart.yAxis || "Value",
            legendPosition: "middle",
            legendOffset: -50,
          }}
          borderRadius={2}
          padding={0.12}
        />
        </Box>
      );

    default:
      return <Typography>Unsupported chart type</Typography>;
  }
}
