import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';

// Import components
import Home from './components/Home/Home';
import Learn from './components/Learn/Learn';
import Practice from './components/Practice/Practice';
import Profile from './components/Profile/Profile';

// Styled Components for the minimalist design
const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #FFF2BD;
  overflow: hidden;
  position: relative;
`;

function App() {
  return (
    <Router>
      <AppContainer className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
