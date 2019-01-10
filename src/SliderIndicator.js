// @flow
import React from 'react';
import styled from 'styled-components';
import { rem } from '../../styled/conversion';
import createArrayWithNumbers from '../../utilities/createArrayWithNumbers';
import colors from '../../styled/colors';

const PipeGroup = styled.div`
  display: flex;
  width: 100%;
  padding-top: ${rem(15)};
  justify-content: space-around;
`;

const Pipe = styled.span`
  height: ${rem(10)};
  width: ${rem(1)};
  background: ${colors.sliderLightBlue};
`;

export default () => (
  <PipeGroup>
    {createArrayWithNumbers(38).map(index => (
      <Pipe key={index} />
    ))}
  </PipeGroup>
);
