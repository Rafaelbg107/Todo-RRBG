import React, { useEffect, useRef } from "react";
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface Props {
  onPressBanner: () => void;
  onPressClose: () => void;
  setClosed: (value: boolean) => void;
}

const FlashMessage = ({
  onPressBanner,
  onPressClose,
  setClosed
}: Props) => {
  const width = useSharedValue(56);
  const progress = useSharedValue(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const screenWidth = Dimensions.get('window').width;
  const expandedWidth = screenWidth - 32;

  useEffect(() => {
    handlePress()
  }, [])

  const handlePress = () => {
    width.value = withTiming(expandedWidth, { duration: 800, easing: Easing.bezier(0.25, 0.69, 0.25, 0.99), });
    progress.value = 0;
    progress.value = withTiming(1, { duration: 7000 });

    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      width.value = withTiming(56, { duration: 800, easing: Easing.bezier(0.25, 0.69, 0.25, 0.99), });
      progress.value = 0;
    }, 7000);
  };

  const fillStyle = useAnimatedStyle(() => ({
    width: interpolate(progress.value, [0, 1], [0, expandedWidth]),
  }));
   
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.timeoutContainer, fillStyle, {backgroundColor: '#0d57ab'}]} />
      
      <View style={styles.content}>
        <Text style={styles.text}>Task Completed! Tap to undo</Text>
        <Pressable onPress={onPressBanner} style={styles.undoButton}>
          <Text style={styles.undoText}>Undo</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default FlashMessage;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    bottom: Platform.OS === 'ios' ? 135 : 55,
    right: 16,
    height: 60,
    backgroundColor: '#116dd6',
    borderRadius: 16,
    zIndex: 9999,
    elevation: 10,
    overflow: 'hidden',
  },
  animatedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 16,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  undoButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  undoText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeoutContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 16,
    zIndex: 0,
  },
});
