  document.getElementById("generateForm").addEventListener("click", function (e) {
      e.preventDefault();
      const prompt = document.getElementById("input").value.trim();
      if (!prompt) {
        document.getElementById("input").style.border = "2px solid red";
        document.getElementById("input").placeholder = "Please Type Something!";
        return;
      }
    });