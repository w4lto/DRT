import React, { useState } from "react";

export default function QueryBuilder({ onChange, onColumnsChange }) {
  const [table, setTable] = useState("orders");
  const [columns, setColumns] = useState(["produto", "valor_liquido", "order_date"]);
  const [selectedCols, setSelectedCols] = useState(["produto", "valor_liquido"]);
  const [filters, setFilters] = useState([]);


  const toggleColumn = (col) => {
    if (selectedCols.includes(col)) {
      setSelectedCols(selectedCols.filter(c => c !== col));
    } else {
      setSelectedCols([...selectedCols, col]);
    }
  };

  const addFilter = () => {
    setFilters([...filters, { column: "order_date", op: "BETWEEN", value: ["{{ start_date }}", "{{ end_date }}"] }]);
  };

  const updateFilter = (index, field, value) => {
    const newFilters = [...filters];
    newFilters[index][field] = value;
    setFilters(newFilters);
  };

  const buildSQL = () => {
    let sql = `SELECT ${selectedCols.join(", ")} FROM ${table}`;
    if (filters.length > 0) {
      const where = filters
        .map(f => {
          if (f.op === "BETWEEN") {
            return `${f.column} BETWEEN '${f.value[0]}' AND '${f.value[1]}'`;
          }
          return `${f.column} ${f.op} '${f.value}'`;
        })
        .join(" AND ");
      sql += ` WHERE ${where}`;
    }
    return sql;
  };

  // Notify parent whenever query changes
  React.useEffect(() => {
    onChange(buildSQL());
    if(onColumnsChange){
      onColumnsChange(selectedCols)
    }
  }, [selectedCols, filters]);

  return (
    <div>
      <h3>Query Builder</h3>
      <p>Table: {table}</p>

      <h4>Select Columns</h4>
      {columns.map(c => (
        <label key={c}>
          <input
            type="checkbox"
            checked={selectedCols.includes(c)}
            onChange={() => toggleColumn(c)}
          />
          {c}
        </label>
      ))}

      <h4>Filters</h4>
      {filters.map((f, i) => (
        <div key={i}>
          <select
            value={f.column}
            onChange={e => updateFilter(i, "column", e.target.value)}
          >
            {columns.map(c => <option key={c}>{c}</option>)}
          </select>
          <select
            value={f.op}
            onChange={e => updateFilter(i, "op", e.target.value)}
          >
            <option>BETWEEN</option>
            <option>=</option>
            <option>&gt;</option>
            <option>&lt;</option>
          </select>
          {f.op === "BETWEEN" ? (
            <>
              <input value={f.value[0]} onChange={e => {
                const newVal = [...f.value];
                newVal[0] = e.target.value;
                updateFilter(i, "value", newVal);
              }} />
              <input value={f.value[1]} onChange={e => {
                const newVal = [...f.value];
                newVal[1] = e.target.value;
                updateFilter(i, "value", newVal);
              }} />
            </>
          ) : (
            <input value={f.value} onChange={e => updateFilter(i, "value", e.target.value)} />
          )}
        </div>
      ))}
      <button onClick={addFilter}>+ Add Filter</button>

      <h4>Preview SQL</h4>
      <pre>{buildSQL()}</pre>
    </div>
  );
}
