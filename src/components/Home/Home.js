import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import config from '../../config';
import catHappyImage from '../cat_happy.png';
import catConfusedImage from '../cat_confused.png';
import catSadImage from '../cat_sad.png';
import catAngryImage from '../cat_angry.png';
import catThinkingImage from '../cat_thinking.png';
import catIcon from '../caticon.png';
import personIcon from '../personicon.png';
import exitIcon from '../exiticon.png';

// Using CSS custom properties from index.css instead of a local theme object

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
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;
  height: 100%;
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
    bottom: 0;
    left: 0;
  }
`;

const BackButton = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
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
  margin-top: -3px;
`;

// User icon component
const UserIcon = styled.img`
  width: 45px;
  object-fit: contain; /* Maintain aspect ratio */
  overflow: visible; /* Make sure nothing gets cut off */
  border-radius: 0; /* Remove circular clipping */
  margin-bottom: -3px;
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

const ChatInputContainer = styled.div`
  display: flex;
  margin-top: 10px;
  width: 100%;
  padding: 10px 0;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 2px solid var(--color-primary);
  border-radius: 5px;
  font-size: 14px;
  font-family: 'Lexend', sans-serif;
  outline: none;
  background-color: transparent;
  color: var(--color-primary);
  margin-right: 10px;

  &:focus {
    border-color: var(--color-primary);
    box-shadow: none;
  }
  
  &::placeholder {
    color: var(--color-primary);
    opacity: 0.7;
    font-family: 'Lexend', sans-serif;
  }
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

const MicButton = styled.button`
  background-color: ${props => props.$recording ? 'var(--color-recording)' : 'var(--color-primary)'} !important;
  color: var(--color-text-light);
  border: none;
  border-radius: 5px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 10px;

  &:disabled {
    background-color: var(--color-disabled);
    cursor: not-allowed;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;







// No longer using a separate loading indicator component


const Home = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [catMood, setCatMood] = useState('happy'); // Default mood is happy
  const messagesEndRef = useRef(null);
  
  // Cat image mapping based on mood
  const catImages = {
    happy: catHappyImage,
    confused: catConfusedImage,
    sad: catSadImage,
    angry: catAngryImage,
    thinking: catThinkingImage
  };

  // Add a welcome message from the cat on component mount
  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: 'Miaou! Comment ça va? Je m\'appelle Kat!'
    }]);
  }, []);

  // Scroll to bottom of messages when they change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
          formData.append('language', 'fr');
          
          // Show loading indicator while API processes the audio
          setIsLoading(true);
          setIsRecording(false); // Stop the recording UI
          
          // Send to OpenAI Whisper API
          const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${config.OPENAI_API_KEY}`
            },
            body: formData
          });
          
          if (!response.ok) {
            throw new Error(`Whisper API error: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          console.log('Whisper API response:', data);
          
          // Set the transcribed text to the input
          if (data.text) {
            setInputValue(data.text);
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
    
    // Stop the media recorder if it exists - IMMEDIATELY
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        // Get final data and stop without any delay
        mediaRecorderRef.current.requestData();
        
        // Set recording state to false immediately to update UI
        setIsRecording(false);
        
        // Give a small delay to capture the final data chunk
        setTimeout(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            console.log('MediaRecorder stopped immediately');
          }
        }, 100);
      } catch (e) {
        console.error('Error stopping MediaRecorder:', e);
        setIsRecording(false);
      }
    } else {
      console.log('No active recorder to stop');
      setIsRecording(false);
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
    };
  }, []);

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
      setCatMood(normalizedMood);
      
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
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // First API call with function definition
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { 
              role: 'system', 
              content: 'You are a talking cat, named Kat, that is French. You are curious and use playful, simplistic language as you help non-native speakers learn French. You are a little oblivious, which makes you cute. You may occasionally "miaou", but don\'t overdo it. If the user makes any mistakes, you will correct them in a kind and non-confrontational way. You have emotions and can feel happy, confused, sad, or angry based on the conversation. Use the set_mood function to express how you are feeling.' 
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
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.choices && data.choices.length > 0) {
        const message = data.choices[0].message;
        
        // Check if the model wants to call a function
        if (message.function_call) {
          const functionName = message.function_call.name;
          const functionArgs = JSON.parse(message.function_call.arguments);
          
          if (functionName === 'set_mood') {
            // Show a temporary message indicating mood is changing
            setMessages(prevMessages => [
              ...prevMessages,
              { role: 'assistant', content: 'Miaou! Je change mon humeur...' }
            ]);
            
            // Set the new mood
            const moodResult = await setMood(functionArgs.mood);
            
            // Second API call with the mood change results
            const secondResponse = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.OPENAI_API_KEY}`
              },
              body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                  { 
                    role: 'system', 
                    content: 'You are a talking cat, named Kat, that is French. You are curious and use playful, simplistic language as you help non-native speakers learn French. You are a little oblivious, which makes you cute. You may occasionally "miaou", but don\'t overdo it. If the user makes any mistakes, you will correct them in a kind and non-confrontational way. Respond naturally about your new mood and explain why you feel that way based on the conversation.' 
                  },
                  ...messages,
                  userMessage,
                  message, // Include the model's request to call the function
                  {
                    role: 'function',
                    name: 'set_mood',
                    content: JSON.stringify(moodResult)
                  }
                ],
                max_tokens: 150
              })
            });
            
            const secondData = await secondResponse.json();
            
            if (secondResponse.ok && secondData.choices && secondData.choices.length > 0) {
              // Update the messages state to replace the temporary message with the actual response
              setMessages(prevMessages => {
                // Remove the last message (which is the temporary search indicator)
                const updatedMessages = prevMessages.slice(0, -1);
                // Add the actual response
                return [...updatedMessages, { 
                  role: 'assistant', 
                  content: secondData.choices[0].message.content 
                }];
              });
            } else {
              // Handle API error in second call
              setMessages(prevMessages => {
                // Remove the temporary search message
                const updatedMessages = prevMessages.slice(0, -1);
                return [...updatedMessages, { 
                  role: 'assistant', 
                  content: 'Meow? I found some information but had trouble understanding it. Can you ask me differently?' 
                }];
              });
              console.error('API Error in second call:', secondData);
            }
          }
        } else {
          // Standard response without function call
          setMessages(prevMessages => [
            ...prevMessages, 
            { role: 'assistant', content: message.content }
          ]);
        }
      } else {
        // Handle API error
        setMessages(prevMessages => [
          ...prevMessages, 
          { role: 'assistant', content: 'Meow? There was a problem connecting to my brain. Please check your API key or try again later.' }
        ]);
        console.error('API Error:', data);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: 'Meow... something went wrong. Please try again later.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  };

  return (
    <HomeContainer>
      <BackButton>
        <img src={exitIcon} alt="Exit" />
      </BackButton>
      
      <CafeTableSection>
        <CatImageContainer>
          <img src={catImages[catMood]} alt={`Cat feeling ${catMood}`} />
        </CatImageContainer>
      </CafeTableSection>
      
      <TranscriptSection>
        <TranscriptContainer>
          {messages.map((message, index) => (
            <MessageRow key={index} $isUser={message.role === 'user'}>
              {message.role === 'assistant' ? <CatIcon src={catIcon} alt="Cat" /> : null}
              <MessageBubble $isUser={message.role === 'user'}>
                <MessageText>{message.content}</MessageText>
              </MessageBubble>
              {message.role === 'user' ? <UserIcon src={personIcon} alt="User" /> : null}
            </MessageRow>
          ))}
          <div ref={messagesEndRef} />
        </TranscriptContainer>
        
        <ChatInputContainer>
          <ChatInput 
            type="text" 
            value={inputValue} 
            onChange={handleInputChange} 
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <MicButton 
            onClick={handleMicrophoneClick} 
            $recording={isRecording}
            title={isRecording ? 'Stop recording' : 'Start voice recording'}
            type="button"
            disabled={isLoading}
          >
            {isRecording ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity={isLoading ? "0.5" : "1"}>
                <path d="M12 2c-1.7 0-3 1.3-3 3v7c0 1.7 1.3 3 3 3s3-1.3 3-3V5c0-1.7-1.3-3-3-3zm-7 9c0 3.9 3.1 7 7 7s7-3.1 7-7M12 18v4" />
              </svg>
            )}
          </MicButton>
          <SendButton onClick={sendMessage} disabled={isLoading || !inputValue.trim()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity={isLoading ? "0.5" : "1"}>
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
            </svg>
          </SendButton>
        </ChatInputContainer>
        

      </TranscriptSection>
    </HomeContainer>
  );
};

export default Home;
