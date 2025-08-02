document.getElementById("generateForm").addEventListener("click", async (e) => {
  e.preventDefault();
  const input = document.getElementById("input").value.trim();
  if (!input) return alert("❗ Please enter a prompt.");

  // Optional: Enhance step if needed before generating (currently skipped)
  const encodedPrompt = encodeURIComponent(input);
  window.location.href = `result.html?prompt=${encodedPrompt}`;
});

document.getElementById("enhance").addEventListener("click", async () => {
  const input = document.getElementById("input").value.trim();
  if (!input) return alert("❗ Please enter a prompt to enhance.");

  try {
    const res = await fetch("https://ai-projects-mujulgdrd-devoloper-saqibs-projects.vercel.app/enhance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input })
    });

    const data = await res.json();
    const enhanced = data?.enhancedPrompt || input + " (Enhanced)";
    document.getElementById("input").value = enhanced;
  } catch (err) {
    alert("❌ Failed to enhance prompt.");
    console.error(err);
  }
});
