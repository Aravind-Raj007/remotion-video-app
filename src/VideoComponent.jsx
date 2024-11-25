import { Composition } from 'remotion';
import { useEffect, useState } from 'react';
import { TransitionSequence, Transition } from 'remotion-transition';
import { generateScript, generateImage, generateSpeech } from './openaiService';

const VideoComponent = ({ topic }) => {
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createVideoData = async () => {
      try {
        // Step 1: Generate Script
        const scriptResponse = await generateScript(topic);
        const scriptData = JSON.parse(scriptResponse).scenes;

        // Step 2: Generate Images and Speech for Each Scene
        const generatedScenes = await Promise.all(
          scriptData.map(async (scene) => {
            const image = await generateImage(scene.imagePrompt);
            const speech = await generateSpeech(scene.contentText);
            return { ...scene, image, speech };
          })
        );

        setScenes(generatedScenes);
        setLoading(false);
      } catch (error) {
        console.error('Error creating video data:', error);
        setLoading(false);
      }
    };

    createVideoData();
  }, [topic]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Composition
      id="AI-Generated-Video"
      component={VideoComposition}
      durationInFrames={scenes.length * 150} // 5 seconds per scene at 30fps
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ scenes }}
    />
  );
};

const VideoComposition = ({ scenes }) => {
  return (
    <TransitionSequence>
      {scenes.map((scene, index) => (
        <Transition
          key={index}
          durationInFrames={30}
          name="fade"
          from={{
            opacity: 0,
          }}
          to={{
            opacity: 1,
          }}
        >
          <div
            style={{
              backgroundImage: `url(${scene.image})`,
              backgroundSize: 'cover',
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <audio src={scene.speech} autoPlay={true} />
          </div>
        </Transition>
      ))}
    </TransitionSequence>
  );
};

export default VideoComponent;
