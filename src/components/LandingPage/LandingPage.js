import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Flag images
import frenchFlag from '../languages/French/flag.png';
import britishFlag from '../languages/English/flag.png';
import spanishFlag from '../languages/Spanish/flag.png';

// Sound effects
import flagSound from '../sound_effects/flag.mp3';
import doorSound from '../sound_effects/door.mp3';
import notchSound from '../sound_effects/notch.mp3';

import logo from '../logo.png';

// Styled components
const LandingContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: var(--color-background);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
`;

const Title = styled.h1`
  font-family: 'Barriecito', serif;
  font-weight: 800;
  font-size: 4.5rem;
  color: #843623;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.img.attrs({
  src: logo,
})`
  width: 120px;
  margin: 0 0 10px 30px;
`;

const LanguageGrid = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  max-width: 1000px;
`;

const LanguageCard = styled.div`
  width: 280px;
  height: 240px;
  background-color: var(--color-primary);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Flag = styled.img`
  width: 120px;
  height: auto;
  margin-bottom: 20px;
  border: 2px solid var(--color-text-bubble);
`;

const LanguageText = styled.p`
  font-size: 1.4rem;
  color: var(--color-text-bubble);
  font-family: 'Lexend', sans-serif;
  margin: 0;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  font-size: 0.8rem;
  color: #703e2c;
`;

const Credits = styled.div`
  text-align: left;
`;

const NativeLanguageContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const NativeLanguageLabel = styled.div`
  font-size: 0.9rem;
  color: #703e2c;
  margin-bottom: 5px;
  font-weight: 500;
`;

const NativeLanguageDropdown = styled.select`
  padding: 8px 12px;
  border-radius: 5px;
  background-color: var(--color-primary);
  color: var(--color-text-bubble);
  border: 2px solid #703e2c;
  font-family: 'Lexend', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8e2bc;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(112, 62, 44, 0.3);
  }
`;

function LandingPage() {
  const navigate = useNavigate();
  const flagAudioRef = useRef(null);
  const doorAudioRef = useRef(null);
  const notchAudioRef = useRef(null);
  
  // State for the user's native language (for UI translation)
  const [nativeLanguage, setNativeLanguage] = useState(() => {
    return localStorage.getItem('catAssistant_nativeLanguage') || 'en';
  });
  
  // Initialize audio references
  useEffect(() => {
    flagAudioRef.current = new Audio(flagSound);
    flagAudioRef.current.volume = 0.3; // Lower volume for hover sound
    
    doorAudioRef.current = new Audio(doorSound);
    doorAudioRef.current.volume = 0.5;
    
    notchAudioRef.current = new Audio(notchSound);
    notchAudioRef.current.volume = 0.4;
    
    // Cleanup function
    return () => {
      if (flagAudioRef.current) {
        flagAudioRef.current.pause();
        flagAudioRef.current = null;
      }
      if (doorAudioRef.current) {
        doorAudioRef.current.pause();
        doorAudioRef.current = null;
      }
      if (notchAudioRef.current) {
        notchAudioRef.current.pause();
        notchAudioRef.current = null;
      }
    };
  }, []);
  
  // Play flag hover sound
  const playFlagSound = () => {
    try {
      if (flagAudioRef.current) {
        // Reset audio position and play
        flagAudioRef.current.currentTime = 0;
        flagAudioRef.current.play().catch(error => 
          console.error('Error playing flag sound:', error)
        );
      }
    } catch (error) {
      console.error('Error with flag sound effect:', error);
    }
  };
  
  // Play notch sound for dropdown selection
  const playNotchSound = () => {
    try {
      if (notchAudioRef.current) {
        notchAudioRef.current.currentTime = 0;
        notchAudioRef.current.play().catch(error => 
          console.error('Error playing notch sound:', error)
        );
      }
    } catch (error) {
      console.error('Error with notch sound effect:', error);
    }
  };
  
  // Handle native language selection
  const handleNativeLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setNativeLanguage(newLanguage);
    localStorage.setItem('catAssistant_nativeLanguage', newLanguage);
    playNotchSound();
  };
  
  const handleLanguageSelect = (language) => {
    try {
      // Play door sound when entering the cafe
      if (doorAudioRef.current) {
        doorAudioRef.current.play()
          .then(() => {
            // Navigate after a small delay to allow sound to begin playing
            setTimeout(() => {
              navigate(`/chat/${language}`);
            }, 300);
          })
          .catch(error => {
            console.error('Error playing door sound:', error);
            navigate(`/chat/${language}`); // Navigate anyway if sound fails
          });
      } else {
        navigate(`/chat/${language}`);
      }
    } catch (error) {
      console.error('Error with door sound effect:', error);
      navigate(`/chat/${language}`); // Navigate anyway if there's an error
    }
  };
  
  return (
    <LandingContainer>
      <Title>
        Chat With Cat <Logo />
      </Title>
      
      <LanguageGrid>
        <LanguageCard 
          onClick={() => handleLanguageSelect('french')}
          onMouseEnter={playFlagSound}
        >
          <Flag 
            src={frenchFlag} 
            alt="French Flag"
          />
          <LanguageText>Chat en français</LanguageText>
        </LanguageCard>
        
        <LanguageCard 
          onClick={() => handleLanguageSelect('english')}
          onMouseEnter={playFlagSound}
        >
          <Flag 
            src={britishFlag} 
            alt="English Flag"
          />
          <LanguageText>Chat in English</LanguageText>
        </LanguageCard>
        
        <LanguageCard 
          onClick={() => handleLanguageSelect('spanish')}
          onMouseEnter={playFlagSound}
        >
          <Flag 
            src={spanishFlag} 
            alt="Spanish Flag"
          />
          <LanguageText>Chatear en español</LanguageText>
        </LanguageCard>
      </LanguageGrid>
      
      <Footer>
        <Credits>Made by Hafid Eledath, Zhao Xiuqi and Advik Shetty for the "Rebuild hackathon"</Credits>
      </Footer>
      
      {/* Native Language Selector for UI translation */}
      <NativeLanguageContainer>
        <NativeLanguageLabel>
          {nativeLanguage === 'en' && 'Interface Language'}
          {nativeLanguage === 'fr' && 'Langue de l\'interface'}
          {nativeLanguage === 'es' && 'Idioma de la interfaz'}
          {nativeLanguage === 'de' && 'Schnittstellensprache'}
          {nativeLanguage === 'it' && 'Lingua dell\'interfaccia'}
          {nativeLanguage === 'pt' && 'Idioma da interface'}
          {nativeLanguage === 'nl' && 'Interfacetaal'}
          {nativeLanguage === 'sv' && 'Gränssnittsspråk'}
          {nativeLanguage === 'da' && 'Grænsefladesprog'}
          {nativeLanguage === 'no' && 'Grensesnittsspråk'}
          {nativeLanguage === 'pl' && 'Język interfejsu'}
          {nativeLanguage === 'ro' && 'Limba interfeței'}
        </NativeLanguageLabel>
        <NativeLanguageDropdown
          value={nativeLanguage}
          onChange={handleNativeLanguageChange}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
          <option value="de">Deutsch</option>
          <option value="it">Italiano</option>
          <option value="pt">Português</option>
          <option value="nl">Nederlands</option>
          <option value="sv">Svenska</option>
          <option value="da">Dansk</option>
          <option value="no">Norsk</option>
          <option value="pl">Polski</option>
          <option value="ro">Română</option>
        </NativeLanguageDropdown>
      </NativeLanguageContainer>
    </LandingContainer>
  );
}

export default LandingPage;
