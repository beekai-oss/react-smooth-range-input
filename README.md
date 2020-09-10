# 🎚 React Smooth Range Input

[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=🎚+React+Smooth+Range+Input&url=https://github.com/bluebill1049/react-smooth-range-input/) [![CircleCI](https://circleci.com/gh/bluebill1049/react-smooth-range-input.svg?style=svg)](https://circleci.com/gh/bluebill1049/react-smooth-range-input) [![Coverage Status](https://coveralls.io/repos/github/bluebill1049/react-smooth-range-input/badge.svg?branch=master)](https://coveralls.io/github/bluebill1049/react-smooth-range-input?branch=master) [![npm downloads](https://img.shields.io/npm/dm/react-smooth-range-input.svg?style=flat-square)](https://www.npmjs.com/package/react-smooth-range-input) [![npm](https://img.shields.io/npm/dt/react-smooth-range-input.svg?style=flat-square)](https://www.npmjs.com/package/react-smooth-range-input) [![npm](https://badgen.net/bundlephobia/minzip/react-smooth-range-input)](https://badgen.net/bundlephobia/minzip/react-smooth-range-input)

- Smooth input range
- Beautiful animation interaction
- Tiny size

## Install

    $ npm install react-smooth-range-input

## Example

<p>
    <a href="https://react-smooth-range-input.now.sh" target="_blank">
        <img height="500" src="https://raw.githubusercontent.com/bluebill1049/react-smooth-range-input/master/example/example.gif" alt="https://react-smooth-range-input.now.sh" />
    </a>
</p>

## Quickstart

```jsx
import react from 'react';
import Slider from 'react-smooth-range-input';

export default () => <Slider value={1} min={1} max={30} />;
```

## Props

| Prop               | Type                                             | Required | Description                                  |
| :----------------- | :----------------------------------------------- | :------: | :------------------------------------------- |
| `value`            | number                                           |    ✓     | current value                                |
| `min`              | number                                           |    ✓     | min number range                             |
| `max`              | number                                           |    ✓     | max number range                             |
| `onChange`         | Function                                         |          | on value change callback                     |
| `disabled`         | boolean                                          |          | disable the component                        |
| `hasTickMarks`     | boolean = true                                   |          | show tick marks only apply to thick type     |
| `customController` | ({ ref: any, value: number }) => React.ReactNode |          | custom controller: make sure to pass the ref |

## Sponsors

Thank you very much for those kind people with their sponsorship to this project.

<p>
    <a href="https://github.com/sayav"
    ><img
            src="https://avatars1.githubusercontent.com/u/42376060?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@sayav"
    /></a>
    <a href="https://github.com/lemcii"
    ><img
            src="https://avatars1.githubusercontent.com/u/35668113?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@lemcii"
    /></a>
    <a href="https://github.com/washingtonsoares"
    ><img
            src="https://avatars2.githubusercontent.com/u/5726150?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@washingtonsoares"
    /></a>
    <a href="https://github.com/lixunn"
    ><img
            src="https://avatars2.githubusercontent.com/u/5017964?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@lixunn"
    /></a>
    <a href="https://github.com/SamSamskies"
    ><img
            src="https://avatars2.githubusercontent.com/u/3655410?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@SamSamskies"
    /></a>
    <a href="https://github.com/peaonunes"
    ><img
            src="https://avatars2.githubusercontent.com/u/3356720?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@peaonunes"
    /></a>
    <a href="https://github.com/wilhelmeek"
    ><img
            src="https://avatars2.githubusercontent.com/u/609452?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@wilhelmeek"
    /></a>
    <a href="https://github.com/iwarner"
    ><img
            src="https://avatars2.githubusercontent.com/u/279251?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@iwarner"
    /></a>
    <a href="https://github.com/joejknowles"
    ><img
            src="https://avatars2.githubusercontent.com/u/10728145?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@joejknowles"
    /></a>
    <a href="https://github.com/chris-gunawardena"
    ><img
            src="https://avatars0.githubusercontent.com/u/5763108?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@chris-gunawardena"
    /></a>
    <a href="https://github.com/Tymek"
    ><img
            src="https://avatars1.githubusercontent.com/u/2625371?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@Tymek"
    /></a>
    <a href="https://github.com/Luchanso"
    ><img
            src="https://avatars0.githubusercontent.com/u/2098777?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@Luchanso"
    /></a>
    <a href="https://github.com/vcarel"
    ><img
            src="https://avatars1.githubusercontent.com/u/1541093?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@vcarel"
    /></a>
    <a href="https://github.com/gragland"
    ><img
            src="https://avatars0.githubusercontent.com/u/1481077?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@gragland"
    /></a>
    <a href="https://github.com/tjshipe"
    ><img
            src="https://avatars2.githubusercontent.com/u/1254942?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@tjshipe"
    /></a>
    <a href="https://github.com/krnlde"
    ><img
            src="https://avatars1.githubusercontent.com/u/1087002?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@krnlde"
    /></a>
    <a href="https://github.com/msutkowski"
    ><img
            src="https://avatars2.githubusercontent.com/u/784953?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@msutkowski"
    /></a>
    <a href="https://github.com/mlukaszczyk"
    ><img
            src="https://avatars3.githubusercontent.com/u/599247?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@mlukaszczyk"
    /></a>
</p>


