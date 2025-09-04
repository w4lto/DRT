import React, { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";

import gjsPresetWebpage from "grapesjs-preset-webpage";
import gjsBlocksBasic from "grapesjs-blocks-basic";

export default function ReportDesigner({ template, onChange, availableFields }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      const editor = grapesjs.init({
        container: "#gjs",
        height: "500px",
        storageManager: false,
        fromElement: false,
        plugins: [gjsPresetWebpage, gjsBlocksBasic],
        pluginsOpts: {
          [gjsPresetWebpage]: {},
          [gjsBlocksBasic]: {},
        },
        panels: {
          defaults: [
            {
              id: "blocks",
              el: ".panel__blocks",
              buttons: [
                {
                  id: "show-blocks",
                  active: true,
                  label: "Blocks",
                  command: "open-blocks",
                  togglable: false,
                },
              ],
            },
          ],
        },
      });

      // 🔹 Register Data Field block
      editor.BlockManager.add("data-field", {
        label: "Data Field",
        category: "Dynamic",
        content: { type: "data-field", content: "{{ field }}" },
      });

      // 🔹 Register Data Field type
      editor.DomComponents.addType("data-field", {
        model: {
          defaults: {
            tagName: "span",
            field: "",
            traits: [
              {
                type: "select",
                label: "Field",
                name: "field",
                options: [], // start empty
              },
            ],
          },

          init() {
            this.listenTo(this, "change:field", this.updateField);
          },

          updateField() {
            const field = this.get("field");
            if (field) {
              this.set("content", `{{ ${field} }}`);
            }
          },
        },
      });

      // 🔹 Register Data Table block
      editor.BlockManager.add("data-table", {
        label: "Data Table",
        category: "Dynamic",
        content: `
          <table border="1" style="width:100%">
            <thead>
              <tr>${(availableFields || []).map(f => `<th>${f}</th>`).join("")}</tr>
            </thead>
            <tbody>
              {% for row in data %}
              <tr>
                ${(availableFields || [])
                  .map(f => `<td>{{ row.${f} }}</td>`)
                  .join("")}
              </tr>
              {% endfor %}
            </tbody>
          </table>
        `,
      });

      editor.on("update", () => {
        onChange(editor.getHtml());
      });

      editorRef.current = editor;
    }
  }, []);

  // 🔹 whenever availableFields changes, update the trait options
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && availableFields) {
      editor.DomComponents.getTypes().forEach(type => {
        if (type.id === "data-field") {
          type.model.prototype.defaults.traits[0].options = availableFields.map(f => ({
            id: f,
            name: f,
          }));
        }
      });
    }
  }, [availableFields]);

  return (
    <div style={{ display: "flex" }}>
      <div className="panel__blocks" style={{ width: "250px" }}></div>
      <div id="gjs" style={{ flexGrow: 1 }}></div>
    </div>
  );
}
