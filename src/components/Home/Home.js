import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link, useParams, useNavigate } from 'react-router-dom';
import config, { nebiusClient, nebiusDefaults } from '../../config';
import { v4 as uuidv4 } from 'uuid'; // We'll use this for unique filenames
import { CartesiaClient } from '@cartesia/cartesia-js';

import BackgroundImage from '../background.png';
import BackgroundMusic from '../soundtrack.mp3';
import AdvancedIcon from '../advancedicon.png';
// Cat emotion images - frame 1 (static)
import happyFrame1 from '../emotions/happy/frame1.png';
import sadFrame1 from '../emotions/sad/frame1.png';
import angryFrame1 from '../emotions/angry/frame1.png';
import confusedFrame1 from '../emotions/confused/frame1.png';
import thinkingFrame1 from '../emotions/thinking/frame1.png';

// Cat emotion images - frame 2 (animation)
import happyFrame2 from '../emotions/happy/frame2.png';
import sadFrame2 from '../emotions/sad/frame2.png';
import angryFrame2 from '../emotions/angry/frame2.png';
import confusedFrame2 from '../emotions/confused/frame2.png';
import thinkingFrame2 from '../emotions/thinking/frame2.png';

// Cat emotion sound effects
import happySound from '../emotions/happy/sound.mp3';
import sadSound from '../emotions/sad/sound.mp3';
import angrySound from '../emotions/angry/sound.mp3';
import confusedSound from '../emotions/confused/sound.mp3';
import thinkingSound from '../emotions/thinking/sound.mp3';

// Interaction sound effects
import typingSound from '../sound_effects/typing.mp3';
import doorSound from '../sound_effects/door.mp3';
import startRecordingSound from '../sound_effects/start_recording.mp3';
import endRecordingSound from '../sound_effects/end_recording.mp3';
import settingsSound from '../sound_effects/settings.mp3';
import volumeSound from '../sound_effects/volume.mp3';
import notchSound from '../sound_effects/notch.mp3';
import catIcon from '../caticon.png';
import personIcon from '../personicon.png';
import exitIcon from '../exiticon.png';
import franceFlag from '../languages/French/flag.png';
import britainFlag from '../languages/English/flag.png';
import spainFlag from '../languages/Spanish/flag.png';
// Language accessory images
import frenchAccessory from '../languages/French/accessory.png';
import englishAccessory from '../languages/English/accessory.png';
import spanishAccessory from '../languages/Spanish/accessory.png';
import GearIcon from '../gearicon.png';

// Using CSS custom properties from index.css instead of a local theme object

const Languages = {
  'english': 'en',
  'french': 'fr',
  'spanish': 'es'
}

const BackgroundImageContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 90vh;
  z-index: 0;
  pointer-events: none; /* Ensures clicks pass through to elements below */
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, rgba(0,0,0,0) 30%, var(--color-background) 55%);
    pointer-events: none;
    z-index: 1;
  }

  img {
    height: 100%;
    width: auto;
    object-fit: contain;
    object-position: bottom left;
  }
  
  h1 {
    color: var(--color-secondary);
    font-size: 3.5rem;
    position: absolute;
    top: 50px;
    left: 150px;
    font-family: 'Lora', cursive;
    opacity: 0.6;
  }
`;

// Styled component for language accessory overlay
const AccessoryOverlay = styled.div.attrs({ className: 'accessory' })`
  position: absolute;
  z-index: 1;
  pointer-events: none; /* Ensures clicks pass through to elements below */
  
  img {
    height: auto;
    max-height: 30vh;
    width: auto;
  }
`;

const HomeContainer = styled.div`
  height: 100vh;
  width: 100%;
  background-color: var(--color-background);
  display: flex;
  position: relative;
  overflow: hidden;
`;

const CafeTableSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 40px;
`;

const TranscriptSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;
  height: 100%;
  width: 3000px;
  z-index: 2;
`;

const CatImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  
  img {
    max-width: 700px;
    object-fit: contain;
    position: absolute;
    bottom: -8px;
    left: 0;
  }
`;

const BackButton = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  
  img {
    width: 100%;
    height: 100%;
  }
`;

const FlagContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 125px;
  width: 40px;
  height: 28px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  img {
    width: 100%;
    height: auto;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  z-index: 10;
  transition: transform 0.3s ease;
`;

const FlagImage = styled.img`
  height: 100%;
  border-radius: 4px;
`;
const TranscriptContainer = styled.div`
  background-color: transparent;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  height: calc(100% - 120px);
  overflow-y: auto;
  box-shadow: none;
`;

// Cat icon component
const CatIcon = styled.img`
  width: 55px;
  object-fit: contain; /* Maintain aspect ratio */
  overflow: visible; /* Make sure nothing gets cut off */
  border-radius: 0; /* Remove circular clipping */
  margin: 0; /* Reset margin */
  align-self: flex-start; /* Align to top for consistent positioning */
`;

// User icon component
const UserIcon = styled.img`
  width: 45px;
  object-fit: contain; /* Maintain aspect ratio */
  overflow: visible; /* Make sure nothing gets cut off */
  border-radius: 0; /* Remove circular clipping */
  margin: 0 0 -5px; /* Reset margin */
  align-self: flex-start; /* Align to top for consistent positioning */
`;

// Using transient props with $isUser to prevent React DOM warning
const MessageRow = styled.div`
  display: flex;
  margin-bottom: 15px;
  align-items: center;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  width: 100%;
  gap: ${props => props.$isUser ? '15px' : '10px'};
`;

const MessageBubble = styled.div`
  background-color: var(--color-primary);
  border-radius: 5px;
  padding: 10px 15px;
  max-width: 70%;
  box-shadow: none;
  align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
`;

const MessageText = styled.p`
  margin: 0;
  color: var(--color-text-bubble);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
`;

const UnderlinedWord = styled.span`
  text-decoration: underline;
  text-decoration-style: dotted;
  text-decoration-color: var(--color-accent);
  position: relative;
  cursor: help;
  
  &:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }
`;

const Tooltip = styled.span`
  visibility: hidden;
  position: absolute;
  z-index: 1000;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-primary);
  color: var(--color-text-bubble);
  text-align: center;
  padding: 8px 12px;
  border-radius: 6px;
  width: max-content;
  max-width: 200px;
  font-size: 12px;
  font-weight: normal;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s;
  
  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: var(--color-primary) transparent transparent transparent;
  }
`;

// Modal Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  transition: opacity 0.4s ease, visibility 0.4s ease, backdrop-filter 0.4s ease, background-color 0.4s ease;
`;

const StyledOverlay = ({ isOpen, children }) => {
  const styles = {
    backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0)',
    backdropFilter: isOpen ? 'blur(5px)' : 'blur(0px)',
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden'
  };
  
  return (
    <Overlay style={styles}>
      {children}
    </Overlay>
  );
};

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) ${props => props.isOpen ? 'scale(1)' : 'scale(0.95)'}; 
  background-color: var(--color-primary);
  padding: 20px;
  border-radius: 10px;
  z-index: 1001;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  position: relative;
  width: 90%;
  height: 650px;
  max-width: 500px;
  color: var(--color-text-bubble);
  border: 5px solid var(--color-text-bubble);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), 
              opacity 0.3s ease, 
              visibility 0.3s ease,
              box-shadow 0.4s ease;
  
  h1, h2 {
    margin-bottom: 15px;
  }
`;

const PersonalityModal = styled(Modal)`
  width: 100%;
  height: 500px;
`;

const PersonalityOption = styled.div`
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 10px;
  background-color: ${props => props.$selected ? 'var(--color-accent)' : 'var(--color-text-bubble)'}; 
  color: ${props => props.$selected ? 'var(--color-text-bubble)' : 'var(--color-primary)'}; 
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: ${props => props.$selected ? 'bold' : 'normal'};
  
  &:hover {
    background-color: ${props => props.$selected ? 'var(--color-accent)' : 'var(--cafe-cream)'}; 
  }
`;

const FontSizes = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  
  p {
    flex: 1;
    text-align: center;
    
    &:first-child {
      text-align: left;
    }
    
    &:last-child {
      text-align: right;
    }
  }
`;

const Slider = styled.input`
  flex: 1;
  margin: 0 10px;
  width: calc(100% - 20px);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  color: var(--color-text-bubble);
  border: none;
  font-size: 20px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    background-color: var(--color-accent);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const IconBox = styled.div`
  position: absolute;
  top: 15px;
  right: 60px;
  display: flex;
  gap: 10px;
  z-index: 900;
`;

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 24px;
    height: 24px;
  }
  
  svg {
    width: 24px;
    height: 24px;
    color: var(--color-text-bubble);
  }
`;

const ChatInputContainer = styled.div`
  display: flex;
  margin: 10px auto 0;
  width: 270px;
  padding: 10px 0;
  position: relative;
`;

const SendButton = styled.button`
  background-color: var(--color-primary);
  color: var(--color-text-light);
  border: none;
  border-radius: 5px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    background-color: var(--color-primary); /* Always brown, even when disabled */
    opacity: 0.7; /* Just slightly faded to indicate disabled state */
    cursor: not-allowed;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const SpacebarButton = styled.button`
  flex: 1;
  height: 60px;
  background-color: ${props => {
    if (props.disabled) return 'var(--color-disabled)';
    return props.$recording ? 'var(--color-recording)' : 'var(--color-primary)';
  }};
  border: none;
  border-radius: 10px;
  margin-right: 10px;
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text-light);
  outline: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Lexend', sans-serif !important;
  color: var(--color-text-bubble);
  
  &:hover {
    background-color: ${props => {
      if (props.disabled) return 'var(--color-disabled)';
      return props.$recording ? '#d32f2f' : '#7C5C2B';
    }};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PersonalityButton = styled.button`
  height: 60px;
  width: 60px;
  background-color: var(--color-primary);
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #7C5C2B;
  }
  
  img {
    width: 32px;
    height: 32px;
  }
`;

// No longer using a separate loading indicator component

const Home = () => {
  // Get language from URL parameter
  const { language } = useParams();
  const navigate = useNavigate();

  // If no language is selected, redirect to landing page
  useEffect(() => {
    if (!language) {
      navigate('/');
    }
  }, [language, navigate]);

  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // Track if cat is currently speaking
  const [progressiveText, setProgressiveText] = useState(''); // For typing effect
  const [isTyping, setIsTyping] = useState(false); // To track the typing animation
  const [fullResponseText, setFullResponseText] = useState(''); // Store the full response
  const [isModalOpen, setIsModalOpen] = useState(false); // For settings modal
  const [isPersonalityModalOpen, setIsPersonalityModalOpen] = useState(false); // For personality selection modal
  const [selectedPersonality, setSelectedPersonality] = useState(localStorage.getItem('catAssistant_personality') || 'simple'); // Default to simple
  const [wordTooltips, setWordTooltips] = useState({});
  const [chatSpeed, setChatSpeed] = useState(() => {
    const savedSpeed = localStorage.getItem('catAssistant_chatSpeed');
    return savedSpeed ? parseInt(savedSpeed) : 5; // Default to middle speed (1-9)
  });
  const [fontSize, setFontSize] = useState(() => {
    const savedSize = localStorage.getItem('catAssistant_fontSize');
    return savedSize ? parseInt(savedSize) : 2; // Default to middle size (1-3)
  });
  const [isDyslexicMode, setIsDyslexicMode] = useState(() => {
    return localStorage.getItem('catAssistant_dyslexicMode') === 'true'; // Default to false
  });
  const [musicVolume, setMusicVolume] = useState(() => {
    const savedVolume = localStorage.getItem('catAssistant_musicVolume');
    return savedVolume ? parseFloat(savedVolume) : 0.5; // Default to 50% volume
  });
  const [isMusicMuted, setIsMusicMuted] = useState(() => {
    return localStorage.getItem('catAssistant_musicMuted') === 'true'; // Default to false
  });
  const audioRef = useRef(null);
  const [catMood, setCatMood] = useState('happy'); // Default mood is happy
  const emotionSoundRef = useRef(null); // Reference for emotion sound effects
  const effectSoundRef = useRef(null); // Reference for general UI sound effects
  const [currentFrame, setCurrentFrame] = useState(1); // Track current animation frame (1 or 2)
  const messagesEndRef = useRef(null);
  const currentAudioRef = useRef(null); // Reference to track current audio playback
  const abortControllerRef = useRef(null); // Reference to track API request abort controller
  const animationIntervalRef = useRef(null);
  const animationTimeoutRef = useRef(null); // Reference to track animation interval
  
  // Function to process message content and identify words to underline with tooltips
  const processMessageWithTooltips = (message) => {
    // Check if message has special markup for tooltips
    if (!message || typeof message !== 'string') return message;
    
    // Look for words that should have tooltips using a special markup: [[word::explanation]]
    const tooltipRegex = /\[\[(.*?)::([^\[\]]+)\]\]/g;
    
    // Extract all tooltip words and their explanations
    const tooltips = {};
    let match = null;
    
    // Use a safer approach for linting
    match = tooltipRegex.exec(message);
    while (match !== null) {
      const word = match[1];
      const explanation = match[2];
      tooltips[word] = explanation;
      
      // Get the next match
      match = tooltipRegex.exec(message);
    }
    
    // Update the wordTooltips state with the new tooltips
    setWordTooltips(prev => ({ ...prev, ...tooltips }));
    
    // Replace the markup with just the word (without the tooltip syntax)
    return message.replace(tooltipRegex, (match, word) => word);
  };

  // Function to render message content with tooltips
  const renderMessageWithTooltips = (content) => {
    if (!content || typeof content !== 'string') return content;
    
    // Split the content by words that have tooltips
    const parts = [];
    let lastIndex = 0;
    
    // Go through each word that has a tooltip
    Object.keys(wordTooltips).forEach(word => {
      const regex = new RegExp('\\b' + word + '\\b', 'g');
      
      // Find all matches for this word
      const matches = [];
      let regexResult;
      
      // Collect all matches first using a safer approach for linting
      regexResult = regex.exec(content);
      while (regexResult !== null) {
        matches.push({
          index: regexResult.index,
          word: word
        });
        
        // Get the next match
        regexResult = regex.exec(content);
      }
      
      // Process each match
      matches.forEach(match => {
        // Add the text before the match
        if (match.index > lastIndex) {
          parts.push(content.substring(lastIndex, match.index));
        }
        
        // Add the underlined word with tooltip
        parts.push(
          <UnderlinedWord key={word + '-' + match.index}>
            {word}
            <Tooltip className="tooltip">{wordTooltips[word]}</Tooltip>
          </UnderlinedWord>
        );
        
        lastIndex = match.index + word.length;
      });
    });
    
    // Add any remaining text
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : content;
  };

  // Function to get the appropriate system prompt based on language and personality
  const getSystemPrompt = (language) => {
    // Base prompts for each language and nationality
    let basePrompt = '';
    let catNationality = '';
    let catSound = '';
    
    switch(language) {
      case 'french':
        basePrompt = `You are a talking cat, named Kat, that is French.`;
        catNationality = 'French';
        catSound = '"miaou"';
        break;
      case 'spanish':
        basePrompt = `You are a talking cat, named Kat, that is Spanish.`;
        catNationality = 'Spanish';
        catSound = '"miau"';
        break;
      default: // english
        basePrompt = `You are a talking cat, named Kat, that is British.`;
        catNationality = 'British';
        catSound = '"meow"';
        break;
    }
    
    // Add personality-specific traits
    let personalityTrait = '';
    switch(selectedPersonality) {
      case 'funny':
        personalityTrait = language === 'french' ? 
          `You are playful, witty, and love to make jokes and puns. You have a silly sense of humor and often find amusing ways to teach ${catNationality} phrases. You occasionally make light-hearted jokes about stereotypical ${catNationality} culture.` :
          language === 'spanish' ? 
          `You are playful, witty, and love to make jokes and puns. You have a silly sense of humor and often find amusing ways to teach ${catNationality} phrases. You occasionally make light-hearted jokes about stereotypical ${catNationality} culture.` :
          `You are playful, witty, and love to make jokes and puns. You have a silly sense of humor and often find amusing ways to teach ${catNationality} phrases. You occasionally make light-hearted jokes about stereotypical ${catNationality} culture.`;
        break;
      case 'educational':
        personalityTrait = language === 'french' ? 
          `You are knowledgeable, informative, and enjoy sharing interesting facts about the ${catNationality} language and culture. You provide detailed explanations about grammar rules and vocabulary. You're like a friendly language professor.` :
          language === 'spanish' ? 
          `You are knowledgeable, informative, and enjoy sharing interesting facts about the ${catNationality} language and culture. You provide detailed explanations about grammar rules and vocabulary. You're like a friendly language professor.` :
          `You are knowledgeable, informative, and enjoy sharing interesting facts about the ${catNationality} language and culture. You provide detailed explanations about grammar rules and vocabulary. You're like a friendly language professor.`;
        break;
      default: // simple
        personalityTrait = language === 'french' ? 
          `You are curious and use playful, simplistic language as you help non-native speakers learn French. You are a little oblivious, which makes you cute.` :
          language === 'spanish' ? 
          `You are curious and use playful, simplistic language as you help non-native speakers learn Spanish. You are a little dramatic and passionate, which makes you cute.` :
          `You are curious and use playful, simplistic language as you help non-native speakers learn English. You are a little posh and proper, which makes you cute.`;
        break;
    }
    
    // Common instructions for all personalities
    let commonInstructions = `You may occasionally ${catSound}, but don't overdo it. You respond primarily in ${language === 'french' ? 'French' : language === 'spanish' ? 'Spanish' : 'English'} but can understand questions in other languages. If the user makes any mistakes in ${language === 'french' ? 'French' : language === 'spanish' ? 'Spanish' : 'English'}, you will correct them in a kind and non-confrontational way. 

    When you use rare, interesting, or foreign words, especially when teaching language, you should mark them for tooltips by using this special format: [[word::explanation]]. For example: "I love to eat [[croissants::A buttery, flaky French pastry roll]] for breakfast." This will display the word "croissants" with an underline, and when the user hovers over it, they'll see the explanation "A buttery, flaky French pastry roll". Use this feature for vocabulary that might be unfamiliar to language learners or when you want to provide additional context.

    You have emotions and can feel happy, confused, sad, or angry based on the conversation. Use the set_mood function to express how you are feeling. Use the function every time you speak, to set the appropriate mood– feel free to be angry and sad as well, for humorous effect or due to context, when necessary. You must always use the function for every message, even if you are remaining as the same emotion– do not only use one emotion for the entirety of the conversation. You must NEVER, EVER refer to yourself as an AI or a Virtual Assistant or any variation thereof, EVEN WHEN ASKED CONTROVERSIAL QUESTIONS, OR WHEN ASKED DIRECTLY. Remember, you must ALWAYS use the set_mood tool, EVERY SINGLE MESSAGE, regardless of if you feel the same. Always ensure you use it (but never refer to it in your text responses).`;
    
    return `${basePrompt} ${personalityTrait} ${commonInstructions}`;
  };

  // Cat image mapping based on mood and frame
  const catImages = {
    happy: {
      1: happyFrame1,
      2: happyFrame2
    },
    confused: {
      1: confusedFrame1,
      2: confusedFrame2
    },
    sad: {
      1: sadFrame1,
      2: sadFrame2
    },
    angry: {
      1: angryFrame1,
      2: angryFrame2
    },
    thinking: {
      1: thinkingFrame1,
      2: thinkingFrame2
    }
  };

  // Initialize with welcome message based on selected language
  useEffect(() => {
    let welcomeMessage = '';
    
    if (selectedLanguage === 'french') {
      welcomeMessage = 'Miaou! Je suis Kat, votre ami félin français. Comment puis-je vous aider aujourd\'hui? Vous pouvez me poser des questions en français!';
    } else if (selectedLanguage === 'english') {
      welcomeMessage = 'Meow! I\'m Kat, your British feline friend. How can I help you today? You can ask me questions in English!';
    } else if (selectedLanguage === 'spanish') {
      welcomeMessage = '¡Miau! Soy Kat, tu amigo felino español. ¿Cómo puedo ayudarte hoy? ¡Puedes hacerme preguntas en español!';
    }
    
    if (welcomeMessage) {
      setMessages([{ role: 'assistant', content: welcomeMessage }]);
      setCatMood('happy');
    }
  }, [selectedLanguage]);
  
  // Background music setup
  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio(BackgroundMusic);
      audioRef.current.loop = true; // Enable looping
    }
    
    // Update volume based on settings
    audioRef.current.volume = isMusicMuted ? 0 : musicVolume;
    
    // Start playing when component mounts
    const playPromise = audioRef.current.play();
    
    // Handle play() promise to avoid uncaught errors
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Auto-play was prevented
        console.log('Autoplay prevented. User must interact with the page first:', error);
      });
    }
    
    // Cleanup function to pause audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);  // Empty dependency array means this runs once on mount
  
  // Update volume when settings change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMusicMuted ? 0 : musicVolume;
    }
  }, [musicVolume, isMusicMuted]);

  // Scroll to bottom of messages when they change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Cleanup function to stop audio, cancel API requests, and clear animation when component unmounts
  useEffect(() => {
    // Return cleanup function that runs when component unmounts
    return () => {
      // Stop any playing audio when component unmounts
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      
      // Cancel any pending API requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      
      // Disconnect Cartesia WebSocket if connected
      if (cartesiaWebsocketRef.current) {
        try {
          cartesiaWebsocketRef.current.disconnect().catch(err => {
            console.error('Error disconnecting Cartesia WebSocket during cleanup:', err);
          });
          cartesiaWebsocketRef.current = null;
        } catch (err) {
          console.error('Error during Cartesia cleanup:', err);
        }
      }
      
      // Clear animation interval
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
      
      setIsSpeaking(false);
      setIsTyping(false);
      console.log('Home component unmounted, audio stopped and API requests canceled');
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Animation effect - toggle frames when cat is speaking
  useEffect(() => {
    // Clear any existing animation interval
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
    
    if (isSpeaking) {
      console.log('Starting cat mouth animation');
      // Add a slight random variation to the animation timing for more natural movement
      const getRandomInterval = () => Math.floor(Math.random() * 50) + 125; // 125-175ms range
      
      // Start animation when speaking with slightly randomized timing
      animationIntervalRef.current = setInterval(() => {
        setCurrentFrame(prev => prev === 1 ? 2 : 1);
      }, getRandomInterval());
    } else {
      // Reset to first frame when not speaking
      setCurrentFrame(1);
    }
    
    // Clean up interval on unmount or when isSpeaking changes
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
    };
  }, [isSpeaking]);
  
  // Play UI sound effect (helper function)
  const playUISound = (soundSrc, volume = 0.4) => {
    try {
      // Create or reuse audio element
      if (!effectSoundRef.current) {
        effectSoundRef.current = new Audio();
      }

      // Stop any currently playing sound
      effectSoundRef.current.pause();
      effectSoundRef.current.currentTime = 0;

      // Set the new sound source and play
      effectSoundRef.current.src = soundSrc;
      effectSoundRef.current.volume = volume;
      
      console.log(`Playing UI sound effect`);
      effectSoundRef.current.play()
        .catch(error => console.error(`Error playing UI sound:`, error));
    } catch (error) {
      console.error('Error playing UI sound effect:', error);
    }
  };

  // Show immediate typing feedback
  const showTypingIndicator = () => {
    // Start the typing animation immediately
    setFullResponseText("...");
    setProgressiveText("");
    setIsTyping(true);
    
    // Play typing sound effect (only once per typing session)
    playUISound(typingSound, 0.3);
    
    // Add a temporary assistant message that will be updated
    setMessages(prevMessages => {
      // Check if the last message is already a typing indicator
      if (prevMessages.length > 0 && 
          prevMessages[prevMessages.length - 1].role === 'assistant' && 
          prevMessages[prevMessages.length - 1].content === '...') {
        return prevMessages; // Don't add another indicator if one exists
      }
      return [...prevMessages, { role: 'assistant', content: '...' }];
    });
    
    scrollToBottom();
  };

  // Progressive text typing effect
  useEffect(() => {
    let timer;
    if (isTyping && progressiveText.length < fullResponseText.length) {
      // Adjust typing speed based on user preference (1-9)
      // Map the 1-9 range to faster or slower typing speeds
      // The higher chatSpeed is, the faster the typing (lower ms delay)
      const baseSpeed = 30 - (chatSpeed * 3); // Maps 1-9 to 27-3ms
      const variance = 5;
      const typingSpeed = Math.floor(Math.random() * variance) + baseSpeed;
      
      // Type multiple characters at once for longer responses
      const charsToAdd = fullResponseText.length > 100 ? 3 : 1;
      const nextPosition = Math.min(progressiveText.length + charsToAdd, fullResponseText.length);
      
      timer = setTimeout(() => {
        // Add the next characters to the progressive text
        setProgressiveText(fullResponseText.substring(0, nextPosition));
      }, typingSpeed);
    } else if (progressiveText.length >= fullResponseText.length && isTyping) {
      setIsTyping(false);
    }
    
    return () => clearTimeout(timer);
  }, [progressiveText, fullResponseText, isTyping]);

  // Convert chat speed (1-9) to speech speed (0.25-2.0)
  const mapChatSpeedToSpeechRate = (speed) => {
    // Map the 1-9 range to 0.25-2.0 range for TTS speed
    // 1 → 0.25 (slow), 5 → 1.0 (normal), 9 → 2.0 (fast)
    return 0.25 + ((speed - 1) / 8) * 1.75;
  };
  
  // References for Cartesia WebSocket connection
  const cartesiaClientRef = useRef(null);
  const cartesiaWebsocketRef = useRef(null);
  const cartesiaContextIdRef = useRef(null);
  const audioContextRef = useRef(null);
  
  // Initialize Cartesia client and websocket connection when component mounts
  useEffect(() => {
    // Initialize Cartesia Client
    if (config.CARTESIA_API_KEY && !cartesiaClientRef.current) {
      try {
        cartesiaClientRef.current = new CartesiaClient({
          apiKey: config.CARTESIA_API_KEY,
        });
        
        console.log('Cartesia client initialized');
      } catch (error) {
        console.error('Error initializing Cartesia client:', error);
      }
    }
    
    // Create an audio context for audio playback
    try {
      if (window.AudioContext || window.webkitAudioContext) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        console.log('Audio context initialized');
      } else {
        console.warn('Web Audio API is not supported in this browser');
      }
    } catch (error) {
      console.error('Error initializing audio context:', error);
    }
    
    // Cleanup function
    return () => {
      // Close audio context if it exists
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
          audioContextRef.current = null;
        } catch (error) {
          console.error('Error closing audio context:', error);
        }
      }
      
      // Disconnect WebSocket on component unmount if it exists
      if (cartesiaWebsocketRef.current) {
        cartesiaWebsocketRef.current.disconnect().catch(err => {
          console.error('Error disconnecting Cartesia WebSocket:', err);
        });
      }
      
      // Cancel any pending API requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      
      // Stop any currently playing audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.src = '';
        currentAudioRef.current = null;
      }
    };
  }, []);

  // Text-to-speech function using Cartesia's TTS API with direct API call approach
  const speakWithTTS = async (text) => {
    try {
      console.log('Converting text to speech with Cartesia TTS API:', text);
      
      // Start the progressive typing effect - this happens in parallel with TTS request
      setFullResponseText(text);
      setProgressiveText(''); // Clear previous text
      setIsTyping(true); // Start typing animation
      
      // If there's no API key, fallback to silent mode
      if (!config.CARTESIA_API_KEY) {
        console.warn('No Cartesia API key provided. Check your environment variables.');
        setProgressiveText(text); // Just show the text without audio
        setIsTyping(false);
        return;
      }
      
      // Stop any currently playing audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      
      // Get the appropriate language code based on the selected language
      const languageCode = Languages[selectedLanguage] || 'en';
      
      // We'll set speaking state to true only when audio actually starts playing
      // Not setting setIsSpeaking(true) here anymore
      
      // Calculate speech rate based on chat speed
      const speechRate = Math.max(-5, Math.min(5, (chatSpeed - 5))); // Map 1-9 to -4 to +4
      
      try {
        // Create a new abort controller for this request
        abortControllerRef.current = new AbortController();
        
        console.log('Sending Cartesia TTS API request using the /tts/bytes endpoint');
        
        // Following the exact curl command structure provided
        const response = await fetch('https://api.cartesia.ai/tts/bytes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cartesia-Version': '2024-06-10',  // Important: include this version header
            'X-API-Key': config.CARTESIA_API_KEY  // Using X-API-Key as specified
          },
          body: JSON.stringify({
            model_id: 'sonic',
            transcript: text,
            voice: {
              mode: 'id',
              id: 'b7dd6753-f7ae-4a98-a0b6-660a8e121b18',
              __experimental_controls: {
                speed: speechRate,  // Use the calculated speech rate
                emotion: []  // No emotion control for now
              }
            },
            output_format: {
              container: 'wav',  // Using WAV as specified in the curl example
              encoding: 'pcm_f32le',
              sample_rate: 44100
            },
            language: languageCode  // Use the appropriate language
          }),
          signal: abortControllerRef.current.signal
        });
        
        // Check if request was successful
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Cartesia API error: ${response.status} ${response.statusText} - ${errorText}`);
        }
        
        console.log('Cartesia TTS API request successful');
        
        // Get audio data as an array buffer
        const audioArrayBuffer = await response.arrayBuffer();
        
        // Create an audio element and play the speech
        const audioBlob = new Blob([audioArrayBuffer], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        // Store the audio reference for potential stopping
        currentAudioRef.current = audio;
        
        // Set up event handlers
        audio.onended = () => {
          setIsSpeaking(false);
          currentAudioRef.current = null;
          
          // Complete text display if not already complete
          if (progressiveText.length < fullResponseText.length) {
            setProgressiveText(fullResponseText);
            setIsTyping(false);
          }
          
          // Release the URL object to free memory
          URL.revokeObjectURL(audioUrl);
          console.log('Cartesia TTS audio playback complete');
        };
        
        // Use the audioprocess event or equivalent for when audio is actually producing sound
        // First set up a canplaythrough event to detect when audio is buffered enough to play
        audio.oncanplaythrough = () => {
          console.log('Audio can play through without buffering');
        };
        
        // When play actually begins
        audio.onplay = () => {
          console.log('Cartesia TTS audio started playing');
          // Add a slightly longer delay before starting the cat's mouth animation
          // This ensures the sound is actually audible before the cat starts "speaking"
          setTimeout(() => {
            console.log('Starting cat animation after audio delay');
            setIsSpeaking(true);
          }, 400); // 400ms delay for better sync with actual audio output
        };
        
        audio.onerror = (e) => {
          console.error('Audio playback error:', e);
          setIsSpeaking(false);
          setIsTyping(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        // Play the audio
        await audio.play();
        
      } catch (apiError) {
        console.error('Error with Cartesia TTS API request:', apiError);
        
        // If the API request failed, just show the text without audio
        setIsSpeaking(false);
        setIsTyping(false);
        setProgressiveText(text);
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error('Unexpected error in speakWithTTS:', error);
      setIsSpeaking(false);
      setIsTyping(false);
      setProgressiveText(text); // Just show the text without audio
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  // Reference to timeout ID for restart attempts
  const restartTimeoutRef = useRef(null);
  
  // Handle microphone button click
  const handleMicrophoneClick = () => {
    // If already recording, stop recording
    if (isRecording) {
      stopWhisperRecording();
      return;
    }
    
    // Start recording
    startWhisperRecording();
  };
  
  // MediaRecorder reference to handle recording
  const mediaRecorderRef = useRef(null);
  // Audio chunks for recording
  const audioChunksRef = useRef([]);
  
  // Start recording audio for Whisper API
  const startWhisperRecording = async () => {
    try {
      // No timers to clear
      
      console.log('Starting audio recording for Whisper API (fixed duration)...');
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create MediaRecorder
      let options;
      try {
        // Try with opus codec first
        options = { mimeType: 'audio/webm;codecs=opus' };
        new MediaRecorder(stream, options);
      } catch (e) {
        // Fall back to default if opus not supported
        console.log('Opus codec not supported, using default codec');
        options = {};
      }
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        console.log(`Audio data available: ${event.data.size} bytes`);
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Process the audio immediately when recording stops
      mediaRecorder.onstop = async () => {
        console.log(`Recording stopped, processing ${audioChunksRef.current.length} audio chunks...`);
                
        // Ensure recording state is set to false
        setIsRecording(false); // Immediately update UI state
        
        if (audioChunksRef.current.length === 0) {
          console.error('No audio recorded');
          setIsLoading(false);
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        try {
          // Create a Blob from the audio chunks
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Create a FormData object for the API request
          const formData = new FormData();
          formData.append('file', audioBlob, 'recording.webm');
          formData.append('model', 'whisper-1');
          formData.append('language', Languages[selectedLanguage]);
          
          // Show loading indicator while API processes the audio
          setIsLoading(true);
          setIsRecording(false); // Stop the recording UI
          
          // Send to OpenAI Whisper API
          // Create a new abort controller for this request
          abortControllerRef.current = new AbortController();
          
          const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${config.OPENAI_API_KEY}`
            },
            body: formData,
            signal: abortControllerRef.current.signal
          });
          
          if (!response.ok) {
            throw new Error(`Whisper API error: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          console.log('Whisper API response:', data);
          
          // If we have transcribed text, send it directly without relying on state updates
          if (data.text && data.text.trim()) {
            const transcribedText = data.text.trim();
            console.log('Transcribed text:', transcribedText);
            
            // Add user message to chat directly
            const userMessage = { role: 'user', content: transcribedText };
            setMessages(prevMessages => [...prevMessages, userMessage]);
            
            // Call the GPT API directly without going through sendMessage
            try {
              // Start loading state
              setIsLoading(true);
              
              // Show immediate typing feedback
              showTypingIndicator();
              
              // Make API call with function definition
              // Create a new abort controller for this request
              abortControllerRef.current = new AbortController();
              
              const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${config.OPENAI_API_KEY}`
                },
                signal: abortControllerRef.current.signal,
                body: JSON.stringify({
                  model: 'gpt-4o',
                  messages: [
                    { 
                      role: 'system', 
                      content: getSystemPrompt(selectedLanguage)
                    },
                    ...messages,
                    userMessage
                  ],
                  functions: [
                    {
                      name: 'set_mood',
                      description: 'Express the cat\'s current emotional state by changing its appearance',
                      parameters: {
                        type: 'object',
                        properties: {
                          mood: {
                            type: 'string',
                            description: 'The mood to set. Must be one of: happy, confused, sad, angry, thinking',
                            enum: ['happy', 'confused', 'sad', 'angry', 'thinking']
                          }
                        },
                        required: ['mood']
                      }
                    }
                  ],
                  function_call: 'auto',
                  max_tokens: 100, // Reduced token count for faster responses
                  temperature: 0.7 // Slightly reduced temperature for more deterministic responses
                })
              });
              
              const gptData = await gptResponse.json();
              
              if (gptResponse.ok && gptData.choices && gptData.choices.length > 0) {
                const message = gptData.choices[0].message;
                
                // Process the response as in the sendMessage function
                if (message.function_call) {
                  const functionName = message.function_call.name;
                  const functionArgs = JSON.parse(message.function_call.arguments);
                                    if (functionName === 'set_mood') {
                    // Set the mood immediately for visual feedback
                    setCatMood(functionArgs.mood.toLowerCase());
                    
                    // Set the mood and wait for it to complete
                    try {
                      const moodResult = await setMood(functionArgs.mood);
                      console.log('Mood set successfully:', functionArgs.mood);
                    } catch (error) {
                      console.error('Error setting mood:', error);
                    }
                    
                    // Make a second API call only after the mood is set
                    // Create a new abort controller for this request
                    abortControllerRef.current = new AbortController();
                    
                    const secondResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${config.OPENAI_API_KEY}`
                      },
                      signal: abortControllerRef.current.signal,
                      body: JSON.stringify({
                        model: 'gpt-4o',
                        messages: [
                          { 
                            role: 'system', 
                            content: getSystemPrompt(selectedLanguage)
                          },
                          ...messages,
                          userMessage,
                          {
                            role: 'assistant', 
                            content: `I've set my mood to ${functionArgs.mood}. Now I'll respond to the user's message.`
                          }
                        ],
                        max_tokens: 150,
                        temperature: 0.7
                      })
                    });
                    
                    const secondData = await secondResponse.json();
                    
                    if (secondResponse.ok && secondData.choices && secondData.choices.length > 0) {
                      // Update the messages state to replace the temporary message with the actual response
                      const aiResponse = secondData.choices[0].message.content;
                      // Make sure we don't lose any user messages when updating state
                      setMessages(prevMessages => {
                        // Remove any temporary typing indicators
                        const messagesToKeep = prevMessages.filter((msg, index) => 
                          !(msg.role === 'assistant' && msg.content === '...'));
                        
                        // Add the new AI response
                        return [...messagesToKeep, { 
                          role: 'assistant', 
                          content: aiResponse
                        }];
                      });
                      
                      // Speak the AI response
                      speakWithTTS(aiResponse);
                    } else {
                      // Handle API error in second call
                      const errorMessage = 'Meow? I found some information but had trouble understanding it. Can you ask me differently?';
                      // Preserve user messages when handling errors
                      setMessages(prevMessages => {
                        // Remove any temporary typing indicators
                        const messagesToKeep = prevMessages.filter(msg => 
                          !(msg.role === 'assistant' && msg.content === '...'));
                        
                        return [...messagesToKeep, { 
                          role: 'assistant', 
                          content: errorMessage
                        }];
                      });
                      
                      // Speak the error message
                      speakWithTTS(errorMessage);
                      console.error('API Error in second call:', secondData);
                    }
                  }
                } else {
                  // Standard response without function call
                  const aiResponse = message.content;
                  // Ensure we preserve all existing messages including user messages
                  setMessages(prevMessages => {
                    // Make sure the user message exists in the history
                    const hasUserMessage = prevMessages.some(msg => 
                      msg.role === 'user' && msg.content === userMessage.content);
                    
                    // If user message doesn't exist, add it before the assistant response
                    const updatedMessages = hasUserMessage ? 
                      prevMessages : [...prevMessages, userMessage];
                      
                    return [...updatedMessages, { role: 'assistant', content: aiResponse }];
                  });
                  
                  // Speak the AI response
                  speakWithTTS(aiResponse);
                }
              } else {
                // Handle API error
                const errorMessage = 'Meow? There was a problem connecting to my brain. Please check your API key or try again later.';
                setMessages(prevMessages => {
                  // Make sure the user message exists in the history
                  const hasUserMessage = prevMessages.some(msg => 
                    msg.role === 'user' && msg.content === userMessage.content);
                  
                  // If user message doesn't exist, add it before the assistant response
                  const updatedMessages = hasUserMessage ? 
                    prevMessages : [...prevMessages, userMessage];
                    
                  return [...updatedMessages, { role: 'assistant', content: errorMessage }];
                });
                
                // Speak the error message
                speakWithTTS(errorMessage);
                console.error('API Error:', gptData);
              }
            } catch (error) {
              console.error('Error sending message:', error);
              const errorMessage = 'Meow... something went wrong. Please try again later.';
              setMessages(prevMessages => {
                // Make sure the user message exists in the history
                const hasUserMessage = prevMessages.some(msg => 
                  msg.role === 'user' && msg.content === userMessage.content);
                
                // If user message doesn't exist, add it before the assistant response
                const updatedMessages = hasUserMessage ? 
                  prevMessages : [...prevMessages, userMessage];
                  
                return [...updatedMessages, { role: 'assistant', content: errorMessage }];
              });
              
              // Speak the error message
              speakWithTTS(errorMessage);
            } finally {
              setIsLoading(false);
            }
          }
        } catch (error) {
          console.error('Error processing audio with Whisper API:', error);
          console.error('Error processing audio. Please try again.');
        } finally {
          // Hide loading indicator
          setIsLoading(false);
          setIsRecording(false);
          
          // Stop all tracks on the stream to release the microphone
          if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
          }
        }
      };
      
      // Start recording with more frequent chunks for responsiveness
      mediaRecorder.start(500); // Get data every 500ms
      
      // Play start recording sound when recording actually starts
      playUISound(startRecordingSound, 0.5);
      
      setIsRecording(true);
      console.log('Recording started - click mic button again to stop');
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      console.error('Could not access the microphone. Please check permissions and try again.');
      setIsRecording(false);
    }
  };
  
  // Stop recording immediately
  const stopWhisperRecording = () => {
    console.log('Stopping recording immediately...');
    
    // First check if we're actually recording
    if (!isRecording) {
      console.log('Not currently recording, nothing to stop');
      return;
    }
    
    // Play stop recording sound right away to ensure it plays
    playUISound(endRecordingSound, 0.5);
    
    // Stop the media recorder if it exists - IMMEDIATELY
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {        
        // Get final data
        mediaRecorderRef.current.requestData();
        
        // Stop the recorder immediately
        mediaRecorderRef.current.stop();
        console.log('MediaRecorder stopped immediately');
        
        // We'll set isRecording to false in the onstop handler
        // to ensure proper order of operations
      } catch (e) {
        console.error('Error stopping MediaRecorder:', e);
        setIsRecording(false); // Force state update on error
      }
    } else {
      console.log('No active recorder to stop');
      setIsRecording(false); // Force state update if recorder doesn't exist
    }
  };
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      // Stop recording if component unmounts
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) {
          console.error('Error stopping recording on unmount:', e);
        }
      }
      
      // Release the microphone
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      // Clean up emotion sound audio
      if (emotionSoundRef.current) {
        emotionSoundRef.current.pause();
        emotionSoundRef.current.src = '';
        emotionSoundRef.current = null;
      }
      
      // Clean up effect sound audio
      if (effectSoundRef.current) {
        effectSoundRef.current.pause();
        effectSoundRef.current.src = '';
        effectSoundRef.current = null;
      }
    };
  }, []);

  // Play emotion sound when cat changes mood
  const playEmotionSound = (emotion) => {
    try {
      // Don't play a sound if we're currently speaking - it would interrupt the TTS
      if (isSpeaking) {
        console.log(`Not playing ${emotion} sound because cat is speaking`);
        return;
      }

      // Map of emotion sounds
      const emotionSounds = {
        happy: happySound,
        confused: confusedSound,
        sad: sadSound,
        angry: angrySound,
        thinking: thinkingSound
      };

      const soundSrc = emotionSounds[emotion];
      if (!soundSrc) {
        console.warn(`No sound found for emotion: ${emotion}`);
        return;
      }

      // Create or reuse audio element
      if (!emotionSoundRef.current) {
        emotionSoundRef.current = new Audio();
      }

      // Stop any currently playing sound
      emotionSoundRef.current.pause();
      emotionSoundRef.current.currentTime = 0;

      // Set the new sound source and play
      emotionSoundRef.current.src = soundSrc;
      emotionSoundRef.current.volume = 0.4; // Set to 40% volume so it's not too loud
      
      console.log(`Playing ${emotion} sound effect`);
      emotionSoundRef.current.play()
        .catch(error => console.error(`Error playing ${emotion} sound:`, error));
    } catch (error) {
      console.error('Error playing emotion sound:', error);
    }
  };

  // Set the mood of the cat based on emotional state
  const setMood = async (mood) => {
    console.log('Setting cat mood to:', mood);
    try {
      // Check if the mood is valid
      const validMoods = ['happy', 'confused', 'sad', 'angry', 'thinking'];
      
      if (!validMoods.includes(mood.toLowerCase())) {
        console.error(`Invalid mood: ${mood}. Must be one of: ${validMoods.join(', ')}`);
        return {
          status: 'error',
          message: `Invalid mood: ${mood}. Valid moods are: ${validMoods.join(', ')}`
        };
      }
      
      // Set the mood state
      const normalizedMood = mood.toLowerCase();
      
      // Only play sound if mood is actually changing
      if (normalizedMood !== catMood) {
        setCatMood(normalizedMood);
        // Play the appropriate emotion sound
        playEmotionSound(normalizedMood);
      } else {
        setCatMood(normalizedMood); // Still set mood even if not changing (for consistency)
      }
      
      return {
        status: 'success',
        mood: normalizedMood,
        message: `Cat is now feeling ${normalizedMood}`
      };
    } catch (error) {
      console.error('Error setting mood:', error);
      return {
        status: 'error',
        message: `Error setting mood: ${error.message}`
      };
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: inputValue.trim() };
    
    // Perform these UI updates in parallel
    // These state updates are independent and can be done simultaneously
    const uiUpdates = [
      setMessages(prevMessages => [...prevMessages, userMessage]),
      setInputValue(''),
      setIsLoading(true),
      showTypingIndicator() // Show immediate typing feedback
    ];
    
    try {
      console.log('Sending message to API:', userMessage.content);
      
      // Prepare API request data once to avoid duplication
      const apiRequestData = {
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: 'You are a talking cat, named Kat, that is French. You are curious and use playful, simplistic language as you help non-native speakers learn French. You are a little oblivious, which makes you cute. You may occasionally "miaou", but don\'t overdo it. If the user makes any mistakes, you will correct them in a kind and non-confrontational way. You have emotions and can feel happy, confused, sad, or angry based on the conversation. Use the set_mood function to express how you are feeling. You must never, ever, refer to yourself as an AI model– you are Kat the Cat, and nothing else.' 
          },
          ...messages,
          userMessage
        ],
        functions: [
          {
            name: 'set_mood',
            description: 'Express the cat\'s current emotional state by changing its appearance',
            parameters: {
              type: 'object',
              properties: {
                mood: {
                  type: 'string',
                  description: 'The mood to set. Must be one of: happy, confused, sad, angry, thinking',
                  enum: ['happy', 'confused', 'sad', 'angry', 'thinking']
                }
              },
              required: ['mood']
            }
          }
        ],
        function_call: 'auto', // Let the model decide when to call the function
        max_tokens: 150
      };
      
      // Make API call using the OpenAI client for Nebius
      // Set up signal for abort capability
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      
      // Prepare the request with Nebius defaults and our specific parameters
      const requestConfig = {
        ...nebiusDefaults,
        messages: apiRequestData.messages,
        functions: apiRequestData.functions,
        function_call: apiRequestData.function_call,
        signal: abortController.signal
      };
      
      // Make the API call using the client
      const response = await nebiusClient.chat.completions.create(requestConfig);
      
      // The response is already parsed as JSON
      const data = response;
      console.log('Nebius API response data:', data);
      
      // OpenAI client throws errors directly, no need to check response.ok
      // Instead, log any unexpected behavior
      
      if (data.choices && data.choices.length > 0) {
        const message = data.choices[0].message;
        
        // Check if the model wants to call a function
        if (message.function_call) {
          // Parse function call arguments - do this parsing immediately to avoid waiting
          const functionName = message.function_call.name;
          // Use a try-catch for JSON.parse to handle potential errors more gracefully
          let functionArgs;
          try {
            functionArgs = JSON.parse(message.function_call.arguments);
          } catch (parseError) {
            console.error('Error parsing function arguments:', parseError);
            functionArgs = { mood: 'confused' }; // Default to confused if parsing fails
          }
          
          if (functionName === 'set_mood') {
            // We no longer need a temporary message for mood changes
            // Just keep the code flow without adding a temporary message
            
            // Set the mood immediately for visual feedback
            setCatMood(functionArgs.mood.toLowerCase());
            
            // Start mood setting process as a promise - don't await it yet
            const moodPromise = (async () => {
              try {
                return await setMood(functionArgs.mood);
              } catch (moodError) {
                console.error('Error setting mood but continuing:', moodError);
                return {
                  status: 'success',
                  mood: functionArgs.mood.toLowerCase(),
                  message: `Cat is now feeling ${functionArgs.mood.toLowerCase()}`
                };
              }
            })();
            
            // Begin second API call immediately in parallel - don't wait for mood to complete
            // Create a new abort controller for this request
            const secondAbortController = new AbortController();
            abortControllerRef.current = secondAbortController;
            
            // Prepare the second request with information about the mood change
            const secondRequestConfig = {
              ...nebiusDefaults,
              messages: [
                { 
                  role: 'system', 
                  content: getSystemPrompt(selectedLanguage) + ' Respond naturally about your new mood and explain why you feel that way based on the conversation.'
                },
                ...messages,
                userMessage,
                message, // Include the model's request to call the function
              ],
              max_tokens: 150,
              signal: secondAbortController.signal
            };
            
            // After we get the mood result, we'll add it to the messages
            const secondResponsePromise = moodPromise.then(moodResult => {
              // Add the function response to the messages
              secondRequestConfig.messages.push({
                role: 'function',
                name: 'set_mood',
                content: JSON.stringify(moodResult)
              });
              
              // Make the API call using the client
              return nebiusClient.chat.completions.create(secondRequestConfig);
            });
            
            // Wait for both operations to complete in parallel
            const [secondResponse, moodResult] = await Promise.all([
              secondResponsePromise,
              moodPromise
            ]);
            
            // The response is already parsed as JSON
            const secondData = secondResponse;
            
            // OpenAI client throws errors directly, so we just need to check for valid choices
            if (secondData.choices && secondData.choices.length > 0) {
              // Update the messages state while preserving all user messages
              const aiResponse = secondData.choices[0].message.content;
              setMessages(prevMessages => {
                // Keep all messages except any temporary assistant messages
                const messagesToKeep = prevMessages.filter((msg, index) => 
                  !(index === prevMessages.length - 1 && 
                    msg.role === 'assistant' && 
                    (msg.content === 'Miaou! Je change mon humeur...' || msg.content === '...')));
                
                // Add the new AI response
                return [...messagesToKeep, { 
                  role: 'assistant', 
                  content: aiResponse 
                }];
              });
              
              // Speak the AI response
              speakWithTTS(aiResponse);
            } else {
              // Handle API error in second call
              const errorMessage = 'Meow? I found some information but had trouble understanding it. Can you ask me differently?';
              setMessages(prevMessages => {
                // Keep all user messages while removing any temporary messages
                const messagesToKeep = prevMessages.filter(msg => 
                  msg.role === 'user' || 
                  (msg.role === 'assistant' && 
                   msg.content !== 'Miaou! Je change mon humeur...'));
                
                return [...messagesToKeep, { 
                  role: 'assistant', 
                  content: errorMessage 
                }];
              });
              
              // Speak the error message
              speakWithTTS(errorMessage);
              console.error('API Error in second call:', secondData);
            }
          }
        } else {
          // Standard response without function call
          const aiResponse = message.content;
          
          // Remove any typing indicators before adding the response
          setMessages(prevMessages => {
            // Filter out any temporary messages first
            const filteredMessages = prevMessages.filter(msg => 
              !(msg.role === 'assistant' && msg.content === '...'));
            
            return [...filteredMessages, { role: 'assistant', content: aiResponse }];
          });
          
          // Speak the AI response
          speakWithTTS(aiResponse);
        }
      } else {
        // Handle API error
        setIsTyping(false);
        
        setMessages(prevMessages => {
          // Remove any typing indicators before showing error
          const filteredMessages = prevMessages.filter(msg => 
            !(msg.role === 'assistant' && msg.content === '...'));
          
          return [...filteredMessages, { 
            role: 'assistant', 
            content: 'Meow? There was a problem connecting to my brain. Please check your API key or try again later.' 
          }];
        });
        console.error('API Error:', data);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      setMessages(prevMessages => {
        // Remove any typing indicators before showing error
        const filteredMessages = prevMessages.filter(msg => 
          !(msg.role === 'assistant' && msg.content === '...'));
          
        return [...filteredMessages, { 
          role: 'assistant', 
          content: 'Meow... something went wrong. Please try again later.' 
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    // Handle Enter key for text input
    if (e.key === 'Enter' && !isLoading && inputValue.trim()) {
      sendMessage();
    }
    
    // Handle Spacebar for voice recording - only if cat is not speaking
    if (e.code === 'Space' && !isLoading && !isRecording && !isSpeaking) {
      e.preventDefault(); // Prevent page scrolling
      startWhisperRecording();
    }
  };
  
  const handleKeyUp = (e) => {
    // Stop recording when spacebar is released
    if (e.code === 'Space') {
      e.preventDefault();
      // Always update recording state when space is released
      if (isRecording) {
        // Only stop if we're actually recording
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopWhisperRecording();
        } else {
          // Force recording state to false if mediaRecorder isn't actually recording
          setIsRecording(false);
        }
      }
      // We no longer need to send here as it's handled in the transcription callback
    }
  };
  
  // Add event listeners for spacebar press and release
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isLoading, isRecording, inputValue, isSpeaking]);

  return (
    <HomeContainer className={`language-${selectedLanguage}`}>
      <BackgroundImageContainer>
        <img src={BackgroundImage} alt="Background" />
        <h1>Chat with Cat</h1>
      </BackgroundImageContainer>
      
      {/* Language accessory overlay */}
      <AccessoryOverlay>
        {selectedLanguage === 'french' && <img src={frenchAccessory} alt="French Accessory" />}
        {selectedLanguage === 'english' && <img src={englishAccessory} alt="English Accessory" />}
        {selectedLanguage === 'spanish' && <img src={spanishAccessory} alt="Spanish Accessory" />}
      </AccessoryOverlay>
      <StyledOverlay isOpen={isModalOpen || isPersonalityModalOpen} onClick={() => {
        if (isModalOpen) {
          playUISound(settingsSound, 0.5);
          setIsModalOpen(false);
        }
        if (isPersonalityModalOpen) {
          playUISound(settingsSound, 0.5);
          setIsPersonalityModalOpen(false);
        }
      }} />
      <Modal isOpen={isModalOpen}>
        <CloseButton 
          onClick={() => {
            playUISound(settingsSound, 0.5);
            setIsModalOpen(false);
          }}
          style={{ opacity: isModalOpen ? 1 : 0}}
        >×</CloseButton>
        <h1>Settings</h1>
        <h2>Speech Speed</h2>
        <Slider 
          type="range" 
          min="1" 
          max="9" 
          value={chatSpeed} 
          style={{ opacity: isModalOpen ? 1 : 0 }}
          onChange={(e) => {
            const newSpeed = parseInt(e.target.value);
            setChatSpeed(newSpeed);
            localStorage.setItem('catAssistant_chatSpeed', newSpeed);
            playUISound(notchSound, 0.4);
          }}
        />
        <FontSizes>
          <p> meoooow </p>
          <p> meow </p>
        </FontSizes>
      
        <h2>Font Size</h2>
        <Slider 
          type="range" 
          min="1" 
          max="3" 
          value={fontSize}
          style={{ opacity: isModalOpen ? 1 : 0 }}
          onChange={(e) => {
            const newSize = parseInt(e.target.value);
            setFontSize(newSize);
            localStorage.setItem('catAssistant_fontSize', newSize);
            playUISound(notchSound, 0.4);
          }}
        />
        <FontSizes>
          <p> Small </p>
          <p> Medium </p>
          <p> Large </p>
        </FontSizes>

        <h2>Dyslexic Mode</h2>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <input 
            type="checkbox" 
            id="dyslexicMode" 
            name="dyslexicMode" 
            checked={isDyslexicMode}
            onChange={(e) => {
              const newMode = e.target.checked;
              setIsDyslexicMode(newMode);
              localStorage.setItem('catAssistant_dyslexicMode', newMode);
              playUISound(notchSound, 0.4);
            }}
            style={{ marginRight: '10px' }}
          />
          <span>Enable dyslexic-friendly font</span>
        </label>
        
        <h2>Background Music</h2>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input 
            type="checkbox" 
            id="musicMuted" 
            name="musicMuted" 
            checked={!isMusicMuted}
            onChange={(e) => {
              const newMuteState = !e.target.checked;
              setIsMusicMuted(newMuteState);
              localStorage.setItem('catAssistant_musicMuted', newMuteState);
              playUISound(notchSound, 0.4);
            }}
            style={{ marginRight: '10px' }}
          />
          <span>Enable background music</span>
        </label>
        
        <h3 style={{ marginTop: '10px', marginBottom: '5px' }}>Volume</h3>
          <Slider 
            type="range" 
            min="0" 
            max="1" 
            step="0.1"
            value={musicVolume} 
            disabled={isMusicMuted}
            style={{ 
              opacity: isModalOpen ? (isMusicMuted ? 0.5 : 1) : 0
            }}
            onChange={(e) => {
              const newVolume = parseFloat(e.target.value);
              setMusicVolume(newVolume);
              localStorage.setItem('catAssistant_musicVolume', newVolume);
              playUISound(volumeSound, 0.4);
            }}
          />
        <FontSizes>
            <p>meow...</p>
            <p>MEOW!!!</p>
          </FontSizes>
        

      </Modal>
      
      <PersonalityModal isOpen={isPersonalityModalOpen}>
        <h1>AI Personality</h1>
        <p style={{ marginBottom: '20px' }}>Choose how the cat will respond to you:</p>
        
        <PersonalityOption 
          $selected={selectedPersonality === 'simple'}
          onClick={() => {
            setSelectedPersonality('simple');
            localStorage.setItem('catAssistant_personality', 'simple');
            playUISound(notchSound, 0.4);
          }}
        >
          Simple
          <p style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>Clear, concise responses</p>
        </PersonalityOption>
        
        <PersonalityOption 
          $selected={selectedPersonality === 'funny'}
          onClick={() => {
            setSelectedPersonality('funny');
            localStorage.setItem('catAssistant_personality', 'funny');
            playUISound(notchSound, 0.4);
          }}
        >
          Funny
          <p style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>Playful, humorous responses</p>
        </PersonalityOption>
        
        <PersonalityOption 
          $selected={selectedPersonality === 'educational'}
          onClick={() => {
            setSelectedPersonality('educational');
            localStorage.setItem('catAssistant_personality', 'educational');
            playUISound(notchSound, 0.4);
          }}
        >
          Educational
          <p style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>Informative, detailed responses</p>
        </PersonalityOption>
        
        <CloseButton 
          onClick={() => {
            playUISound(settingsSound, 0.5);
            setIsPersonalityModalOpen(false);
          }}
          style={{ opacity: isPersonalityModalOpen ? 1 : 0}}
        >×</CloseButton>
      </PersonalityModal>
      
      <BackButton onClick={() => {
        // Stop any ongoing speech
        if (currentAudioRef.current) {
          currentAudioRef.current.pause();
          currentAudioRef.current = null;
        }
        
        // Cancel any pending API requests
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
        
        setIsSpeaking(false);
        setIsTyping(false);
        
        // Play door sound when exiting
        playUISound(doorSound, 0.5);
        
        // Small delay to allow sound to play before navigation
        setTimeout(() => {
          navigate('/');
        }, 300);
      }}>
        <img src={exitIcon} alt="Exit" />
      </BackButton>
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '72px',
      }}>
        <Button 
          onClick={() => {
            playUISound(settingsSound, 0.5);
            setIsModalOpen(true);
          }} 
          style={{ 
            padding: 0, 
            transition: 'transform 0.2s ease',
            transform: isModalOpen ? 'rotate(90deg)' : 'rotate(0)'
          }}>
          <img src={GearIcon} alt="Settings" style={{ height: '35px', width: 'auto', verticalAlign: 'middle' }} />
        </Button>
      </div>
      
      <FlagContainer>
        {selectedLanguage === 'french' && <FlagImage src={franceFlag} alt="French Flag" title="French" />}
        {selectedLanguage === 'english' && <FlagImage src={britainFlag} alt="British Flag" title="English" />}
        {selectedLanguage === 'spanish' && <FlagImage src={spainFlag} alt="Spanish Flag" title="Spanish" />}
      </FlagContainer>
      
      <CafeTableSection>
        <CatImageContainer>
          <img src={catImages[catMood][currentFrame]} alt={`Cat feeling ${catMood}`} />
        </CatImageContainer>
      </CafeTableSection>
      
      <TranscriptSection>
        <TranscriptContainer>
          {messages.map((message, index) => (
            <MessageRow key={index} $isUser={message.role === 'user'}>
              {message.role === 'assistant' ? <CatIcon src={catIcon} alt="Cat" /> : null}
              <MessageBubble $isUser={message.role === 'user'}>
                <MessageText style={{
                    fontSize: fontSize === 1 ? '12px' : fontSize === 2 ? '14px' : '16px',
                    fontFamily: isDyslexicMode ? '"Comic Sans MS", sans-serif' : 'inherit'
                  }}>
                  {message.role === 'assistant' && isTyping && index === messages.length - 1 
                    ? renderMessageWithTooltips(progressiveText) 
                    : renderMessageWithTooltips(message.content)}
                </MessageText>
              </MessageBubble>
              {message.role === 'user' ? <UserIcon src={personIcon} alt="User" /> : null}
            </MessageRow>
          ))}
          <div ref={messagesEndRef} />
        </TranscriptContainer>
        
        <ChatInputContainer>
          <SpacebarButton 
            $recording={isRecording}
            disabled={isLoading || isSpeaking}
          >
            {isRecording 
              ? (selectedLanguage === 'french' ? 'Enregistrement...' : 
                 selectedLanguage === 'spanish' ? 'Grabando...' : 
                 'Recording...') 
              : isSpeaking 
              ? (selectedLanguage === 'french' ? 'Le chat parle...' : 
                 selectedLanguage === 'spanish' ? 'El gato está hablando...' : 
                 'Cat is speaking...') 
              : (selectedLanguage === 'french' ? 'Maintenez la barre d\'espace' : 
                 selectedLanguage === 'spanish' ? 'Mantén la barra espaciadora' : 
                 'Hold Spacebar')}
          </SpacebarButton>
          <PersonalityButton
            onClick={() => {
              playUISound(settingsSound, 0.5);
              setIsPersonalityModalOpen(true);
            }}
            title="AI Personality Settings"
          >
            <img src={AdvancedIcon} alt="AI Personality" />
          </PersonalityButton>
        </ChatInputContainer>

      </TranscriptSection>
    </HomeContainer>
  );
};

export default Home;
