import { Box, Typography } from '@mui/material';
import { useRef, useEffect, useState } from 'react';
import '../styles/AlignmentVisualizer.css';
import { aminoAcidColors } from '../utils/aminoAcidColors';

interface AlignmentVisualizerProps {
  seq1: string;
  seq2: string;
  onCopy: () => void;
}

const AlignmentVisualizer: React.FC<AlignmentVisualizerProps> = ({ seq1, seq2, onCopy }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [charsPerRow, setCharsPerRow] = useState<number>(0);

  // Определяем количество символов в строке в зависимости от ширины контейнера
  useEffect(() => {
    const updateCharsPerRow = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // Примерная ширина одного символа (включая границы и отступы)
        const charWidth = 26; // 24px ширина + 2px границы/отступы
        const calculatedCharsPerRow = Math.floor(containerWidth / charWidth);
        setCharsPerRow(Math.max(calculatedCharsPerRow, 1)); // Минимум 1 символ в строке
      }
    };

    updateCharsPerRow();
    window.addEventListener('resize', updateCharsPerRow);

    return () => {
      window.removeEventListener('resize', updateCharsPerRow);
    };
  }, []);

  // Обработка выделения текста для копирования
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString()) {
        navigator.clipboard
          .writeText(selection.toString())
          .then(() => {
            onCopy();
          })
          .catch((err) => {
            console.error('Не удалось скопировать текст: ', err);
          });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mouseup', handleSelection);
    }

    return () => {
      if (container) {
        container.removeEventListener('mouseup', handleSelection);
      }
    };
  }, [onCopy]);

  // Преобразуем последовательности в верхний регистр для единообразия
  const upperSeq1 = seq1.toUpperCase();
  const upperSeq2 = seq2.toUpperCase();

  // Разбиваем последовательности на символы для отображения
  const seq1Chars = upperSeq1.split('');
  const seq2Chars = upperSeq2.split('');

  // Разбиваем последовательности на строки для корректного отображения
  const renderAlignmentRows = () => {
    if (charsPerRow <= 0) return null;

    const rows = [];
    for (let i = 0; i < seq1Chars.length; i += charsPerRow) {
      const rowSeq1 = seq1Chars.slice(i, i + charsPerRow);
      const rowSeq2 = seq2Chars.slice(i, i + charsPerRow);

      rows.push(
        <div key={`row-${i}`} className="alignment-row">
          <Box className="sequence-row">
            {rowSeq1.map((char, index) => (
              <Box
                key={`seq1-${i + index}`}
                component="span"
                className="amino-acid"
                style={{ backgroundColor: aminoAcidColors[char] || '#FFFFFF' }}
              >
                {char}
              </Box>
            ))}
          </Box>

          <Box className="sequence-row">
            {rowSeq2.map((char, index) => (
              <Box
                key={`seq2-${i + index}`}
                component="span"
                className="amino-acid"
                style={{
                  backgroundColor:
                    char !== rowSeq1[index] ? aminoAcidColors[char] || '#FFFFFF' : '#FFFFFF',
                }}
              >
                {char}
              </Box>
            ))}
          </Box>
        </div>
      );
    }

    return rows;
  };

  return (
    <Box ref={containerRef} className="alignment-container">
      {renderAlignmentRows()}

      <Typography variant="caption" className="copy-hint">
        Выделите часть последовательности, чтобы скопировать её
      </Typography>
    </Box>
  );
};

export default AlignmentVisualizer;
