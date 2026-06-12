const form = document.getElementById("prediction-form")
const input = document.getElementById("aphasia-input")
const button = document.getElementById("restore-btn")
const buttonText = button.querySelector(".btn-text")
const sheet = document.getElementById("sheet")
const originalEl = document.getElementById("original")
const resultEl = document.getElementById("prediction-result")

let busy = false

async function restore(phrase) {
  if (busy) return
  busy = true
  button.disabled = true
  buttonText.textContent = "Restoring"
  buttonText.classList.add("dots")

  sheet.hidden = false
  originalEl.textContent = phrase
  resultEl.className = "result"
  resultEl.textContent = ""

  try {
    const response = await fetch("/api/hfInference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: phrase })
    })
    const result = await response.json()
    if (result.generated_text) {
      renderWords(result.generated_text)
    } else {
      showError("The model returned no prediction. Try rephrasing.")
    }
  } catch (error) {
    showError("The model could not be reached. Please try again in a moment.")
  } finally {
    busy = false
    button.disabled = false
    buttonText.classList.remove("dots")
    buttonText.textContent = "Restore"
  }
}

function renderWords(text) {
  resultEl.textContent = ""
  text.split(/\s+/).filter(Boolean).forEach((word, i) => {
    const span = document.createElement("span")
    span.className = "w"
    span.style.setProperty("--w", i)
    span.textContent = word
    resultEl.appendChild(span)
    resultEl.appendChild(document.createTextNode(" "))
  })
}

function showError(message) {
  resultEl.className = "result is-error"
  resultEl.textContent = message
}

form.addEventListener("submit", e => {
  e.preventDefault()
  const phrase = input.value.trim()
  if (!phrase) return
  restore(phrase)
})

document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    input.value = chip.textContent
    restore(chip.textContent)
  })
})
