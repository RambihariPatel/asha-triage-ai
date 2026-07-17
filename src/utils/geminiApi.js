import { runLocalTriage } from './triageEngine';

/**
 * Perform AI Patient Triage using Gemini API.
 * Falls back to Local Triage Engine if no API key is provided, or in case of network errors.
 */
export const runAITriage = async (vitals, symptoms, apiKey = null) => {
  if (!apiKey) {
    console.log("No Gemini API key provided. Falling back to local clinical engine.");
    await new Promise(resolve => setTimeout(resolve, 800));
    return runLocalTriage(vitals, symptoms);
  }

  const prompt = `You are a clinical decision support AI assistant helping an ASHA worker (rural health worker) triage a patient in a village clinic.
Based on the patient's vitals and symptoms below, perform a clinical triage classification.

Patient Demographics & Vitals:
- Age: ${vitals.age} years old
- Gender: ${vitals.gender}
- Temperature: ${vitals.temperature}°F
- Heart Rate: ${vitals.heartRate} bpm
- Blood Pressure: ${vitals.systolic}/${vitals.diastolic} mmHg

Symptom Description:
"${symptoms}"

You must respond with a JSON object containing EXACTLY the following structure:
{
  "triageColor": "RED" | "ORANGE" | "YELLOW" | "GREEN",
  "conditionPossibilities": {
    "en": "Clinical analysis in English.",
    "hi": "clinical analysis in Hindi.",
    "te": "clinical analysis in Telugu."
  },
  "firstAidInstructions": {
    "en": ["English step 1", "English step 2"],
    "hi": ["Hindi step 1", "Hindi step 2"],
    "te": ["Telugu step 1", "Telugu step 2"]
  },
  "redFlags": {
    "en": ["English red flag 1", "English red flag 2"],
    "hi": ["Hindi red flag 1", "Hindi red flag 2"],
    "te": ["Telugu red flag 1", "Telugu red flag 2"]
  },
  "translatedSummary": {
    "en": "English summary of the triage status and priority.",
    "hi": "Hindi translation of the English summary.",
    "te": "Telugu translation of the English summary."
  }
}

Guidelines:
- RED: Immediate Emergency (e.g. chest pain, severe dyspnea, shock, poisoning, unconsciousness).
- ORANGE: Very Urgent (e.g. high fever >102F, severe pain, severe dehydration, fracture).
- YELLOW: Urgent but stable (e.g. persistent moderate fever, abdominal discomfort, vomiting, minor sprains).
- GREEN: Standard / Non-Urgent (e.g. common cold, minor scratches, mild headache).

Ensure that all translated versions (hi for Hindi, te for Telugu) are culturally sensitive, using easy-to-understand terms for rural health workers in regional Indian languages. Do not include markdown code block characters like \`\`\`json, just the raw JSON.
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API HTTP Error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error("Empty response from Gemini API");
    }

    const triageResult = JSON.parse(candidateText.trim());
    return triageResult;

  } catch (error) {
    console.error("Gemini AI Triage failed. Using local fallback engine:", error);
    const fallbackResult = runLocalTriage(vitals, symptoms);
    fallbackResult.isFallback = true;
    fallbackResult.fallbackReason = error.message;
    return fallbackResult;
  }
};
