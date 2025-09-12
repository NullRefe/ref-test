import {
    CommonSymptom,
    GeminiResponse,
    SymptomAnalysis,
    TranslationResponse
} from '@/lib/types/symptom-checker'

export const COMMON_SYMPTOMS: CommonSymptom[] = [
  { english: "Fever", hindi: "बुखार" },
  { english: "Cough", hindi: "खांसी" },
  { english: "Headache", hindi: "सिरदर्द" },
  { english: "Fatigue", hindi: "थकान" },
  { english: "Sore Throat", hindi: "गले में खराश" },
  { english: "Shortness of Breath", hindi: "सांस लेने में कठिनाई" },
  { english: "Nausea", hindi: "जी मिचलाना" },
  { english: "Diarrhea", hindi: "दस्त" }
]

export const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""

export async function callGeminiApi(
  prompt: string, 
  systemInstruction?: string
): Promise<string> {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`
  
  const payload: any = {
    contents: [{ parts: [{ text: prompt }] }]
  }
  
  if (systemInstruction) {
    payload.systemInstruction = { parts: [{ text: systemInstruction }] }
  }

  let retries = 3
  let delay = 1000
  
  while (retries > 0) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorBody = await response.text()
        console.error("API Error Response:", errorBody)
        throw new Error(`API call failed with status: ${response.status}`)
      }

      const result: GeminiResponse = await response.json()
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text
      
      if (text) {
        return text
      } else {
        console.error("Invalid response structure from API:", JSON.stringify(result, null, 2))
        throw new Error("Invalid response structure from API.")
      }
    } catch (error) {
      console.warn(`API call failed. Retrying in ${delay}ms...`, error)
      retries--
      if (retries === 0) {
        throw new Error("Failed to get a response from the AI after multiple attempts.")
      }
      await new Promise(res => setTimeout(res, delay))
      delay *= 2
    }
  }
  
  throw new Error("Unexpected error in API call")
}

export async function translateAndAnalyzeSymptoms(
  combinedSymptoms: string
): Promise<SymptomAnalysis> {
  // Step 1: Translate to English and detect language
  const translationPrompt = `Identify the language of the following text and then translate it to English. Respond ONLY with a valid JSON object like this: {"language": "language_name", "translation": "english_text"}. Text: "${combinedSymptoms}"`
  
  const translationResponse = await callGeminiApi(translationPrompt)
  const jsonStringMatch = translationResponse.match(/\{[\s\S]*\}/)
  
  if (!jsonStringMatch) {
    throw new Error("Could not find a valid JSON object in the translation response.")
  }
  
  const { language, translation }: TranslationResponse = JSON.parse(jsonStringMatch[0])

  // Step 2: Analyze symptoms
  const systemInstruction = "You are a helpful AI Symptom Checker assistant. Your purpose is to provide general health information. You are NOT a doctor and MUST NOT provide a diagnosis. Always begin your response with a clear, bold disclaimer: '**Disclaimer: This is not medical advice. Please consult a healthcare professional for an accurate diagnosis.**'. After the disclaimer, provide potential related conditions, suggest general wellness tips, and list 2-3 clarifying questions the user could consider discussing with a doctor."
  
  const analysisResponse = await callGeminiApi(translation, systemInstruction)

  // Step 3: Translate back to original language
  const backTranslationPrompt = `Translate the following health information into ${language}. Keep the markdown formatting (like bolding with **). Text: "${analysisResponse}"`
  
  const finalResponse = await callGeminiApi(backTranslationPrompt)

  return {
    originalText: combinedSymptoms,
    translatedText: translation,
    detectedLanguage: language,
    analysis: analysisResponse,
    translatedAnalysis: finalResponse
  }
}

export async function generateWellnessGuide(
  englishSymptoms: string, 
  language: string
): Promise<string> {
  const wellnessPrompt = `Based on these symptoms: "${englishSymptoms}", create a simple 3-day wellness guide. This is for general wellness and is NOT medical advice. For each day, suggest: 1. A hydration tip. 2. A simple meal idea. 3. A gentle activity. 4. A rest and recovery tip. Start with a strong disclaimer that this is not a substitute for professional medical advice.`
  
  const wellnessResponse = await callGeminiApi(wellnessPrompt)

  const translationPrompt = `Translate the following wellness guide into ${language}. Keep all markdown formatting. Text: "${wellnessResponse}"`
  
  return await callGeminiApi(translationPrompt)
}

export async function findSpecialistTypes(
  englishSymptoms: string, 
  language: string
): Promise<string> {
  const specialistPrompt = `A person in Durgapur, West Bengal, India has health concerns based on these symptoms: "${englishSymptoms}". List 2-3 types of medical specialists they could consider consulting. For each specialist type, briefly explain what they do. IMPORTANT: Do NOT recommend specific doctors, hospitals, or clinics. This is for informational purposes only.`
  
  const specialistResponse = await callGeminiApi(specialistPrompt)
  
  const translationPrompt = `Translate the following list of medical specialist types into ${language}. Keep all formatting. Text: "${specialistResponse}"`
  
  return await callGeminiApi(translationPrompt)
}