const form = document.querySelector("form");
const input = document.querySelector("#input");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const prompt = input.value.trim();
  if (!prompt) {
    input.classList.add("shake", "error-outline");
    input.placeholder = "Please type something!";
    setTimeout(() => input.classList.remove("shake"), 400);
    return;
  }

  try {
    const response = await fetch("https://ai-projects-neon.vercel.app/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (data && data.html) {
      const newTab = window.open();
      newTab.document.open();
      newTab.document.write(data.html);
      newTab.document.close();
    } else {
      alert("Error: No HTML received from server.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong. Check console for details.");
  }
});

document.getElementById('enhance').addEventListener('click', () => {
  let prompt = input.value.trim().toLowerCase();
  if (!prompt) return;

  const toRemove = [
    /^make me (a|an)?\s*/g,
    /^build (me)?( a| an)?\s*/g,
    /^create (me)?( a| an)?\s*/g,
    /^please (make|build|create)\s*/g,
    /^can you (make|build|create)\s*/g,
    /^i want (a|an)?\s*/g,
    /^i need (a|an)?\s*/g
  ];
  toRemove.forEach(pattern => {
    prompt = prompt.replace(pattern, '');
  });

  let enhanced = '';
  if (prompt.includes("blog")) {
    enhanced = "A modern blog website with categories, search bar, and newsletter subscription.";
  } else if (prompt.includes("restaurant")) {
    enhanced = "A responsive restaurant site with online menu, table booking, and gallery.";
  } else if (prompt.includes("portfolio")) {
    enhanced = "A sleek portfolio website with projects, animated sections, and a contact form.";
  } else {
    enhanced = "A fully responsive website for: " + prompt;
  }

  input.value = enhanced;
});
