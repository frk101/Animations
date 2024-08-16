/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Canvas,
  Skia,
  PaintStyle,
  notifyChange,
  StrokeJoin,
  StrokeCap,
  SkPath,
} from '@shopify/react-native-skia';

import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {
  useSharedValue,
  withTiming,
  runOnJS,
  useAnimatedStyle,
} from 'react-native-reanimated';
import CoverImage from './CoverImage';
import RewardImage from './RewardImage';
import Animated from 'react-native-reanimated'; // Animated.View bileşenini ekleyin
import ConfettiCannon from 'react-native-confetti-cannon';

const THUMB_WID = 35;
const SCALE = 1 / 10;

function ScratchCard({
  imagewidth,
  imageheight,
  coverImage,
  rewardImage,
}: {
  coverImage: string;
  rewardImage: string;
  imagewidth: number;
  imageheight: number;
}) {
  const scratchPath = useSharedValue(Skia.Path.Make()); // Kullanıcı tarafından çizilen yolu takip etmek için
  const strokeWidth = useSharedValue<number>(THUMB_WID); // Kazıma genişliğini yönetmek için
  const scaleValue = useSharedValue(1); // Kartın başarılı kazıma sonrası ölçeklemesi için
  const [showConfetti, setShowConfetti] = useState(false); // Konfeti animasyonunu tetiklemek için

  // Kazıma tamamlandıktan sonra tetiklenen fonksiyon
  const onReveal = () => {
    // Ölçekleme efekti
    scaleValue.value = withTiming(1.1, {duration: 500}, () => {
      scaleValue.value = withTiming(1, {duration: 500});
    });
    setShowConfetti(true); // Konfeti animasyonunu başlat
  };

  // Kazıma işlemi sırasında hareketleri işlemek için GestureHandler kullanıyoruz
  const scratchHandler = Gesture.Pan()
    .onBegin(e => {
      scratchPath.value.moveTo(e.x, e.y);
      scratchPath.value.lineTo(e.x, e.y);
      notifyChange(scratchPath); // Kazıma işlemini yenile
    })
    .onUpdate(e => {
      scratchPath.value.lineTo(e.x, e.y);
      notifyChange(scratchPath); // Kazıma işlemini yenile
    })
    .onFinalize(() => {
      let scratchedArea = getScratchedAreaFraction(
        scratchPath.value,
        imagewidth,
        imageheight,
      );
      if (scratchedArea > 0.4) {
        // Kazınan alan %40'tan fazla olduğunda
        const imageLengthDiagonally = Math.hypot(imagewidth, imageheight);
        strokeWidth.value = withTiming(
          imageLengthDiagonally,
          {duration: 1000},
          done => {
            if (done) {
              runOnJS(onReveal)(); // Kazıma tamamlandığında onReveal fonksiyonunu çağır
            }
          },
        );
      }
    });

  // Animated style for scaling the canvas
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scaleValue.value}], // Ölçeklendirme için doğrudan value kullanımı
    };
  });

  return (
    <GestureDetector gesture={scratchHandler}>
      <Animated.View style={animatedStyle}>
        {/* Animated.View kullanarak animasyonlu stili buraya ekliyoruz */}
        <Canvas
          style={{
            width: imagewidth,
            height: imageheight,
            shadowColor: 'black', // Gölge efekti
            shadowOffset: {width: 0, height: 10},
            shadowOpacity: 0.25,
            shadowRadius: 10,
          }}>
          {/* Altında ödül görselini göster */}
          <RewardImage
            width={imagewidth}
            height={imageheight}
            rewardImage={rewardImage}
            // rewardImage={require('../win.jpg')}
          />
          {/* Üst katmanda kazınabilir alan */}
          <CoverImage
            strokeWidth={strokeWidth}
            scratchPath={scratchPath}
            width={imagewidth}
            height={imageheight}
            coverImage={coverImage}
            // coverImage={
            //   'https://img.freepik.com/premium-vector/you-win-lettering-pop-art-text-banner_185004-60.jpg'
            // }
          />
        </Canvas>
        {showConfetti && <ConfettiCannon count={400} origin={{x: -10, y: 0}} />}
        {/* Konfeti animasyonu */}
      </Animated.View>
    </GestureDetector>
  );
}

const getScratchedAreaFraction = (
  scratchedPath: SkPath,
  imagewidth: number,
  imageheight: number,
) => {
  'worklet';
  let w = imagewidth * SCALE;
  let h = imageheight * SCALE;

  const surface = Skia.Surface.MakeOffscreen(w, h)!;
  const canvas = surface.getCanvas();
  canvas.scale(SCALE, SCALE);
  const paint = Skia.Paint();
  paint.setStyle(PaintStyle.Stroke);
  paint.setStrokeWidth(THUMB_WID);
  paint.setColor(Skia.Color('white'));
  paint.setStrokeCap(StrokeCap.Round);
  paint.setStrokeJoin(StrokeJoin.Round);

  canvas.drawPath(scratchedPath, paint);
  surface.flush();
  let pixelsInfo = surface.makeImageSnapshot().readPixels();

  if (!pixelsInfo?.length) {
    return 0;
  }

  let rChannelSum = 0;

  for (let i = 0; i < pixelsInfo.length; i += 4) {
    rChannelSum += pixelsInfo[i];
  }

  let rChannelAvg = rChannelSum / (pixelsInfo.length / 4);

  let scratchedAreaFraction = rChannelAvg / 255;
  return scratchedAreaFraction;
};

export default ScratchCard;
