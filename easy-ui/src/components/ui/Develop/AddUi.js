import React, { useState, useEffect, useRef } from "react";
import "../../../assets/styles/Develop/AddUi.css";
import { saveUIComponent } from '../../../services/uiComponentsService';
import { fetchCategories } from "../../../services/categoriesService";
import { showAlert } from "../../utils/Alert";
import Spinner from "../../utils/Spinner";
import MonacoEditor from "@monaco-editor/react";
import apiClient from "../../../config/axios";

function AddUi({
  html: initialHtml = "",
  css: initialCss = "",
  js: initialJs = "",
  name: initialName = "",
  isEdit = true,
}) {
  const [name, setName] = useState(initialName || "");
  const [html, setHtml] = useState(initialHtml || "");
  const [css, setCss] = useState(initialCss || "");
  const [js, setJs] = useState(initialJs || "");
  const [price, setPrice] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("html");
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [uniqueId] = useState(`ui-${Math.random().toString(36).substr(2, 9)}`);
  const editorRef = useRef(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        showAlert({
          title: "Error",
          message: "Failed to load categories",
          type: "error",
        });
      }
    };
    loadCategories();
  }, []);

  const handleCodeChange = (value) => {
    if (activeTab === "html") setHtml(value || "");
    if (activeTab === "css") setCss(value || "");
    if (activeTab === "js") setJs(value || "");
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    // Trigger layout update on window resize
    const handleResize = () => editor.layout();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  };

  // Reusable function to scope and sanitize user input
  const getScopedContent = () => {
    const sanitizedCss = (css || "").replace(/<style[^>]*>|<\/style>/gi, ""); // Ensure non-null value
    const sanitizedJs = (js || "").replace(/<script[^>]*>|<\/script>/gi, ""); // Ensure non-null value

    // Add uniqueId to all classes in HTML
    const scopedHtml = (html || "").replace(
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
      .replace(
        /document\.querySelector\((['"`])(.*?)\1\)/g,
        (match, quote, selector) =>
          `document.querySelector(${quote}${selector.replace(
            /\.([\w-]+)/g,
            `.${uniqueId}-$1`
          )}${quote})`
      )
      .replace(
        /document\.querySelectorAll\((['"`])(.*?)\1\)/g,
        (match, quote, selector) =>
          `document.querySelectorAll(${quote}${selector.replace(
            /\.([\w-]+)/g,
            `.${uniqueId}-$1`
          )}${quote})`
      );

    // Wrap user HTML in a container div
    const wrappedHtml = `${scopedHtml}`;

    return { wrappedHtml, scopedCss, scopedJs };
  };

  const handleSubmit = () => {
    setIsPreviewing(true);
    setTimeout(() => {
      const iframe = document.getElementById("live-preview");
      const { wrappedHtml, scopedCss, scopedJs } = getScopedContent();

      const documentContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <style>${scopedCss}</style>
        </head>
        <body>
          ${wrappedHtml}
          <script>
            try {
              ${scopedJs}
            } catch (error) {
              console.error("Error in user-provided JavaScript:", error);
            }
          </script>
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
    if (!selectedCategory) {
      showAlert({
        title: "Error",
        message: "Please enter select a category",
        type: "error",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { wrappedHtml, scopedCss, scopedJs } = getScopedContent();

      // Save the scoped versions of HTML, CSS, and JS
      const payload = {
        name,
        html: wrappedHtml,
        css: scopedCss,
        js: scopedJs,
        uniqueId,
        price: parseFloat(price),
      };

      // First save the component
      const savedComponent = await saveUIComponent(payload);

      // Then associate it with the category
      await apiClient.post(`/Category/${selectedCategory}/components`, {
        componentIds: [savedComponent.id],
      });

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
    <>
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
              key={activeTab}
              height="100%"
              defaultLanguage={activeTab === "html" ? "html" : activeTab}
              value={
                activeTab === "html" ? html : activeTab === "css" ? css : js
              }
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
              onMount={handleEditorDidMount}
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
      <div
        className="price-category-container"
        style={{ display: isEdit ? "flex" : "none" }}
      >
        <input
          type="number"
          className="price-input"
          placeholder="Enter price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0"
          step="0.01"
        />
        <select
          className="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default AddUi;
