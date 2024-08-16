import React from 'react';
import {
  Image,
  useImage,
  Path,
  Group,
  SkPath,
  LinearGradient,
} from '@shopify/react-native-skia';

import {SharedValue} from 'react-native-reanimated';

const CoverImage = ({
  scratchPath,
  strokeWidth,
  width,
  height,
  coverImage,
}: {
  scratchPath: SharedValue<SkPath>;
  strokeWidth: SharedValue<number>;
  width: number;
  height: number;
  coverImage: string;
}) => {
  const image = useImage(coverImage); // Kaplama resmini yükle

  return (
    <Group layer>
      {/* Holografik efekt için lineer gradyan ekleyelim */}
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: width, y: height}}
        colors={['#ff9a9e', '#fad0c4', '#fad0c4']}
      />
      <Image
        image={image}
        x={0}
        y={0}
        width={width}
        height={height}
        fit={'cover'}
      />
      <Path
        path={scratchPath}
        style={'stroke'}
        strokeJoin={'round'} // Yuvarlak köşeler için
        strokeCap={'round'} // Yuvarlak uçlar için
        strokeWidth={strokeWidth.value}
        color={'white'}
        blendMode={'clear'} // Kazıma işlemi için blend mode clear
      />
    </Group>
  );
};

export default CoverImage;
