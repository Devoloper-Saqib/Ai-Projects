window.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById("preview");
  const promptText = document.getElementById("promptText");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const loading = document.getElementById("loading");
  const sourceCodeBox = document.getElementById("sourceCode");
  const codeBlock = document.getElementById("codeBlock");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  // ✅ Get prompt and generated HTML from storage
  const params = new URLSearchParams(window.location.search);
  const prompt = params.get("prompt") || "No prompt provided.";
  const generatedHTML = localStorage.getItem("generatedHTML") || "⚠️ No HTML found in localStorage.";

  promptText.textContent = "Prompt: " + prompt;
  latestHTMLCode = generatedHTML;

  // ✅ Show code
  sourceCodeBox.textContent = generatedHTML;
  codeBlock.textContent = generatedHTML;
  hljs.highlightElement(sourceCodeBox);
  hljs.highlightElement(codeBlock);

  if (generatedHTML.includes("<html") && generatedHTML.includes("</html>")) {
    const blob = new Blob([generatedHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframe.src = url;
    iframe.style.display = "block";
    fullscreenBtn.classList.remove("hidden");
    loading.style.display = "none";
  } else {
    loading.textContent = "⚠️ AI did not return full HTML content.";
  }

  fullscreenBtn.addEventListener("click", () => {
    iframe.requestFullscreen?.() ||
    iframe.webkitRequestFullscreen?.() ||
    iframe.msRequestFullscreen?.() ||
    alert("Fullscreen not supported");
  });

  copyBtn.addEventListener("click", () => {
    if (!latestHTMLCode) return alert("Nothing to copy.");
    navigator.clipboard.writeText(latestHTMLCode)
      .then(() => alert("✅ Code copied!"))
      .catch(err => alert("❌ Copy failed: " + err.message));
  });

  downloadBtn.addEventListener("click", () => {
    if (!latestHTMLCode) return alert("Nothing to download.");
    const blob = new Blob([latestHTMLCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated.html";
    a.click();
    URL.revokeObjectURL(url);
  });
});
