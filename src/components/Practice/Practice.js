import React, { useState } from 'react';
import styled from 'styled-components';

const PracticeContainer = styled.div`
  text-align: center;
`;

const DrawingArea = styled.div`
  background-color: #fff;
  padding: 20px;
  border: 3px solid #000;
  border-radius: 15px;
  margin: 30px 0;
  min-height: 400px;
  box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
`;

const Canvas = styled.canvas`
  border: 2px dashed #6f4e37;
  border-radius: 10px;
  margin: 10px auto;
  cursor: crosshair;
  touch-action: none;
`;

const ToolsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
  flex-wrap: wrap;
`;

const ColorPicker = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
`;

const ColorOption = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #000;
  background-color: ${props => props.color};
  cursor: pointer;
  transition: transform 0.2s;
  
  ${props => props.selected && `
    transform: scale(1.2);
    box-shadow: 0 0 0 2px #000;
  `}
  
  &:hover {
    transform: scale(1.1);
  }
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#6f4e37' : '#fff'};
  color: ${props => props.primary ? '#fff' : '#6f4e37'};
  border: 2px solid #000;
  padding: 10px 15px;
  border-radius: 25px;
  font-size: 0.9rem;
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

const WordPrompt = styled.div`
  background-color: #f8f8f8;
  padding: 15px;
  border: 2px solid #000;
  border-radius: 10px;
  margin: 10px auto 20px;
  max-width: 400px;
  font-size: 1.5rem;
  font-weight: bold;
`;

const colors = [
  { id: 'black', value: '#000000' },
  { id: 'red', value: '#FF0000' },
  { id: 'green', value: '#00FF00' },
  { id: 'blue', value: '#0000FF' },
  { id: 'yellow', value: '#FFFF00' },
];

const words = [
  { word: 'coffee', language: 'English' },
  { word: 'café', language: 'Spanish' },
  { word: 'café', language: 'French' },
  { word: 'caffè', language: 'Italian' },
  { word: 'book', language: 'English' },
  { word: 'libro', language: 'Spanish' },
  { word: 'livre', language: 'French' },
  { word: 'libro', language: 'Italian' },
];

const Practice = () => {
  const [selectedColor, setSelectedColor] = useState('black');
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasContext, setCanvasContext] = useState(null);
  const [currentWord, setCurrentWord] = useState(words[0]);
  
  const canvasRef = React.useRef(null);
  
  React.useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas size
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Set initial canvas properties
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = colors.find(c => c.id === selectedColor)?.value || '#000000';
      ctx.lineWidth = brushSize;
      
      setCanvasContext(ctx);
      
      // Clear canvas
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);
  
  React.useEffect(() => {
    if (canvasContext) {
      canvasContext.strokeStyle = colors.find(c => c.id === selectedColor)?.value || '#000000';
      canvasContext.lineWidth = brushSize;
    }
  }, [selectedColor, brushSize, canvasContext]);
  
  const startDrawing = (event) => {
    if (canvasContext) {
      const canvas = canvasRef.current;
      setIsDrawing(true);
      
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      canvasContext.beginPath();
      canvasContext.moveTo(x, y);
    }
  };
  
  const draw = (event) => {
    if (!isDrawing || !canvasContext) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    canvasContext.lineTo(x, y);
    canvasContext.stroke();
  };
  
  const stopDrawing = () => {
    if (canvasContext) {
      setIsDrawing(false);
      canvasContext.closePath();
    }
  };
  
  const clearCanvas = () => {
    if (canvasContext && canvasRef.current) {
      const canvas = canvasRef.current;
      canvasContext.fillStyle = '#FFFFFF';
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    }
  };
  
  const getNextWord = () => {
    const currentIndex = words.findIndex(w => 
      w.word === currentWord.word && w.language === currentWord.language
    );
    const nextIndex = (currentIndex + 1) % words.length;
    setCurrentWord(words[nextIndex]);
    clearCanvas();
  };
  
  return (
    <PracticeContainer>
      <h2>Practice Mode</h2>
      <p>Draw the word in the scribble box and practice your vocabulary!</p>
      
      <WordPrompt>
        Draw: <strong>{currentWord.word}</strong> ({currentWord.language})
      </WordPrompt>
      
      <DrawingArea className="practice-area">
        <ColorPicker>
          {colors.map(color => (
            <ColorOption 
              key={color.id}
              color={color.value}
              selected={selectedColor === color.id}
              onClick={() => setSelectedColor(color.id)}
            />
          ))}
        </ColorPicker>
        
        <Canvas 
          ref={canvasRef}
          width={600}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        
        <ToolsContainer>
          <Button onClick={() => setBrushSize(Math.max(1, brushSize - 2))}>
            Smaller Brush
          </Button>
          <Button onClick={() => setBrushSize(Math.min(30, brushSize + 2))}>
            Larger Brush
          </Button>
          <Button onClick={clearCanvas}>Clear Canvas</Button>
          <Button primary onClick={getNextWord}>Next Word</Button>
        </ToolsContainer>
      </DrawingArea>
      
      <p>
        Drawing helps reinforce vocabulary in your memory. 
        Try to draw representations of the words to practice your language skills!
      </p>
    </PracticeContainer>
  );
};

export default Practice;
