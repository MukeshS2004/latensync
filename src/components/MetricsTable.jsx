import { useState, useEffect } from "react";
import axios from "axios";

export default function MetricsTable({ setSelectedDevice }) {
  const [metrics, setMetrics] = useState([]);
  const [deviceIds, setDeviceIds] = useState([]); // Add this line to store device IDs
  const [selectedDeviceId, setSelectedDeviceId] = useState(null); // Add state for selected device

  // Fetch all device IDs
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/devices")
      .then((response) => {
        console.log("Device IDs:", response.data); // Debugging
        if (response.data.length > 0) {
          setDeviceIds(response.data); // Correct the issue here
          setSelectedDeviceId(response.data[0]); // Set first device as selected
        }
      })
      .catch((error) => console.error("Error fetching device IDs:", error));
  }, []);

  // Fetch network metrics for the selected device
  useEffect(() => {
    if (!selectedDeviceId) return; // Don't start SSE if no device is selected

    const eventSource = new EventSource(
      `http://localhost:8080/api/metrics/stream/${selectedDeviceId}`
    );

    eventSource.onmessage = (event) => {
      console.log("Received SSE Data:", event.data); // Debugging
      const data = JSON.parse(event.data);
      setMetrics((prevMetrics) => [...prevMetrics, data]);
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [selectedDeviceId]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <table className="w-full border-collapse text-white">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="p-3">Device ID</th>
            <th className="p-3">Latency</th>
            <th className="p-3">Packet Loss</th>
            <th className="p-3">Throughput</th>
            <th className="p-3">Jitter</th>
          </tr>
        </thead>
        <tbody>
          {metrics.length > 0 ? (
            metrics.map((m) => (
              <tr
                key={m.deviceId}
                className="cursor-pointer hover:bg-gray-700 text-white"
                onClick={() => setSelectedDevice(m.deviceId)}
              >
                <td className="p-3">{m.deviceId}</td>
                <td className="p-3">{m.latency}</td>
                <td className="p-3">{m.packet_loss}</td>
                <td className="p-3">{m.throughput}</td>
                <td className="p-3">{m.jitter}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-3 text-center text-white" colSpan="5">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
