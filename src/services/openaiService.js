import {  getImagePrompt } from './promptTemplates';

export const generateScript = async (topic) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.OPENAI_API_KEY
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
        'Authorization': process.env.TOGETHER_API_KEY,
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

// export const generateSpeech = async (contentText) => {
//   try {
//     const response = await fetch('https://api.openai.com/v1/audio/speech', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': process.env.AUDIO_API_KEY
//       },
//       body: JSON.stringify({
//         model: 'tts-1',
//         voice: 'alloy',
//         input: contentText,
//         speed: 1.15, // Consistent speed
//         response_format: 'mp3'
//       })
//     });

//     if (!response.ok) {
//       throw new Error('Failed to generate speech');
//     }

//     const audioBlob = await response.blob();
//     return URL.createObjectURL(audioBlob);
//   } catch (error) {
//     console.error('Speech generation error:', error);
//     throw error;
//   }
// };

// export const generateAudio = async (contentText) => {
//   try {
//     // First generate the audio
//     const audioResponse = await fetch('https://api.openai.com/v1/audio/speech', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': process.env.OPENAI_API_KEY,
//       }, 
//       body: JSON.stringify({
//         model: 'tts-1',
//         voice: 'alloy',
//         input: contentText,
//       }),
//     });

//     if (!audioResponse.ok) {
//       throw new Error(`Audio generation failed: ${audioResponse.statusText}`);
//     }

//     const audioBlob = await audioResponse.blob();
//     const audioUrl = URL.createObjectURL(audioBlob);

//     // Create form data for the STT request
//     const formData = new FormData();
//     formData.append('file', audioBlob, 'audio.mp3');
//     formData.append('model', 'whisper-1');
//     formData.append('response_format', 'json');
//     formData.append('timestamps', 'word');

//     // Get word-level timestamps using Whisper API
//     const sttResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
//       method: 'POST',
//       headers: {
    //         'Authorization':
    //       },
//       body: formData,
//     });

//     if (!sttResponse.ok) {
//       const errorText = await sttResponse.text();
//       console.error('STT API Error:', errorText);
//       throw new Error(`STT processing failed: ${sttResponse.statusText}`);
//     }

//     const transcription = await sttResponse.json();
//     console.log('Full Transcription Response:', transcription);

//     if (!transcription.words) {
//       throw new Error('Word-level timestamps not provided by the API');
//     }

//     const words = transcription.words.map(word => ({
//       word: word.word,
//       start: word.start,
//       end: word.end
//     }));

//     return {
//       audioUrl,
//       totalDuration: words[words.length - 1]?.end || 0,
//       words
//     };
//   } catch (error) {
//     console.error('Error generating audio with timestamps:', error);
//     throw error;
//   }
// }; //ok 


export const generateAudio = async (contentText) => {
  try {
    const speechResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.OPENAI_API_KEY,
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: 'alloy',
        input: contentText,
        speed: 1.0, // Ensure consistent speed
        response_format: 'mp3',
      }),
    });

    if (!speechResponse.ok) {
      throw new Error('Failed to generate speech');
    }

    const audioBlob = await speechResponse.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Fixed 5-second duration
    const FIXED_DURATION = 5;
    
    // Split text and create precise word timings
    const words = contentText.split(' ').map((word, index, array) => {
      const wordDuration = FIXED_DURATION / array.length;
      const start = index * wordDuration;
      const end = (index + 1) * wordDuration;
      
      return {
        word: word,
        start: start,
        end: end
      };
    });

    return {
      audioUrl,
      words,
      duration: FIXED_DURATION
    };

  } catch (error) {
    console.error('Error in audio generation:', error);
    throw error;
  }
};

// Example usage:
/*
const handleGenerateAudio = async (text) => {
  try {
    const result = await generateAudio(text);
    console.log('Audio URL:', result.audioUrl);
    console.log('Words with timestamps:', result.words);
    console.log('Total duration:', result.duration);
    
    // Example of using the timestamps
    result.words.forEach(word => {
      console.log(`${word.word}: ${word.start}s - ${word.end}s`);
    });
    
  } catch (error) {
    console.error('Failed to generate audio:', error);
  }
};
*/

// Make sure to export generateSpeech along with other functions
