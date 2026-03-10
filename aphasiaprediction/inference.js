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
      const response = await fetch("/api/hfInference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input })
      })
      const result = await response.json()
      if (result.generated_text) {
        resultDiv.textContent = result.generated_text
      } else {
        resultDiv.textContent = "No valid prediction found."
      }
    } catch (error) {
      resultDiv.textContent = "Error fetching prediction."
    }
  })
  