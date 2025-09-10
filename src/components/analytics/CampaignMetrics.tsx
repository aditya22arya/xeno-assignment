import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface MetricsProps {
  data: {
    delivered: number;
    failed: number;
    pending: number;
    total: number;
    timeline: Array<{
      date: string;
      delivered: number;
      failed: number;
    }>;
  };
}

export function CampaignMetrics({ data }: MetricsProps) {
  const deliveryData = [
    { name: "Delivered", value: data.delivered },
    { name: "Failed", value: data.failed },
    { name: "Pending", value: data.pending },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Delivery Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={deliveryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Delivery Timeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.timeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="delivered" stroke="#8884d8" />
            <Line type="monotone" dataKey="failed" stroke="#ff0000" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
