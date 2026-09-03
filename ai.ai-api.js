export async function sendAIRequest(message, context = {}) {
    const response = await fetch("/api/ai", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            message,
            context
        })
    });

    if (!response.ok) {
        throw new Error(`AI request failed: ${response.status}`);
    }

    return await response.json();
}
