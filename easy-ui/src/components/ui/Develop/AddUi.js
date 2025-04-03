import React, { useState, useEffect } from "react";
import "../../../assets/styles/Develop/AddUi.css";
import { saveUIComponent } from "../../../services/uiComponentsService";
import { showAlert } from "../../utils/Alert";
import Spinner from "../../utils/Spinner";
import MonacoEditor from "@monaco-editor/react";

function AddUi() {
  const [name, setName] = useState("");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [activeTab, setActiveTab] = useState("html");
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [uniqueId] = useState(`ui-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(() => {
        // Handle resize logic here
      }, 0);
    });

    const editorContainer = document.querySelector(".editor");
    if (editorContainer) {
      resizeObserver.observe(editorContainer);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleCodeChange = (value) => {
    if (activeTab === "html") setHtml(value || "");
    if (activeTab === "css") setCss(value || "");
    if (activeTab === "js") setJs(value || "");
  };

  const handleSubmit = () => {
    setIsPreviewing(true);
    setTimeout(() => {
      const iframe = document.getElementById("live-preview");

      // Remove <style> and <script> tags from CSS and JS
      const sanitizedCss = css.replace(/<style[^>]*>|<\/style>/gi, "");
      const sanitizedJs = js.replace(/<script[^>]*>|<\/script>/gi, "");

      // Add uniqueId to all classes in HTML
      const scopedHtml = html.replace(
        /class=['"]([\w-\s]+)['"]/g,
        (match, classNames) =>
          `class="${uniqueId} ${classNames
            .split(" ")
            .map((cls) => `${uniqueId}-${cls}`)
            .join(" ")}"`
      );

      // Add uniqueId to all classes in CSS
      const scopedCss = sanitizedCss.replace(/\.([\w-]+)/g, `.${uniqueId}-$1`);

      // Add uniqueId to all class selectors in JS
      const scopedJs = sanitizedJs
        .replace(/document\.querySelector\((.*?)\)/g, (match, selector) =>
          selector.includes(".")
            ? `document.querySelector(${selector}.replace(/\\.([\w-]+)/g, ".${uniqueId}-$1"))`
            : match
        )
        .replace(/document\.querySelectorAll\((.*?)\)/g, (match, selector) =>
          selector.includes(".")
            ? `document.querySelectorAll(${selector}.replace(/\\.([\w-]+)/g, ".${uniqueId}-$1"))`
            : match
        );

      const documentContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <style>${scopedCss}</style>
        </head>
        <body>
          ${scopedHtml}
          <script>${scopedJs}<\/script>
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
      const payload = { name, html, css, js, uniqueId };
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
            <MonacoEditor
              height="100%"
              defaultLanguage={activeTab === "html" ? "html" : activeTab}
              value={
                activeTab === "html" ? html : activeTab === "css" ? css : js
              }
              onChange={handleCodeChange}
              theme="vs-dark" // Set dark theme
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
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
