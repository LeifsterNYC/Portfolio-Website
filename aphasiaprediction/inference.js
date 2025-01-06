document.getElementById("prediction-form").addEventListener("submit", async function(e) {
    e.preventDefault()
    const input = document.getElementById("aphasia-input").value
    const resultDiv = document.getElementById("prediction-result")
    if (!input.trim()) {
      resultDiv.textContent = "Please enter a phrase."
      return
    }
    resultDiv.textContent = "Predicting..."
    try {
      const response = await fetch("/.netlify/functions/hfInference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input })
      })
      const result = await response.json()
      console.log(result);
      if (Array.isArray(result) && result[0]?.generated_text) {
        resultDiv.textContent = result[0].generated_text
      } else {
        resultDiv.textContent = "No valid prediction found."
      }
    } catch (error) {
      resultDiv.textContent = "Error fetching prediction."
    }
  })
  