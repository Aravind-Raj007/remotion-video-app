import { Sequence, AbsoluteFill, Audio, Img, useCurrentFrame } from 'remotion';

export const FRAME_RATE = 30;
export const SCENE_DURATION = 5 * FRAME_RATE;
const TRANSITION_DURATION = 30;

const WordPairComponent = ({ words, currentTime }) => {
  const [firstWord, secondWord] = words;
  const pairStartTime = firstWord.start;
  const pairEndTime = secondWord.end;
  const isActive = currentTime >= pairStartTime && currentTime <= pairEndTime;
  const currentWordIndex = currentTime >= secondWord.start ? 1 : 0;

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        transform: `
          scale(${isActive ? 1 : 0.95}) 
          translateY(${isActive ? 0 : 10}px)
        `,
        opacity: isActive ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)',
      }}
    >
      {words.map((word, index) => (
        <div
          key={word.id}
          style={{
            display: 'inline-block',
            background: currentWordIndex === index 
              ? 'linear-gradient(135deg, #FFFFFF 0%, #F0F0F0 100%)'
              : 'rgba(255, 255, 255, 0.15)',
            padding: '12px 20px',
            borderRadius: '12px',
            color: currentWordIndex === index ? '#000000' : 'rgba(255, 255, 255, 0.9)',
            fontSize: '38px',
            fontWeight: '800',
            fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: currentWordIndex === index
              ? '0 8px 20px rgba(0,0,0,0.3)'
              : '0 4px 12px rgba(0,0,0,0.1)',
            border: currentWordIndex === index
              ? '2px solid rgba(255,255,255,0.9)'
              : '2px solid rgba(255,255,255,0.2)',
            transform: `scale(${currentWordIndex === index ? 1.05 : 1})`,
            transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
          }}
        >
          {word.text}
        </div>
      ))}
    </div>
  );
};

const SceneComponent = ({ image, audioData, sceneTransition }) => {
  const frame = useCurrentFrame();
  const currentTimeInSeconds = frame / FRAME_RATE;

  // Group words into pairs
  const getWordPairs = (words) => {
    const pairs = [];
    for (let i = 0; i < words.length; i += 2) {
      if (i + 1 < words.length) {
        pairs.push([words[i], words[i + 1]]);
      } else {
        // Handle odd number of words
        pairs.push([words[i], { ...words[i], text: '', start: words[i].end, end: words[i].end }]);
      }
    }
    return pairs;
  };

  // Get current pair of words and transition state
  const getCurrentPairAndState = (time, pairs) => {
    const currentPairIndex = pairs.findIndex(pair => 
      time >= pair[0].start && time <= pair[1].end
    );

    return {
      currentPair: currentPairIndex !== -1 ? pairs[currentPairIndex] : pairs[0],
      isTransitioning: currentPairIndex === -1
    };
  };

  const words = audioData?.words || [];
  const wordPairs = getWordPairs(words);
  const { currentPair, isTransitioning } = getCurrentPairAndState(currentTimeInSeconds, wordPairs);

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
      
      {/* Background overlay */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `
            linear-gradient(
              180deg,
              rgba(0,0,0,0) 0%,
              rgba(0,0,0,0.4) 70%,
              rgba(0,0,0,0.7) 100%
            )
          `,
        }}
      />

      {audioData?.audioUrl && <Audio src={audioData.audioUrl} />}
      
      {/* Caption container */}
      <div
        style={{
          position: 'absolute',
          bottom: '22%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 20px',
          zIndex: 10,
          perspective: '1000px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: `
              translateY(${isTransitioning ? -5 : 0}px)
              scale(${isTransitioning ? 0.98 : 1})
            `,
            transition: 'all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)',
          }}
        >
          {currentPair && (
            <WordPairComponent
              words={currentPair}
              currentTime={currentTimeInSeconds}
            />
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

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
            audioData={audioUrls[index]}
            sceneTransition={index > 0}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
