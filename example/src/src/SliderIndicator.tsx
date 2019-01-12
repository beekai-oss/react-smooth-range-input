import * as React from 'react';
import createArrayWithNumbers from './utilities/createArrayWithNumbers';

interface Props {
  amount: number,
  color?: string,
}

export default ({ amount, color }: Props) => (
  <div
    style={{
      display: 'flex',
      width: '100%',
      paddingTop: '15px',
      justifyContent: 'space-around',
    }}
  >
    {createArrayWithNumbers(amount).map(index => (
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
