import {  getImagePrompt } from './promptTemplates';

export const generateScript = async (topic) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.SCRIPT_API_KEY,
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
        'Authorization': process.env.IMAGE_API_KEY,
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

export const generateAudio = async (contentText) => {
  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.AUDIO_API_KEY,
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: 'alloy',
        input: contentText,
      }),
    });

    if (!response.ok) {
      throw new Error(`Audio generation failed: ${response.statusText}`);
    }
    const getCaptions = await {

    }
    const audioBlob = await response.blob();

    return {"url" : URL.createObjectURL(audioBlob), "timedCaptions": getCaptions};
  } catch (error) {
    console.error('Error generating audio:', error);
    throw error;
  }
};



// Make sure to export generateSpeech along with other functions
