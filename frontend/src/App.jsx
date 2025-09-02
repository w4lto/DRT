import React, { useEffect, useState } from "react";
import axios from "axios";
import ReportRunner from "./ReportRunner";
import ReportEditor from "./ReportEditor";

function App() {
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const loadReports = () => {
    axios.get("http://localhost:8000/reports/").then(res => setReports(res.data));
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div>
      <h1>Available Reports</h1>
      <button onClick={() => setShowEditor(!showEditor)}>
        {showEditor ? "Back to Reports" : "Create New Report"}
      </button>

      {showEditor ? (
        <ReportEditor onSave={loadReports} />
      ) : (
        <>
          <ul>
            {reports.map(r => (
              <li key={r.name}>
                <button onClick={() => setSelected(r)}>{r.name}</button>
              </li>
            ))}
          </ul>
          {selected && <ReportRunner report={selected} />}
        </>
      )}
    </div>
  );
}

export default App;
