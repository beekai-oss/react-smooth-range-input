// @flow
import * as React from 'react';
import createArrayWithNumbers from './utilities/createArrayWithNumbers';

export default () => (
  <div
    style={{
      display: 'flex',
      width: '100%',
      paddingTop: '15px',
      justifyContent: 'space-around',
    }}
  >
    {createArrayWithNumbers(38).map(index => (
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
