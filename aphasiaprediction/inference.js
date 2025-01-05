document.getElementById("prediction-form").addEventListener("submit", async function(e) {
    e.preventDefault();
    const input = document.getElementById("aphasia-input").value.trim();
    const resultDiv = document.getElementById("prediction-result");

    const cleanedInput = input
        .toLowerCase()
        .replace(/[^\w\s]|_/g, "")
        .replace(/\s+/g, " ")
        .trim();

    if (!cleanedInput) {
        resultDiv.textContent = "Please enter a phrase.";
        return;
    }

    resultDiv.textContent = "Predicting...";

    try {
        const response = await fetch("https://api-inference.huggingface.co/models/LeifsterNYC/aphasia-t5-normalization", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer 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"
            },
            body: JSON.stringify({
                inputs: cleanedInput
            })
        });

        const result = await response.json();

        if (response.ok && Array.isArray(result) && result[0]?.generated_text) {
            resultDiv.textContent = result[0].generated_text;
        } else {
            resultDiv.textContent = "No valid prediction found.";
        }

    } catch (error) {
        resultDiv.textContent = "Error fetching prediction.";
    }
});
