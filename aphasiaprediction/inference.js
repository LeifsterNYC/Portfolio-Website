async function fetchInference(input, retries = 5, interval = 4000) {
  const response = await fetch("/.netlify/functions/hfInference", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input })
  })
  const result = await response.json()
  if (result.error && /loading/i.test(result.error) && retries > 0) {
    await new Promise(resolve => setTimeout(resolve, interval))
    return fetchInference(input, retries - 1, interval)
  }
  return result
}

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
    const result = await fetchInference(input)
    if (Array.isArray(result) && result[0]?.generated_text) {
      resultDiv.textContent = result[0].generated_text
    } else if (result.error) {
      resultDiv.textContent = result.error
    } else {
      resultDiv.textContent = "No valid prediction found."
    }
  } catch (error) {
    resultDiv.textContent = "Error fetching prediction."
  }
})
