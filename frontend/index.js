const form = document.querySelector("form");
const input = document.querySelector("#input");
const promptInput = document.getElementById("prompt-input");

// Live Choreo backend endpoint
const BACKEND_URL = "https://1a16df46-e76c-468c-91ef-462437a87944.e1-us-east-azure.choreoapps.dev/api/generate";

// Form submit handler
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (input.value.trim() === "") {
    input.classList.add("shake", "error-outline");
    input.placeholder = 'Please type something';
    
    setTimeout(() => {
      input.classList.remove("shake");
    }, 400);
  } else {
    parse();
  }
});

// Enhance button click
document.getElementById('enhance').addEventListener('click', () => {
  const input = document.getElementById('input');
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

// Function to send request to backend
async function parse() {
  const prompt = promptInput.value;

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error("Backend error");
    }

    const data = await response.json();
    console.log("Generated HTML:", data);

    // You can now insert data.html into an iframe or redirect
    // Example:
    localStorage.setItem("generatedHTML", data.html);
    window.location.href = "result.html";

  } catch (error) {
    console.error("Fetch failed:", error);
  }
}
