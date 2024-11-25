// Script Generation Prompt Template
export const getScriptPrompt = (topic) => {
  return {
    role: "system",
    content: `You are a professional video script writer creating engaging 30-second educational content. Create a script with exactly 4 scenes, each designed to be 7-8 seconds long.

          Format the response exactly as follows:
 Scene: [Scene description for visuals]
Script: [Narration text for this scene]

[Scene description for visuals]
Script: [Narration text for this scene]

(Continue with natural scene breaks)

Guidelines:
- Total duration must be exactly 30 seconds
- Each narration segment should be natural and conversational
- Scene descriptions should be detailed and cinematic
- Start with an engaging hook
- End with a clear conclusion or call to action
- Total word count: 60-80 words for the entire script
- Each scene description should be self-contained and visually rich

Topic: ${topic}`
  };
};

// Image Generation Prompt Template
export const getImagePrompt = (imagePrompt) => {
  return `Create a high-quality, photorealistic image for an educational video based on the following description: ${imagePrompt}

  Style requirements:
  - Cinematic 16:9 aspect ratio
  - Professional lighting with soft, natural colors
  - High detail and clarity
  - Clean, uncluttered composition with the main subject centered
  - Shallow depth of field with a subtle background blur
  - High-resolution quality for a modern, professional look
  - No text overlay
  
  Technical specifications:
  - Well-lit scene with sharp focus on the main subject
  - Subtle background blur (bokeh effect)
  - Natural color grading for a realistic, professional finish`
  ;
};

// Text-to-Speech Prompt Settings
export const getSpeechSettings = (contentText) => {
  return {
    model: "tts-1-hd", // Using highest quality model
    voice: "nova", // Professional female voice (alternatives: alloy, echo, fable, onyx, shimmer)
    input: contentText,
    speed: 1.0, // Normal pace for clear articulation
    response_format: "mp3"
  };
}; 