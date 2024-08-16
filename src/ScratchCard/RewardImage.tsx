import React from 'react';
import {Image, useImage} from '@shopify/react-native-skia';

const RewardImage = ({
  width,
  height,
  rewardImage,
}: {
  width: number;
  height: number;
  rewardImage: string;
}) => {
  const image = useImage(rewardImage); // Ödül resmini yükle

  return (
    <Image
      image={image}
      x={0}
      y={0}
      width={width}
      height={height}
      fit={'contain'}
    />
  );
};
export default RewardImage;
