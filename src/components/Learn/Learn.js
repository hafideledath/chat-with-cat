import React, { useState } from 'react';
import styled from 'styled-components';

const LearnContainer = styled.div`
  text-align: center;
`;

const LanguageOptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin: 30px 0;
`;

const LanguageCard = styled.div`
  background-color: #fff;
  padding: 20px;
  border: 3px solid #000;
  border-radius: 15px;
  width: 200px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.1);
  
  ${props => props.selected && `
    background-color: #f0e6d2;
    transform: scale(1.05);
    box-shadow: 7px 7px 0 rgba(0, 0, 0, 0.15);
  `}
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 7px 7px 0 rgba(0, 0, 0, 0.15);
  }
`;

const LanguageIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const LearningAreaContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border: 3px solid #000;
  border-radius: 15px;
  margin: 30px 0;
  min-height: 300px;
  box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.2);
`;

const WordCard = styled.div`
  background-color: #f8f8f8;
  padding: 15px;
  border: 2px solid #000;
  border-radius: 10px;
  margin: 20px auto;
  max-width: 400px;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.1);
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#6f4e37' : '#fff'};
  color: ${props => props.primary ? '#fff' : '#6f4e37'};
  border: 2px solid #000;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
`;

// Sample vocabulary data
const vocabularyData = {
  spanish: [
    { word: 'Hola', translation: 'Hello', example: '¡Hola! ¿Cómo estás?' },
    { word: 'Café', translation: 'Coffee', example: 'Me gusta el café.' },
    { word: 'Libro', translation: 'Book', example: 'Estoy leyendo un libro.' },
    { word: 'Amigo', translation: 'Friend', example: 'Él es mi amigo.' },
    { word: 'Gracias', translation: 'Thank you', example: '¡Muchas gracias!' },
  ],
  french: [
    { word: 'Bonjour', translation: 'Hello', example: 'Bonjour! Comment allez-vous?' },
    { word: 'Café', translation: 'Coffee', example: "J'aime le café." },
    { word: 'Livre', translation: 'Book', example: 'Je lis un livre.' },
    { word: 'Ami', translation: 'Friend', example: 'Il est mon ami.' },
    { word: 'Merci', translation: 'Thank you', example: 'Merci beaucoup!' },
  ],
  italian: [
    { word: 'Ciao', translation: 'Hello', example: 'Ciao! Come stai?' },
    { word: 'Caffè', translation: 'Coffee', example: 'Mi piace il caffè.' },
    { word: 'Libro', translation: 'Book', example: 'Sto leggendo un libro.' },
    { word: 'Amico', translation: 'Friend', example: 'Lui è il mio amico.' },
    { word: 'Grazie', translation: 'Thank you', example: 'Grazie mille!' },
  ],
};

const languages = [
  { id: 'spanish', name: 'Spanish', icon: '🇪🇸' },
  { id: 'french', name: 'French', icon: '🇫🇷' },
  { id: 'italian', name: 'Italian', icon: '🇮🇹' },
];

const Learn = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);

  const handleLanguageSelect = (languageId) => {
    setSelectedLanguage(languageId);
    setCurrentWordIndex(0);
    setShowTranslation(false);
  };

  const handleNextWord = () => {
    if (selectedLanguage && vocabularyData[selectedLanguage]) {
      setCurrentWordIndex((prevIndex) => 
        (prevIndex + 1) % vocabularyData[selectedLanguage].length
      );
      setShowTranslation(false);
    }
  };

  const handlePrevWord = () => {
    if (selectedLanguage && vocabularyData[selectedLanguage]) {
      setCurrentWordIndex((prevIndex) => 
        prevIndex === 0 
          ? vocabularyData[selectedLanguage].length - 1 
          : prevIndex - 1
      );
      setShowTranslation(false);
    }
  };

  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  const currentWord = selectedLanguage && vocabularyData[selectedLanguage] 
    ? vocabularyData[selectedLanguage][currentWordIndex] 
    : null;

  return (
    <LearnContainer>
      <h2>Learn New Words</h2>
      <p>Select a language and start learning with our fun, scribble-based approach</p>
      
      <LanguageOptionsContainer className="language-options">
        {languages.map((language) => (
          <LanguageCard 
            key={language.id} 
            selected={selectedLanguage === language.id}
            onClick={() => handleLanguageSelect(language.id)}
            className="language-card"
          >
            <LanguageIcon>{language.icon}</LanguageIcon>
            <h3>{language.name}</h3>
          </LanguageCard>
        ))}
      </LanguageOptionsContainer>
      
      {selectedLanguage && (
        <LearningAreaContainer>
          <h3>Learning {languages.find(l => l.id === selectedLanguage)?.name}</h3>
          
          {currentWord && (
            <WordCard>
              <h2 style={{ fontSize: '2.5rem', margin: '10px 0' }}>{currentWord.word}</h2>
              
              {showTranslation && (
                <>
                  <p style={{ fontSize: '1.5rem', margin: '10px 0' }}>{currentWord.translation}</p>
                  <p style={{ fontStyle: 'italic', marginTop: '15px' }}>{currentWord.example}</p>
                </>
              )}
            </WordCard>
          )}
          
          <ControlsContainer>
            <Button onClick={handlePrevWord}>Previous</Button>
            <Button primary onClick={toggleTranslation}>
              {showTranslation ? 'Hide Translation' : 'Show Translation'}
            </Button>
            <Button onClick={handleNextWord}>Next</Button>
          </ControlsContainer>
        </LearningAreaContainer>
      )}
    </LearnContainer>
  );
};

export default Learn;
