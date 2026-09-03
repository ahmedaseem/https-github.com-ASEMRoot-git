import { sendAIRequest } from "./ai-api.js";

export async function askAI(message, context = {}) {
    if (!message || !message.trim()) {
        throw new Error("AI message cannot be empty.");
    }

    return await sendAIRequest(message, context);
}
