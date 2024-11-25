import React, { useState } from 'react';
import { Player } from '@remotion/player';
import ImageRunner from './ImageRunner';

const VideoEditor = () => {
  const [captions, setCaptions] = useState(Array(10).fill(''));
  const [audioFile, setAudioFile] = useState(null);
  const [images, setImages] = useState(Array(10).fill(null));
  const [transitionType, setTransitionType] = useState('fade'); // User-selected transition
  const [activeTab, setActiveTab] = useState('frames'); // New state for active tab

  const handleCaptionChange = (index, value) => {
    const newCaptions = [...captions];
    newCaptions[index] = value;
    setCaptions(newCaptions);
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newImages = [...images];
      newImages[index] = imageUrl;
      setImages(newImages);
    }
  };

  const tabIcons = {
    frames: '🎬',
    audio: '🎵',
    transition: '🔄'
  };

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Inter, system-ui, sans-serif', 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh',
      color: '#1e293b'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#0f172a', 
        fontSize: '42px', 
        fontWeight: '800', 
        marginBottom: '40px',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        background: 'linear-gradient(135deg, #1e293b, #3b82f6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Video Editor
      </h1>

      <div style={{ display: 'flex', gap: '35px' }}>
        {/* Modern Sidebar */}
        <div style={{
          width: '240px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}>
          {['frames', 'audio', 'transition'].map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '16px',
                marginBottom: '12px',
                backgroundColor: activeTab === tab ? '#f1f5f9' : 'transparent',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'capitalize',
                fontWeight: activeTab === tab ? '600' : '500',
                color: activeTab === tab ? '#0f172a' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '16px',
                ':hover': {
                  backgroundColor: '#f8fafc',
                  transform: 'translateX(4px)'
                }
              }}
            >
              <span style={{ fontSize: '20px' }}>{tabIcons[tab]}</span>
              {tab}
            </div>
          ))}
        </div>

        {/* Enhanced Controls Panel */}
        <div style={{
          flex: 1,
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}>
          {activeTab === 'frames' && (
            <div>
              <h2 style={{ 
                marginBottom: '30px', 
                color: '#0f172a', 
                fontSize: '28px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span>🎬</span> Frame Settings
              </h2>
              {captions.map((caption, index) => (
                <div key={index} style={{ 
                  marginBottom: '30px', 
                  padding: '24px', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '14px',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#ffffff',
                  ':hover': {
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}>
                  <label style={{ 
                    fontSize: '18px', 
                    color: '#334155',
                    fontWeight: '600',
                    marginBottom: '12px',
                    display: 'block'
                  }}>{`Scene ${index + 1}`}</label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    placeholder={`Enter caption for scene ${index + 1}`}
                    style={{
                      width: '100%',
                      padding: '14px',
                      marginBottom: '20px',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: '15px',
                      transition: 'all 0.2s ease',
                      ':focus': {
                        outline: 'none',
                        borderColor: '#3b82f6',
                        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
                      }
                    }}
                  />

                  <div style={{ 
                    position: 'relative',
                    width: '100%',
                    height: '140px',
                    border: '2px dashed #cbd5e1',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8fafc',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    ':hover': {
                      borderColor: '#3b82f6',
                      backgroundColor: '#f1f5f9'
                    }
                  }}>
                    {images[index] ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        padding: '16px'
                      }}>
                        <img 
                          src={images[index]} 
                          alt={`Preview ${index + 1}`} 
                          style={{
                            height: '100px',
                            width: '100px',
                            objectFit: 'cover',
                            borderRadius: '10px',
                            marginRight: '16px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <span style={{ 
                          color: '#64748b', 
                          fontSize: '15px',
                          fontWeight: '500'
                        }}>
                          Click to change image
                        </span>
                      </div>
                    ) : (
                      <div style={{ 
                        color: '#64748b',
                        fontSize: '15px',
                        fontWeight: '500',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{ fontSize: '24px' }}>📸</span>
                        Click to upload image
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(index, e)}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'audio' && (
            <div>
              <h2 style={{ marginBottom: '20px', color: '#555', fontSize: '24px' }}>Audio Settings</h2>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '16px', color: '#555' }}>
                  Select Background Music:
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
              </div>
            </div>
          )}

          {activeTab === 'transition' && (
            <div>
              <h2 style={{ marginBottom: '20px', color: '#555', fontSize: '24px' }}>Transition Settings</h2>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '16px', color: '#555' }}>
                  Select Transition Effect:
                </label>
                <select
                  value={transitionType}
                  onChange={(e) => setTransitionType(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                  <option value="fade">Fade</option>
                  <option value="slide">Slide</option>
                  <option value="wipe">Wipe</option>
                  <option value="flip">Flip</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Video Preview */}
        <div style={{ width: '360px' }}>
          <Player
            component={ImageRunner}
            inputProps={{
              userCaptions: captions,
              audioSrc: audioFile,
              images: images,
              Type: transitionType,
            }}
            durationInFrames={890}
            compositionWidth={1080}
            compositionHeight={1920}
            fps={30}
            controls
            style={{
              borderRadius: '16px',
              width: '360px',
              height: '640px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }}
            initialFrame={0}
            clickToPlay
            doubleClickToFullscreen
          />
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;
