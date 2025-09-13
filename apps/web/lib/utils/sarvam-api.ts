const SARVAM_API_KEY = process.env.NEXT_PUBLIC_SARVAM_API_KEY || ""
const SARVAM_BASE_URL = "https://api.sarvam.ai"

export interface SarvamSTTResponse {
  transcript: string
  language_code?: string
}

export interface SarvamTTSResponse {
  audios: string[] // Array of base64 encoded audio strings
}

// Convert audio to WAV format for better compatibility
async function convertToWav(audioBlob: Blob): Promise<Blob> {
  return new Promise((resolve) => {
    try {
      // Check if we have the necessary APIs
      if (!window.AudioContext && !(window as any).webkitAudioContext) {
        console.warn('AudioContext not available, using original blob')
        resolve(audioBlob)
        return
      }

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const fileReader = new FileReader()
      
      fileReader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer
          if (!arrayBuffer || arrayBuffer.byteLength === 0) {
            console.warn('Empty audio buffer, using original blob')
            resolve(audioBlob)
            return
          }

          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
          
          // Convert to WAV format
          const wavBlob = audioBufferToWav(audioBuffer)
          console.log('Successfully converted to WAV:', wavBlob.size, 'bytes')
          resolve(wavBlob)
        } catch (error) {
          console.warn('Audio decoding/conversion failed:', error)
          // If conversion fails, use the original blob
          resolve(audioBlob)
        } finally {
          // Clean up audio context
          if (audioContext.state !== 'closed') {
            audioContext.close().catch(() => {})
          }
        }
      }
      
      fileReader.onerror = () => {
        console.warn('FileReader error, using original blob')
        resolve(audioBlob)
      }
      
      fileReader.readAsArrayBuffer(audioBlob)
    } catch (error) {
      console.warn('Audio conversion setup failed:', error)
      resolve(audioBlob)
    }
  })
}

// Speech to Text
export async function speechToText(audioBlob: Blob): Promise<SarvamSTTResponse> {
  if (!SARVAM_API_KEY) {
    throw new Error("Sarvam API key not configured")
  }

  // Validate audio blob
  if (!audioBlob || audioBlob.size === 0) {
    throw new Error("Invalid or empty audio data")
  }

  // Log for debugging
  console.log('Original audio blob:', {
    type: audioBlob.type,
    size: audioBlob.size,
    sizeMB: (audioBlob.size / 1024 / 1024).toFixed(2)
  })

  // Try multiple format approaches
  const formats = [
    { blob: audioBlob, name: 'original' },
    { blob: await convertToWav(audioBlob), name: 'wav-converted' }
  ]

  for (const format of formats) {
    try {
      // Determine appropriate file extension and MIME type
      let filename = 'audio.wav'
      let mimeType = 'audio/wav'
      
      if (format.name === 'original') {
        if (format.blob.type.includes('webm')) {
          filename = 'audio.webm'
          mimeType = 'audio/webm'
        } else if (format.blob.type.includes('mp4')) {
          filename = 'audio.mp4'
          mimeType = 'audio/mp4'
        } else if (format.blob.type.includes('ogg')) {
          filename = 'audio.ogg'
          mimeType = 'audio/ogg'
        }
      }

      // Create a new blob with clean MIME type (without codec specifications)
      const cleanBlob = new Blob([format.blob], { type: mimeType })

      const formData = new FormData()
      formData.append('file', cleanBlob, filename)
      formData.append('model', 'saarika:v2.5')

      console.log(`Trying ${format.name} format:`, { 
        originalType: format.blob.type, 
        cleanType: cleanBlob.type,
        filename,
        size: cleanBlob.size 
      })

      const response = await fetch(`${SARVAM_BASE_URL}/speech-to-text`, {
        method: 'POST',
        headers: {
          'api-subscription-key': SARVAM_API_KEY,
        },
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        console.log(`Success with ${format.name} format`)
        return result
      } else {
        const errorText = await response.text()
        console.warn(`${format.name} format failed:`, errorText)
        
        // If this is the last format, throw the error
        if (format === formats[formats.length - 1]) {
          throw new Error(`Sarvam STT API error: ${response.status} - ${errorText}`)
        }
      }
    } catch (error) {
      console.error(`Error with ${format.name} format:`, error)
      if (format === formats[formats.length - 1]) {
        throw error
      }
    }
  }

  
  // If we reach here, all formats failed
  throw new Error('All audio format attempts failed')
}

// Language code mapping for Sarvam TTS API
const LANGUAGE_CODE_MAPPING: Record<string, string> = {
  'en': 'en-IN',
  'hi': 'hi-IN', 
  'pa': 'pa-IN',
  'bn': 'bn-IN',
  'gu': 'gu-IN',
  'kn': 'kn-IN',
  'ml': 'ml-IN',
  'mr': 'mr-IN',
  'od': 'od-IN',
  'ta': 'ta-IN',
  'te': 'te-IN'
}

// Text to Speech
export async function textToSpeech(
  text: string, 
  language: string = 'hi', // Hindi by default, can be 'en' for English
  speaker: string = 'meera' // Default speaker
): Promise<string> {
  if (!SARVAM_API_KEY) {
    throw new Error("Sarvam API key not configured")
  }

  // Validate and limit text length to 500 characters as per API requirement
  if (text.length > 500) {
    const originalLength = text.length
    // Try to truncate at word boundary to avoid cutting words
    let truncatedText = text.substring(0, 500)
    const lastSpaceIndex = truncatedText.lastIndexOf(' ')
    if (lastSpaceIndex > 400) { // Only use word boundary if it's not too early
      truncatedText = truncatedText.substring(0, lastSpaceIndex)
    }
    text = truncatedText
    console.warn(`Text truncated from ${originalLength} to ${text.length} characters for Sarvam TTS API`)
  }

  // Map language code to Sarvam API format
  const targetLanguageCode = LANGUAGE_CODE_MAPPING[language] || 'hi-IN'

  const response = await fetch(`${SARVAM_BASE_URL}/text-to-speech`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-subscription-key': SARVAM_API_KEY,
    },
    body: JSON.stringify({
      inputs: [text],
      target_language_code: targetLanguageCode,
      speaker: speaker,
      pitch: 0,
      pace: 1.0,
      loudness: 1.0,
      speech_sample_rate: 8000,
      enable_preprocessing: true,
      model: "bulbul:v1"
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Sarvam TTS API Error Details:', {
      status: response.status,
      targetLanguageCode,
      textLength: text.length,
      speaker,
      error: errorText
    })
    throw new Error(`Sarvam TTS API error: ${response.status} - ${errorText}`)
  }

  let result: SarvamTTSResponse
  try {
    const responseText = await response.text()
    console.log('Raw Sarvam TTS API Response:', responseText.substring(0, 500))
    result = JSON.parse(responseText)
    console.log('Parsed Sarvam TTS API Response:', JSON.stringify(result, null, 2))
  } catch (jsonError) {
    console.error('Failed to parse JSON response:', {
      status: response.status,
      error: jsonError instanceof Error ? jsonError.message : String(jsonError)
    })
    throw new Error(`Invalid JSON response from Sarvam TTS API`)
  }
  
  if (!result.audios || result.audios.length === 0) {
    throw new Error("No audio generated from Sarvam TTS")
  }
  
  const audioData = result.audios[0]
  
  if (!audioData || typeof audioData !== 'string') {
    console.error('Invalid audio data in response:', {
      audiosLength: result.audios.length,
      firstAudio: result.audios[0],
      audioDataType: typeof audioData
    })
    throw new Error("Invalid or missing audio data in Sarvam TTS response")
  }
  
  console.log('Sarvam TTS API Response:', {
    audioLength: audioData.length,
    hasAudio: !!audioData,
    audioPreview: audioData.substring(0, 20) + '...'
  })
  
  return audioData // Returns base64 encoded audio
}

// Helper function to convert audio blob to proper format for Sarvam API
export function convertAudioForSarvam(audioBlob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const fileReader = new FileReader()
    
    fileReader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        
        // Convert to WAV format
        const wavBlob = audioBufferToWav(audioBuffer)
        resolve(wavBlob)
      } catch (error) {
        reject(error)
      }
    }
    
    fileReader.onerror = () => reject(new Error('Failed to read audio file'))
    fileReader.readAsArrayBuffer(audioBlob)
  })
}

// Convert AudioBuffer to WAV Blob
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const length = buffer.length
  const numberOfChannels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2)
  const view = new DataView(arrayBuffer)
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }
  
  writeString(0, 'RIFF')
  view.setUint32(4, 36 + length * numberOfChannels * 2, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, numberOfChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * numberOfChannels * 2, true)
  view.setUint16(32, numberOfChannels * 2, true)
  view.setUint16(34, 16, true)
  writeString(36, 'data')
  view.setUint32(40, length * numberOfChannels * 2, true)
  
  // Convert float samples to 16-bit PCM
  let offset = 44
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
      offset += 2
    }
  }
  
  return new Blob([arrayBuffer], { type: 'audio/wav' })
}