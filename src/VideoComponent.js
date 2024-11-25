import { Composition } from 'remotion';
import { TransitionSequence, Transition } from '@remotion/transition';
import { TransitionSeries } from '@remotion/transitions';

const VideoComponent = () => {
  const scenes = JSON.parse(sessionStorage.getItem('scenes') || '[]');

  if (scenes.length === 0) {
    return <div>No scenes to display. Please generate a video first!</div>;
  }

  return (
    <Composition
      id="AI-Generated-Video"
      component={VideoComposition}
      durationInFrames={scenes.length * 150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ scenes }}
    />
  );
};

const VideoComposition = ({ scenes }) => {
  return (
    <TransitionSeries>
    <TransitionSeries.Sequence>
      {scenes.map((scene, index) => (
        <TransitionSeries.Transition
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
        </TransitionSeries.Transition  >
      ))}
    </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

export default VideoComponent;
