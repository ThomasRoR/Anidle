import React from 'react';

interface ImageClueProps {
  imageUrl: string;
  isRevealed: boolean;
  blurLevel: number; 
}

export const ImageClue: React.FC<ImageClueProps> = ({ imageUrl, isRevealed, blurLevel }) => {
  const currentBlur = isRevealed ? 0 : blurLevel;

  return (
    <div className="image-clue-container">
      <img 
        src={imageUrl} 
        alt="Pista do anime do dia" 
        style={{ filter: `blur(${currentBlur}px)` }}
      />
    </div>
  );
};