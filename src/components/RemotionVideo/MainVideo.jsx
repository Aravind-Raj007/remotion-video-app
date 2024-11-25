import { Sequence, AbsoluteFill, Audio, Img, useCurrentFrame, interpolate } from 'remotion';

export const FRAME_RATE = 30;
export const SCENE_DURATION = 4 * FRAME_RATE; // 4 seconds * 30fps = 120 frames

const TRANSITION_DURATION = 30; // Duration of transition in frames

export const MainVideo = ({ scenes, images, audioUrls }) => {
  return (
    <AbsoluteFill>
      {scenes.map((scene, index) => (
        <Sequence
          key={index}
          from={index * SCENE_DURATION - (index > 0 ? TRANSITION_DURATION : 0)}
          durationInFrames={SCENE_DURATION + TRANSITION_DURATION}
        >
          <SceneComponent
            image={images[index]}
            audioUrl={audioUrls[index]}
            text={scene.contentText}
            isTransitioning={index > 0}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const SceneComponent = ({ image, audioUrl, text, isTransitioning }) => {
  const frame = useCurrentFrame();
  
  // Calculate transition progress
  const transitionProgress = isTransitioning
    ? interpolate(
        frame,
        [0, TRANSITION_DURATION],
        [0, 100],
        { extrapolateRight: 'clamp' }
      )
    : 100;

  // Fun animations
  const wiggle = Math.sin(frame * 0.2) * 3;
  const bounce = Math.sin(frame * 0.15) * 4;
  
  // Rainbow colors for words
  const colors = [
    '#FF6B6B', // coral
    '#4ECDC4', // turquoise
    '#FFD93D', // yellow
    '#FF8BD2', // pink
    '#6C5CE7', // purple
  ];

  const words = text.split(' ');

  return (
    <AbsoluteFill>
      <Img
        src={image}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          clipPath: `inset(0 ${100 - transitionProgress}% 0 0)`,
        }}
      />
      <Audio src={audioUrl} />

      {/* Caption container moved to bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '95%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Party emojis at top */}
        <div style={{ 
          fontSize: '45px',
          marginBottom: '10px',
          display: 'flex',
          gap: '15px',
        }}>
          <span style={{ transform: `rotate(${-wiggle}deg)` }}>🎉</span>
          <span style={{ transform: `translateY(${bounce}px)` }}>🎪</span>
          <span style={{ transform: `rotate(${wiggle}deg)` }}>🎈</span>
        </div>

        {/* Text container with rainbow effect */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
            padding: '20px',
            borderRadius: '20px',
            background: 'rgba(0, 0, 0, 0.6)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
          }}
        >
          {words.map((word, index) => (
            <span
              key={index}
              style={{
                fontSize: '55px',
                fontWeight: '900',
                fontFamily: '"Comic Sans MS", "Chalkboard SE", "Marker Felt", sans-serif',
                color: colors[index % colors.length],
                display: 'inline-block',
                transform: `translateY(${Math.sin((frame + index * 5) * 0.2) * 6}px) rotate(${Math.sin((frame + index * 5) * 0.1) * 3}deg)`,
                textShadow: `
                  -3px -3px 0 #ff71e1,
                  3px -3px 0 #ff71e1,
                  -3px 3px 0 #ff71e1,
                  3px 3px 0 #ff71e1,
                  0 0 20px rgba(255,113,225,0.5)
                `,
                padding: '0 5px',
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}; 