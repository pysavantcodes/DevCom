import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Animated } from "react-native";

const ShimmerLoader = () => {
  const backgroundAnimation = useRef(new Animated.Value(0)).current;

  const startBackgroundAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundAnimation, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundAnimation, {
          toValue: 0.6,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundAnimation, {
          toValue: 0.4,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundAnimation, {
          toValue: 0.2,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundAnimation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    startBackgroundAnimation();
  }, []);

  const backgroundInterpolate = backgroundAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#d9d9d9", "#f2f2f2"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.imageContainer,
          { backgroundColor: backgroundInterpolate },
        ]}
      />
      <Animated.View style={styles.textContainer}>
        <Animated.View
          style={[
            styles.textLine,
            { width: "80%", backgroundColor: backgroundInterpolate },
          ]}
        />
        <Animated.View
          style={[
            styles.textLine,
            { width: "50%", backgroundColor: backgroundInterpolate },
          ]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    flexDirection:"row",
    width:"100%",
    alignItems:'center',
    paddingVertical:7,
    paddingHorizontal:20,
    
  },
 
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#d9d9d9",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
  },
  textLine: {
    height: 12,
    backgroundColor: "#d9d9d9",
    marginBottom: 5,
    borderRadius: 10,
  },
 
});

export default ShimmerLoader;
