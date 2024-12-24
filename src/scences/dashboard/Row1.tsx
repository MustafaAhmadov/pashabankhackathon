import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { useTheme } from "@mui/material";
import { data } from "../../data";
import { useMemo } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Entry = {
  "Satılan Miqdar": number; // Match the correct property
  [key: string]: any; // For additional properties if needed
};

type Data = {
  [category: string]: Entry[];
};

const Row1 = () => {
  const { palette } = useTheme();

  const rowLineData = useMemo(() => {
    const dataMap: Data = {};
    data.forEach((entry) => {
      const category = entry["Kateqoriya"];
      if (!dataMap[category]) {
        dataMap[category] = [];
      }
      dataMap[category].push({
        "Satılan Miqdar": entry["qty"], // Match the correct property
      });
    });

    const result = Object.entries(dataMap).map(([name, value]) => {
      const total = value.reduce(
        (acc, curr) => acc + curr["Satılan Miqdar"],
        0
      ); // Match the correct property
      return {
        name,
        "Satılan Miqdar": total, // Match the correct property
      };
    });
    console.log(result);
    return result;
  }, []);

  const pieData = useMemo(() => {
    const supplierMap: { [key: string]: number } = {};
    data.forEach((entry) => {
      const supplier = entry["Təchizatçı"];
      if (!supplierMap[supplier]) {
        supplierMap[supplier] = 0;
      }
      supplierMap[supplier] += entry["qty"];
    });

    const totalQty = Object.values(supplierMap).reduce(
      (acc, qty) => acc + qty,
      0
    );

    return Object.entries(supplierMap).map(([name, value]) => ({
      name,
      value: Math.round((value / totalQty) * 100), // Round the percentage
    }));
  }, []);

  const revenueExpenseData = useMemo(() => {
    return data.map((entry) => ({
      Tarix: entry["Tarix"],
      "Sabit Xərclər": entry["Sabit Xərclər (AZN)"],
      "Marketinq Xərcləri": entry["Marketinq Xərcləri (AZN)"],
      "Ümumi gəlir": entry["qty"] * entry["Satış Qiyməti (AZN)"],
    }));
  }, []);

  const COLORS = [
    palette.primary[300],
    palette.secondary[300],
    palette.tertiary[300],
  ];

  return (
    <>
      <DashboardBox gridArea="c">
        <BoxHeader
          title="Kateqoriyalar üzrə satılan miqdar"
          subtitle="Graph representing the sales quantity by category"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={500}
            data={rowLineData}
            margin={{
              top: 17,
              right: 15,
              left: -5,
              bottom: 58,
            }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <Tooltip />
            <Bar dataKey="Satılan Miqdar" fill="url(#colorRevenue)" />
          </BarChart>
        </ResponsiveContainer>
      </DashboardBox>

      <DashboardBox gridArea="a">
        <BoxHeader
          title="Təchizatçı üzrə faizlər"
          subtitle="Pie chart representing the supplier percentages"
          sideText=""
        />
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill={palette.primary.main}
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </DashboardBox>

      <DashboardBox gridArea="b">
        <BoxHeader
          title="Tarix üzrə gəlir və xərclər"
          subtitle="Chart showing fixed costs, marketing costs, and total revenue over time"
          sideText=""
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={revenueExpenseData}
            margin={{
              top: 17,
              right: 15,
              left: -5,
              bottom: 58,
            }}
          >
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="Tarix"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Sabit Xərclər"
              stroke={palette.primary.main}
            />
            <Line
              type="monotone"
              dataKey="Marketinq Xərcləri"
              stroke={palette.secondary.main}
            />
            <Line
              type="monotone"
              dataKey="Ümumi gəlir"
              stroke={palette.tertiary.main}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>
    </>
  );
};

export default Row1;
