import React, { useState } from "react";
import "../../../assets/styles/Develop/AddUi.css";
import { saveUIComponent } from "../../../services/uiComponentsService";
import { showAlert } from "../../utils/Alert";
import Spinner from "../../utils/Spinner";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function AddUi() {
  const [name, setName] = useState("");
  const [html, setHtml] = useState("/*html*/");
  const [css, setCss] = useState("/*css*/");
  const [js, setJs] = useState("/*js*/");
  const [activeTab, setActiveTab] = useState("html");
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const handleCodeChange = (value) => {
    if (activeTab === "html") setHtml(value);
    if (activeTab === "css") setCss(value);
    if (activeTab === "js") setJs(value);
  };

  const handleSubmit = () => {
    setIsPreviewing(true);
    setTimeout(() => {
      const iframe = document.getElementById("live-preview");
      const documentContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}<\/script>
        </body>
        </html>
      `;
      iframe.srcdoc = documentContent;
      setIsPreviewing(false);
      showAlert({
        title: "Success",
        message: "Preview updated",
        type: "success",
      });
    }, 500);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { name, html, css, js };
      await saveUIComponent(payload);
      showAlert({
        title: "Success",
        message: "UI Component saved successfully!",
        type: "success",
      });
    } catch (error) {
      showAlert({
        title: "Error",
        message: "Failed to save UI Component!",
        type: "error",
      });
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="add-ui-container">
        <div className="left-panel">
          <div className="tabs">
            <button
              className={activeTab === "html" ? "active" : ""}
              onClick={() => setActiveTab("html")}
            >
              HTML
            </button>
            <button
              className={activeTab === "css" ? "active" : ""}
              onClick={() => setActiveTab("css")}
            >
              CSS
            </button>
            <button
              className={activeTab === "js" ? "active" : ""}
              onClick={() => setActiveTab("js")}
            >
              JS
            </button>
            <input
              className="componentName"
              type="text"
              placeholder="Component Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="editor">
            <SyntaxHighlighter
              language={activeTab}
              style={materialDark}
              showLineNumbers
              wrapLines
              onChange={(e) => handleCodeChange(e.target.value)}
              contentEditable
              suppressContentEditableWarning
            >
              {activeTab === "html" ? html : activeTab === "css" ? css : js}
            </SyntaxHighlighter>
          </div>
        </div>
        <div className="right-panel">
          <div className="actions">
            <button onClick={handleSubmit} disabled={isPreviewing}>
              {isPreviewing ? <Spinner size={12} /> : "Preview"}
            </button>
            <button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Spinner size={12} /> : "Save"}
            </button>
          </div>
          <iframe id="live-preview" title="Live Preview"></iframe>
        </div>
      </div>
    </div>
  );
}

export default AddUi;
