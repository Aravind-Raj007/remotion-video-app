import {  getImagePrompt } from './promptTemplates';
import OpenAI from "openai";

export const generateScript = async (topic) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },  
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{
          role: "system",
          content: "You are a video script writer."
        }, {
          role: "user",
          content: `Create a short video script about ${topic}. and each content text should be five seconds for speech model to speak . Return ONLY a JSON object with this exact format:
          {
            "scenes": [
              {
                "imagePrompt": "detailed visual description for the scene",
                "contentText": "narration text for the scene"
              }
            ]
          }`
        }]
      })
    });

    const data = await response.json();
    console.log('GPT Response:', data); // Debug log

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid API response');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Script Generation Error:', error);
    throw error;
  }
};

export const generateImage = async (imagePrompt) => {
  try {
    const response = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'black-forest-labs/FLUX.1-schnell',
        steps: 2,
        n: 1,
        size: "1024x1024",
        prompt: imagePrompt,
        quality: "hd",
        style: "natural"
      })
    });

    const data = await response.json();
    console.log('Image Generation Response:', data);

    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error('Invalid response from image generation API: ' + JSON.stringify(data));
    }

    const imageUrl = data.data[0].url;
    if (!imageUrl) {
      throw new Error('No image URL in response');
    }

    console.log('Generated Image URL:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

export const generateAudio = async (contentText) => {
  try {
    // Generate speech
    const speechResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: 'alloy',
        input: contentText,
        speed: 1.0,
        response_format: 'mp3',
      })
    });

    const audioBlob = await speechResponse.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Get word-level transcription
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.mp3');
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json');
    formData.append('word_timestamps', 'true');

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
      },
      body: formData
    });

    const transcriptionData = await transcriptionResponse.json();
    
    // Log the raw transcription data
    console.log('Raw Transcription Data:', JSON.stringify(transcriptionData, null, 2));
    
    // Log each segment's timing
    console.log('\nSegment Timings:');
    transcriptionData.segments.forEach((segment, index) => {
      console.log(`Segment ${index}:`, {
        text: segment.text,
        start: segment.start,
        end: segment.end
      });
    });

    // Extract and log word timings
    const words = [];
    let wordIndex = 0;

    transcriptionData.segments.forEach((segment, segmentIndex) => {
      const segmentWords = segment.text.trim().split(/\s+/);
      const timePerWord = (segment.end - segment.start) / segmentWords.length;

      segmentWords.forEach((word, index) => {
        const start = segment.start + (index * timePerWord);
        const end = start + timePerWord;
        
        const wordData = {
          id: wordIndex++,
          text: word,
          start: parseFloat(start.toFixed(3)),
          end: parseFloat(end.toFixed(3))
        };
        
        console.log(`Word: "${word}"`, wordData);
        words.push(wordData);
      });
    });

    console.log('\nFinal processed words array:', words);

    return {
      audioUrl,
      words,
      duration: transcriptionData.duration
    };

  } catch (error) {
    console.error('Error in audio generation:', error);
    throw error;
  }
};

