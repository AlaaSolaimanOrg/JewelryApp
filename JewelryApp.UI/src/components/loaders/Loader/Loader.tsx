// components/loaders/Loader/Loader.tsx
import React from 'react';
import './loader.scss';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'medium', 
  text = 'Loading...',
  className = '' 
}) => {
  return (
    <div className={`loader-container ${className}`}>
      <div className={`loader-spinner loader-${size}`}>
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
      </div>
      {text && <div className="loader-text">{text}</div>}
    </div>
  );
};

export default Loader;