import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Dimensions } from "react-native";


var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height;

const FullScreenLoader = () => {
  return (
    <View style={styles.bg}>
      <View style={{width:50, height:50, backgroundColor:"white", alignItems:'center', justifyContent:"center", borderRadius:50}}>
      <ActivityIndicator color={"black"} size={30}/>
      </View>
    </View>
  )
}

export default FullScreenLoader

const styles = StyleSheet.create({
    bg:{
        position:"absolute",
        top:0,
        left:0,
        flex:1,
        width:width,
        height:height,
        backgroundColor:"rgba(0,0,0,0.6)",
        zIndex:99999,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center"

    }
})