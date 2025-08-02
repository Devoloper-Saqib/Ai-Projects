document.getElementById("generateForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const userInput = document.getElementById("prompt").value;
  const resultDiv = document.getElementById("result");

  resultDiv.innerHTML = "Generating... Please wait.";

  try {
    const response = await fetch("https://ai-projects-neon.vercel.app/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: userInput }),
    });

    const data = await response.json();

    if (!data.html) {
      resultDiv.innerHTML = "No content received.";
      return;
    }

    // display the response
    resultDiv.innerText = data.html;

    // Also render HTML preview
    const previewFrame = document.getElementById("previewFrame");
    const previewDocument = previewFrame.contentDocument || previewFrame.contentWindow.document;
    previewDocument.open();
    previewDocument.write(data.html);
    previewDocument.close();
  } catch (err) {
    resultDiv.innerHTML = `Error: ${err.message}`;
  }
});
