import React, { useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";

import "grapesjs-preset-webpage"; // optional plugins
import "grapesjs-blocks-basic";

export default function ReportDesigner({ template, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      const editor = grapesjs.init({
        container: "#gjs",
        height: "500px",
        storageManager: false, // don't persist automatically
        plugins: ["gjs-preset-webpage", "gjs-blocks-basic"],
        pluginsOpts:{
            "gjs-preset-webpage": {},
            "gjs-blocks-basic": {}
        },
        components: template || "<h1>New Report</h1>",
      });

      editor.BlockManager.add("data-field",{
        label:"Data field",
        category: "Dynamic",
        content:"{{field_name}}"
      });

      editor.DomComponents.addType("text", {
        model:{
            defaults:{
                traits:[
                    {
                        type:"select",
                        label:"Field",
                        name:"field",
                        options:[
                            {id:"produto", name:"Produto"},
                            {id:"valor_liquido", name:"Valor Líquido"},
                            {id:"order_date", name:"Data do pedido"}
                        ]
                    }
                ]
            }
        },
        init(){
            this.listenTo(this, "change:field", this.updateField);
        },

        updateField() {
            const field = this.get("field");
            this.set("content", `{{${field}}}`);
        }
      });

      editor.BlockManager.add("data-table", {
        label: "Data Table",
        category: "Dynamic",
        content: `
            <table border="1" style="width:100%">
            <thead>
                <tr>
                <th>Produto</th>
                <th>Valor Líquido</th>
                </tr>
            </thead>
            <tbody>
                {% for row in data %}
                <tr>
                <td>{{ row.produto }}</td>
                <td>{{ row.valor_liquido }}</td>
                </tr>
                {% endfor %}
            </tbody>
            </table>
        `
      });


      editor.on("update", () => {
        const html = editor.getHtml();
        onChange(html);
      });
      editorRef.current = editor;
    }
  }, []);

  return (
    <div>
      <div id="gjs"></div>
    </div>
  );
}
