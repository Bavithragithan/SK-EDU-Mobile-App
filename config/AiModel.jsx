const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

export const GenerateTopicsAIModel = async (userInput) => {
    try {
        const chatSession = model.startChat({ generationConfig });

        const aiResp = await chatSession.sendMessage(userInput);

        if (!aiResp || !aiResp.response) {
            console.error('Invalid AI Response:', aiResp);
            return [];
        }

        const responseText = aiResp.response.text();

        console.log('Raw AI Response:', responseText); 

        try {
            const topicIdeas = JSON.parse(responseText);
            return topicIdeas;
        } catch (jsonError) {
            console.error('Error parsing AI response:', jsonError);
            return [];
        }
    } catch (error) {
        console.error("AI Model Error:", error);
        return [];
    }
};

export const GenerateCourseAIModel = model.startChat({
    generationConfig,
    history: [
        
    ],
});
    


// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());

