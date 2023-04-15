import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import Feather from "react-native-vector-icons/Feather"

const Inputs = ({ setValue, label = "label", placeholder = "placeholder" }) => {
  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={{ fontSize: 13, fontFamily: "medium" }}>{label}</Text>
      <View style={[styles.input, {flexDirection:"row"}]}>
        {label == "Email Address" && <Feather name={"mail"} size={15} color={"rgba(0,0,0,0.4)"}/>}
        {label == "Username" && <Feather name={"user"} size={15} color={"rgba(0,0,0,0.4)"}/>}
        {label == "Password" && <Feather name={"lock"} size={15} color={"rgba(0,0,0,0.4)"}/>}
        <TextInput
          onChangeText={(text) => {
            setValue(text);
          }}
          placeholder={placeholder}
          cursorColor={"black"}
          secureTextEntry={label === "Password" && true}
          selectionColor="rgba(0,0,0,0.4)"
          placeholderTextColor="rgba(0,0,0,0.4)"
          style={[ { fontSize: 14, fontFamily: "regular", width:"100%" }]}
        />
      </View>
    </View>
  );
};

export default Inputs;

const styles = StyleSheet.create({
  input: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginVertical: 6,
    borderColor: "rgba(0,0,0,0.4)",
    borderWidth: 0.7,
    borderRadius: 6,
    alignItems:"center",
    columnGap:10
  },
});
