let latestHTMLCode = "";

window.addEventListener("DOMContentLoaded", async () => {
  const iframe = document.getElementById("preview");
  const promptText = document.getElementById("promptText");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const loading = document.getElementById("loading");
  const sourceCodeBox = document.getElementById("sourceCode");
  const codeBlock = document.getElementById("codeBlock");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  const params = new URLSearchParams(window.location.search);
  const prompt = params.get("prompt") || "Make a Hello World in HTML";
  promptText.textContent = "Prompt: " + prompt;

  try {
    const res = await fetch("https://ai-projects-production.up.railway.app/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt }),
});


    const data = await res.json();
    const content = data?.content || "";
    latestHTMLCode = content;

    sourceCodeBox.textContent = content;
    codeBlock.textContent = content;
    hljs.highlightElement(sourceCodeBox);
    hljs.highlightElement(codeBlock);

    if (content.includes("<html") && content.includes("</html>")) {
      const blob = new Blob([content], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      iframe.src = url;
      iframe.style.display = "block";
      fullscreenBtn.classList.remove("hidden");
      loading.style.display = "none";
    } else {
      loading.textContent = "⚠️ AI did not return full HTML content.";
    }
  } catch (err) {
    loading.textContent = "❌ Error fetching AI response.";
    console.error("Fetch error:", err);
  }

  fullscreenBtn.addEventListener("click", () => {
    iframe.requestFullscreen?.() || iframe.webkitRequestFullscreen?.() || iframe.msRequestFullscreen?.() || alert("Fullscreen not supported");
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
