import { useState } from 'react';
import { generateScript, generateImage, generateAudio } from '../services/openaiService';
import { useNavigate } from 'react-router-dom';

const VideoRequestForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [scenes, setScenes] = useState([]);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [generatedAudio, setGeneratedAudio] = useState([]);
  // const [videoProgress, setVideoProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Generate script
      const scriptResponse = await generateScript(title);
      const scriptData = JSON.parse(scriptResponse);
      // setScenes(scriptData.scenes);

      // Generate all assets in parallel
      const [images, audioUrls] = await Promise.all([
        Promise.all(scriptData.scenes.map(scene => generateImage(scene.imagePrompt))),
        Promise.all(scriptData.scenes.map(scene => generateAudio(scene.contentText)))
      ]);

      setGeneratedImages(images);
      setGeneratedAudio(audioUrls);

      // Navigate to video page with the generated content
      navigate('/video', {
        state: {
          scenes: scriptData.scenes,
          images,
          audioUrls
        }
      });

    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate video content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label 
            htmlFor="title" 
            className="block text-lg font-medium mb-2"
          >
            Enter Video Topic
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., The History of Ancient Rome"
            className="w-full p-3 border rounded-lg"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          className={`w-full p-3 rounded-lg text-white font-medium
            ${isLoading || !title.trim() 
              ? 'bg-gray-400' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isLoading ? 'Generating...' : 'Generate Video Content'}
        </button>
      </form>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {/* {scenes.length > 0 && ( 
        <div className="space-y-8">
          {scenes.map((scene, index) => (
            <div key={index} className="border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Scene {index + 1}</h3>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Narration:</h4>
                {/* <p className="text-gray-700">{scene.contentText}</p> 
              </div>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Image Description:</h4>
                {/* <p className="text-gray-700">{scene.imagePrompt}</p> 
              </div>
              {generatedImages[index] && (
                <div>
                  <h4 className="font-medium mb-2">Generated Image:</h4>
                  <img 
                    // src={generatedImages[index]} 
                    // alt={`Scene ${index + 1}`}
                    className="w-full rounded-lg"
                  />
                </div>
              )}
              {generatedAudio[index] && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Generated Audio:</h4>
                  <audio 
                    controls 
                    src={generatedAudio[index]}
                    className="w-full"
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          ))}
        </div>
       )} */}

      {/* {isLoading && videoProgress > 0 && ( */}
        {/* <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${videoProgress}%` }}
            ></div>
          </div>
          <p className="text-center mt-2">Creating video: {videoProgress}%</p>
        </div> */}
      {/* )} */}
    </div>
  );
};

export default VideoRequestForm; 