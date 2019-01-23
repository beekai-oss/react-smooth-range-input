import * as React from 'react';
import createArrayWithNumbers from './utilities/createArrayWithNumbers';

interface Props {
  amount: number;
  isThin: boolean;
  color?: string;
  backgroundColor?: string;
  hasTickMarks?: boolean;
}

export default ({ amount, color, isThin, backgroundColor, hasTickMarks }: Props) => (
  <div
    style={{
      display: 'flex',
      width: '100%',
      justifyContent: 'space-around',
      minHeight: '10px',
      ...(isThin ? { background: backgroundColor, borderRadius: '4px' } : { paddingTop: '15px' }),
    }}
  >
    {hasTickMarks && createArrayWithNumbers(amount > 50 ? 50 : amount).map(index => (
      <span
        style={{
          height: '10px',
          width: '1px',
          background: color,
        }}
        key={index}
      />
    ))}
  </div>
);
