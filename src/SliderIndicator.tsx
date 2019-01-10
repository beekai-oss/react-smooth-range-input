// @flow
import * as React from 'react';
import styled from 'styled-components';
import createArrayWithNumbers from './utilities/createArrayWithNumbers';

const colors = {
  sliderLightBlue: '#000',
};

const PipeGroup = styled.div`
  display: flex;
  width: 100%;
  padding-top: 15px;
  justify-content: space-around;
`;

const Pipe = styled.span`
  height: 10px;
  width: 1px;
  background: ${colors.sliderLightBlue};
`;

export default () => (
  <PipeGroup>
    {createArrayWithNumbers(38).map(index => (
      <Pipe key={index} />
    ))}
  </PipeGroup>
);
