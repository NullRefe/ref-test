# AI Symptom Checker

A multilingual, AI-powered symptom checker that provides preliminary health assessments using Google's Gemini AI.

## Features

- **Multilingual Support**: Accepts symptoms in any language and provides responses in the same language
- **Voice Input**: Speech recognition for hands-free symptom description
- **Common Symptoms Selection**: Quick selection from predefined symptoms with English/Hindi labels
- **AI Analysis**: Powered by Google Gemini AI for intelligent symptom analysis
- **3-Day Wellness Guide**: Generates personalized wellness recommendations
- **Specialist Recommendations**: Suggests types of medical specialists to consult
- **Responsive Design**: Works on desktop and mobile devices

## Setup

1. **Get a Gemini API Key**

   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key

2. **Configure Environment Variables**

   - Copy `.env.example` to `.env.local`
   - Add your Gemini API key:
     ```
     NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
     ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

## Usage

1. **Describe Symptoms**

   - Type symptoms in any language in the text area
   - OR use the microphone button for voice input
   - OR select from common symptoms checkboxes

2. **Get AI Analysis**

   - Click "Analyze Symptoms" to get AI-powered health insights
   - The system automatically detects language and provides responses in the same language

3. **Additional Features**
   - Generate a 3-day wellness guide with hydration, meal, activity, and rest tips
   - Find local specialist types that could help with your symptoms

## Important Disclaimer

This tool provides general information only and is NOT a substitute for professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.

## Technical Architecture

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **UI Components**: Radix UI primitives
- **AI Integration**: Google Gemini AI API
- **Speech Recognition**: Web Speech API
- **State Management**: React hooks with custom abstractions

## File Structure

```
components/
  symptom-checker.tsx     # Main component
hooks/
  useSymptomChecker.ts   # Custom hooks for speech recognition and API state
lib/
  types/
    symptom-checker.ts   # TypeScript interfaces
  utils/
    gemini-api.ts       # Gemini AI API utilities
```
