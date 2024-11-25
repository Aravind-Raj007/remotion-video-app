import React from "react";
import ImageRunner from "./ImageRunner";
import styled from "styled-components";
import { Audio, staticFile } from 'remotion';

 const Vijay = ({  }) => {
  
const LogoContainer = styled.div`
background: white;
width: 100%;
height: 100%; 
position: relative;
`;
  return (
    <LogoContainer>
      <ImageRunner />
      <Audio 
  src={staticFile('audio/leo.mp3')}
  volume={0.5}
  startFrom={2}
  endAt={10}
/>
        </LogoContainer>
  );
};
export default Vijay;
