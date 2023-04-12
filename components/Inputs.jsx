import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

const Inputs = ({ setValue, label = "label", placeholder = "placeholder" }) => {
    return (
        <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 13, fontFamily: "medium" }}>{label}</Text>
            <TextInput onChangeText={(text) => {
                setValue(text)
            }} placeholder={placeholder} cursorColor={"black"}  secureTextEntry={label === "Password" && true} selectionColor="rgba(0,0,0,0.4)" placeholderTextColor="rgba(0,0,0,0.4)" style={[styles.input, { fontSize: 14, fontFamily: "regular" }]} />
        </View>
    )
}

export default Inputs;

const styles = StyleSheet.create({
    input: {
        paddingVertical: 7,
        paddingHorizontal: 14,
        marginVertical: 6,
        borderColor: "rgba(0,0,0,0.4)",
        borderWidth: .7,
        borderRadius: 6
    }
})