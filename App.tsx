import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Dimensions} from 'react-native';
import ScratchCard from './src/ScratchCard';
const {width, height} = Dimensions.get('window');
export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ScratchCard
        coverImage={
          'https://img.freepik.com/premium-vector/you-win-lettering-pop-art-text-banner_185004-60.jpg'
        }
        rewardImage={require('./win.jpg')}
        imagewidth={width}
        imageheight={height}
      />
    </GestureHandlerRootView>
  );
}
