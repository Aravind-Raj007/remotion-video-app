import { Player } from '@remotion/player';
import { useLocation } from 'react-router-dom';
import { MainVideo, SCENE_DURATION } from '../components/RemotionVideo/MainVideo';

const VideoPage = () => {
  const { scenes, images, audioUrls } = useLocation().state;
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '20px', 
      width: '100%', 
      height: '100%' 
    }}>
      <h1 className="text-xl font-bold mb-4">Remotion Video Player</h1>
      <div style={{ 
        width: '270px',  // Fixed width for mobile-friendly size
        aspectRatio: '9/16'  // Maintain portrait aspect ratio
      }}>
        <Player
          component={MainVideo}
          durationInFrames={scenes.length * SCENE_DURATION}
          compositionWidth={1080}
          compositionHeight={1920}
          fps={30}
          controls
          loop={false}
          audio={true}
          muted={false}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          inputProps={{
            scenes,
            images,
            audioUrls
          }}
        />
      </div>
    </div>
  );
};

export default VideoPage; 