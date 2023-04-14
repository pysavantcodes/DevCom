import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Dimensions } from "react-native";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height;

const LoadingUserPage = ({style}) => {
  return (
    <View style={[styles.bg, style]}>
      <View
        style={{
          width: 50,
          height: 50,
          backgroundColor: "black",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 50,
        }}
      >
        <ActivityIndicator color={"white"} size={30} />
      </View>
      <Text style={{ fontSize: 15, marginTop: 6, fontFamily: "medium" }}>
        Please wait...
      </Text>
    </View>
  );
};

export default LoadingUserPage;

const styles = StyleSheet.create({
  bg: {
    position: "absolute",
    top: 0,
    left: 0,
    flex: 1,
    width: width,
    height: height,
    backgroundColor: "white",
    zIndex: 99999,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    
    
  },
});
