import { useEffect, useState } from "react";
import API from "../services/api";

export default function StockLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await API.get("/stocklogs");
    setLogs(res.data.logs);
  };

  return (
    <div className="p-4">
      <h2>📜 Stock Update History</h2>

      <table className="table mt-3 table-striped">
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty Change</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{log.product?.name}</td>
              <td>{log.qtyChange}</td>
              <td>{log.type}</td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
