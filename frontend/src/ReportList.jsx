import React, { useState, useEffect } from "react";
import axios from "axios";
import ReportRunner from "./ReportRunner";

export default function ReportList() {
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get("/reports/").then(res => setReports(res.data));
  }, []);

  return (
    <div>
      <h1>Available Reports</h1>
      <ul>
        {reports.map(r => (
          <li key={r.name}>
            <button onClick={() => setSelected(r)}>{r.name}</button>
          </li>
        ))}
      </ul>
      {selected && <ReportRunner report={selected} />}
    </div>
  );
}
