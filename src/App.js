import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VideoRequestForm from './components/VideoRequestForm';
import VideoPage from './pages/VideoPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VideoRequestForm />} />
        <Route path="/video" element={<VideoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;