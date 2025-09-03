import React, { useState } from "react";
import axios from "axios";
import QueryBuilder from "./QueryBuilder";
import ReportDesigner from "./ReportDesigner";


export default function ReportEditor({ onSave }) {
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [template, setTemplate] = useState("<h1>New Report</h1>");
  const [params, setParams] = useState([]);

  const addParam = () => {
    setParams([...params, { name: "", type: "text", required: false }]);
  };

  const updateParam = (index, field, value) => {
    const updated = [...params];
    updated[index][field] = value;
    setParams(updated);
  };

  const saveReport = async () => {
    await axios.post("http://localhost:8000/reports/", {
      name,
      query,
      template,
      params,
    });
    alert("Report saved!");
    if (onSave) onSave();
  };

  return (
    <div>
      <h2>Create/Edit Report</h2>
      <label>Report Name:</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <br />

      {/* ✅ Place QueryBuilder here so it can call setQuery */}
      <QueryBuilder onChange={setQuery} />

      <label>SQL Query (preview):</label>
      <textarea
        rows="4"
        cols="60"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <br />

     <h3>Report Designer</h3>
    <ReportDesigner template={template} onChange={setTemplate} />

      <h3>Parameters</h3>
      {params.map((p, i) => (
        <div key={i}>
          <input
            placeholder="Name"
            value={p.name}
            onChange={(e) => updateParam(i, "name", e.target.value)}
          />
          <select
            value={p.type}
            onChange={(e) => updateParam(i, "type", e.target.value)}
          >
            <option value="text">Text</option>
            <option value="date">Date</option>
            <option value="number">Number</option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={p.required}
              onChange={(e) =>
                updateParam(i, "required", e.target.checked)
              }
            />
            Required
          </label>
        </div>
      ))}
      <button onClick={addParam}>+ Add Param</button>
      <br />
      <br />

      <button onClick={saveReport}>Save Report</button>
    </div>
  );
}
