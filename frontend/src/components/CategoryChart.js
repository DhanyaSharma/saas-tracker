import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const CHART_COLORS = [
  "#6c63ff","#059669","#dc2626","#d97706",
  "#7c3aed","#0891b2","#db2777","#0d9488",
];

export default function CategoryChart({ data }) {
  if (!data || Object.keys(data).length === 0) return null;

  const chartData = {
    labels: Object.keys(data),
    datasets: [{
      data: Object.values(data),
      backgroundColor: CHART_COLORS.map(c => c + "cc"),
      borderColor: CHART_COLORS,
      borderWidth: 2,
      hoverOffset: 6,
    }],
  };

  const options = {
    responsive: true,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#12151f",
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        titleColor: "#e8eaf6",
        bodyColor: "#8b92b8",
        padding: 10,
        callbacks: { label: ctx => ` ₹${ctx.parsed} — ${ctx.label}` },
      },
    },
  };

  return (
    <div style={{ width: 160, height: 160 }}>
      <Pie data={chartData} options={options}/>
    </div>
  );
}