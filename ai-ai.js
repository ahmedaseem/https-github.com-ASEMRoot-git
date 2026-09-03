import CONFIG from "../config.js";

export async function askAI(message) {
    if (!message || !message.trim()) {
        throw new Error("AI message cannot be empty.");
    }

    const response = await fetch(`${CONFIG.api.real}/ai`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: message.trim()
        })
    });

    if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
    }

    return await response.json();
}

export async function testAI() {
    return askAI(
        "Find employment opportunities for a JavaScript developer."
    );
}
