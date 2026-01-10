'use client';

import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  texts: string[]; //  array de strings
  speed?: number; // velocidad de escritura
  deleteSpeed?: number; // velocidad de borrado
  delay?: number; // delay antes de borrar
  className?: string; // clases opcionales
}

export function TypewriterText({
  texts = [],
  speed = 100,
  deleteSpeed = 60,
  delay = 1500,
  className = '',
}: TypewriterTextProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    if (!currentText) return;

    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText.length < currentText.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length + 1));
      }, speed);
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length - 1));
      }, deleteSpeed);
    } else if (!isDeleting && displayText.length === currentText.length) {
      timeout = setTimeout(() => setIsDeleting(true), delay);
    } else if (isDeleting && displayText.length === 0) {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, texts, speed, deleteSpeed, delay]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}
