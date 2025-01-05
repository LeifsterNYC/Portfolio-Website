exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Method Not Allowed"
      }
    }
    const body = JSON.parse(event.body)
    const cleanedInput = body.input
      .toLowerCase()
      .replace(/[^\w\s]|_/g, "")
      .replace(/\s+/g, " ")
      .trim()
    if (!cleanedInput) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Empty input" })
      }
    }
    try {
      const response = await fetch("https://api-inference.huggingface.co/models/LeifsterNYC/aphasia-t5-normalization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HF_API_TOKEN}`
        },
        body: JSON.stringify({ inputs: cleanedInput })
      })
      const result = await response.json()
      return {
        statusCode: 200,
        body: JSON.stringify(result)
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server Error" })
      }
    }
  }
  