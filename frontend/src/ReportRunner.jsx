import React, { useState } from "react";
import axios from "axios";

export default function ReportRunner({ report }) {
  const [params, setParams] = useState({});

  const handleChange = (name, value) => {
    setParams(prev => ({ ...prev, [name]: value }));
  };

  const runReport = async () => {
    const response = await axios.get(`http://localhost:8000/reports/${report.name}`, {
      params,
      responseType: "blob"
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${report.name}.pdf`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <h2>{report.name}</h2>
      {report.params.map(p => (
        <div key={p.name}>
          <label>{p.name}:</label>
          <input
            type={p.type === "date" ? "date" : p.type === "number" ? "number" : "text"}
            required={p.required}
            value={params[p.name] || ""}
            onChange={e => handleChange(p.name, e.target.value)}
          />
        </div>
      ))}
      <button onClick={runReport}>Generate PDF</button>
    </div>
  );
}
