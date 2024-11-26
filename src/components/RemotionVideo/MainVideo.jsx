import { Sequence, AbsoluteFill, Audio, Img, useCurrentFrame, interpolate } from 'remotion';
import { createTikTokStyleCaptions } from '@remotion/captions';

export const FRAME_RATE = 30;
export const SCENE_DURATION = 5 * FRAME_RATE; // 4 seconds * 30fps = 120 frames

const TRANSITION_DURATION = 30; // Duration of transition in frames

export const MainVideo = ({ scenes, images, audioUrls }) => {
  // Debug log
  console.log('MainVideo props:', { scenes, images, audioUrls });

  return (
    <AbsoluteFill>
      {scenes.map((scene, index) => {
        // Debug log for each scene
        console.log('Scene data:', {
          index,
          scene,
          image: images[index],
          audio: audioUrls[index]
        });

        return (
          <Sequence
            key={index}
            from={index * SCENE_DURATION - (index > 0 ? TRANSITION_DURATION : 0)}
            durationInFrames={SCENE_DURATION + TRANSITION_DURATION}
          >
            <SceneComponent
              image={images[index]}
              audioData={audioUrls[index]}
              text={scene.contentText}
              isTransitioning={index > 0}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const SceneComponent = ({ image, audioData, text, isTransitioning }) => {
  const frame = useCurrentFrame();
  
  // Get audio duration from audioData or use default
  const AUDIO_DURATION = audioData?.duration || 5; // in seconds
  const BOUNCE_SPEED = 0.2;
  const BOUNCE_HEIGHT = 6;
  const FONT_SIZE = 80;

  // Split text and create more precise word timings
  const words = text.split(' ').map((word, index, array) => {
    const wordDuration = AUDIO_DURATION / array.length;
    const start = index * wordDuration;
    // Add a small overlap between words to ensure smoother transitions
    const end = start + wordDuration + 0.1;
    return {
      word: word,
      start: start,
      end: end
    };
  });

  const currentTimeInSeconds = frame / FRAME_RATE;
  
  // Find current word with a small buffer to handle timing edges
  const currentWord = words.find(
    word => 
      currentTimeInSeconds >= word.start - 0.1 && 
      currentTimeInSeconds <= word.end + 0.1
  );

  console.log('Time:', currentTimeInSeconds, 'Current Word:', currentWord?.word);

  return (
    <AbsoluteFill>
      <Img
        src={image}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
      {audioData?.audioUrl && <Audio src={audioData.audioUrl} />}

      {currentWord && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) translateY(${Math.sin(frame * BOUNCE_SPEED) * BOUNCE_HEIGHT}px)`,
            zIndex: 10,
            fontSize: `${FONT_SIZE}px`,
            fontFamily: '"Comic Sans MS", "Chalkboard SE", "Marker Felt", sans-serif',
            fontWeight: '900',
            color: '#ffffff',
            textShadow: `
              -3px -3px 0 #000,
              3px -3px 0 #000,
              -3px 3px 0 #000,
              3px 3px 0 #000
            `,
            textAlign: 'center',
            width: '100%',
            padding: '0 20px',
          }}
        >
          {currentWord.word}
        </div>
      )}

      {/* Debug overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          color: 'white',
          fontSize: '16px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: '10px',
          zIndex: 11,
        }}
      >
        Time: {currentTimeInSeconds.toFixed(2)}s
        <br />
        Word: {currentWord?.word || 'none'}
        <br />
        Duration: {AUDIO_DURATION}s
      </div>
    </AbsoluteFill>
  );
}; 