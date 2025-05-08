import * as Location from 'expo-location';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Linking, Platform, Pressable, View } from 'react-native';

import MapView, { Region } from 'react-native-maps';
import { useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BottomSheetHandle,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetTrigger,
} from '~/components/ui/bottom-sheet';

import { Navigation } from 'lucide-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button } from '~/components/ui/button';
import { Card, CardDescription, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';

// region 생성
function createRegionFromLocation(location: {
  latitude: number;
  longitude: number;
}): Region {
  return {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
}

const Home = () => {
  const [region, setRegion] = useState<Region | undefined>(undefined);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      const region = createRegionFromLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setRegion(region);
      setLoading(false);
    })();
  }, []);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        '위치 권한 필요',
        '이 기능을 사용하려면 위치 권한이 필요합니다. [설정]에서 권한을 허용해 주세요.',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '설정으로 이동',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          },
        ]
      );
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const region = createRegionFromLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setRegion(region);
  };

  const [isOpen, setIsOpen] = useState(false);

  const animatedIndex = useSharedValue<number>(0);
  const animatedPosition = useSharedValue<number>(0);
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['30%', '50%', '100%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    if (isOpen) {
      bottomSheetModalRef.current?.dismiss();
      setIsOpen(false);
    } else {
      bottomSheetModalRef.current?.present();
      setIsOpen(true);
    }
  }, [isOpen]);

  // 처음 렌더링 될 시 bottom sheet present
  // useEffect(() => {
  //   if (bottomSheetModalRef.current) {
  //     bottomSheetModalRef.current.present();
  //     setIsOpen(true);
  //   }
  // }, [bottomSheetModalRef]);

  // handle
  const handleSheetChange = useCallback((index: number) => {
    if (index < 0) {
      setIsOpen(false);
      bottomSheetModalRef.current?.dismiss();
    }
  }, []);

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <GestureHandlerRootView>
        <View>
          {Platform.OS !== 'web' && (
            <MapView
              style={{ width: '100%', height: '100%' }}
              mapType="mutedStandard"
              region={region}
              onRegionChangeComplete={setRegion}
              showsBuildings={false}
              showsPointsOfInterest={false}
              showsIndoors={false}
              showsTraffic={false}
              showsUserLocation={true}
            ></MapView>
          )}

          <Button
            variant={'default'}
            size="icon"
            onPress={getLocation}
            className="absolute top-8 right-6 pr-1 pt-1"
          >
            <Navigation size={20} />
          </Button>
        </View>

        <Button
          onPress={handlePresentModalPress}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full p-4 shadow-lg z-30"
        >
          <Text>{isOpen ? '지도 보기' : '장소 보기'}</Text>
        </Button>

        <BottomSheetModalProvider>
          <View className="p-1 rounded-md z-20">
            {Platform.OS !== 'web' && ( // Use this condition if you want to control the modal from outside for only mobile
              <Pressable>
                <Text>Present Modal</Text>
              </Pressable>
            )}

            <BottomSheetModal
              ref={bottomSheetModalRef}
              snapPoints={snapPoints}
              isOpen={isOpen}
              onChange={handleSheetChange}
              index={2}
              handleComponent={() => (
                <BottomSheetHandle
                  className="bg-green-300 mt-2"
                  animatedIndex={animatedIndex}
                  animatedPosition={animatedPosition}
                />
              )}
            >
              {Platform.OS === 'web' && (
                <>
                  <BottomSheetTrigger>
                    <Text className="text-black font-bold">Present Modal</Text>
                  </BottomSheetTrigger>
                </>
              )}
              <BottomSheetScrollView className="flex-1 gap-2 p-2">
                {Platform.OS === 'web' && (
                  <BottomSheetHandle
                    className="bg-gray-300 mt-2"
                    animatedIndex={animatedIndex}
                    animatedPosition={animatedPosition}
                  />
                )}
                {/* 야외 농구장 카드 리스트 */}
                {[
                  '한강공원 농구장',
                  '올림픽공원 농구장',
                  '잠실종합운동장 농구장',
                  '상암월드컵공원 농구장',
                  '여의도공원 농구장',
                  '뚝섬한강공원 농구장',
                  '노들섬 농구장',
                  '서울숲 농구장',
                  '반포한강공원 농구장',
                  '망원한강공원 농구장',
                ].map((name, idx) => (
                  <Card key={idx} className="w-full p-5 bg-inherit border-gray-100">
                    <CardTitle className="text-lg text-black">{name}</CardTitle>
                    <CardDescription>야외 농구장</CardDescription>
                  </Card>
                ))}
              </BottomSheetScrollView>
            </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default Home;
