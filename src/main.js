const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/recommend";

async function getCareerPrediction(data) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const result = await response.json();
        return result.predictions;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

export { getCareerPrediction };
