import * as React from 'react';
import createArrayWithNumbers from './utilities/createArrayWithNumbers';

interface Props {
  amount: number,
}

export default ({ amount }: Props) => (
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
          background: 'blue',
        }}
        key={index}
      />
    ))}
  </div>
);
