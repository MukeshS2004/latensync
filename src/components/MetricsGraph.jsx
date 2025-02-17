import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function MetricsGraph({ deviceId }) {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      { label: "Latency", data: [], borderColor: "red", fill: false },
      { label: "Packet Loss", data: [], borderColor: "blue", fill: false },
      { label: "Throughput", data: [], borderColor: "green", fill: false },
      { label: "Jitter", data: [], borderColor: "orange", fill: false },
    ],
  });

  useEffect(() => {
    fetch(`http://localhost:8080/api/metrics/device/${deviceId}`)
      .then((res) => res.json())
      .then((metrics) => {
        const labels = metrics.map((m) =>
          new Date(m.timestamp).toLocaleTimeString()
        );
        const updatedData = {
          labels,
          datasets: [
            {
              label: "Latency",
              data: metrics.map((m) => m.latency),
              borderColor: "red",
              fill: false,
            },
            {
              label: "Packet Loss",
              data: metrics.map((m) => m.packet_loss),
              borderColor: "blue",
              fill: false,
            },
            {
              label: "Throughput",
              data: metrics.map((m) => m.throughput),
              borderColor: "green",
              fill: false,
            },
            {
              label: "Jitter",
              data: metrics.map((m) => m.jitter),
              borderColor: "orange",
              fill: false,
            },
          ],
        };
        setData(updatedData);
      });
  }, [deviceId]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-center text-xl font-semibold mb-4">
        Metrics for Device: {deviceId}
      </h2>
      <Line data={data} />
    </div>
  );
}
