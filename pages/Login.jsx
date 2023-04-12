import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Inputs from "../components/Inputs";
import Checkbox from "expo-checkbox";
import { Snackbar } from "@react-native-material/core";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import { useAuth } from "../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";



const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackBarData, setSnackBarData] = useState("");
  const [showSnackBar, setShowSnackBar] = useState(false);
  const { setUser, user } = useAuth();

  const login = async () => {
    if (email == "" || password == "") {
      setShowSnackBar(true);
      setSnackBarData("Please fill in all fields");
    } else {
      try {
        setLoading(true);
        await signInWithEmailAndPassword(auth, email, password)
          .then(async(res) => {
            try {
                await AsyncStorage.setItem("user", JSON.stringify(res.user));
              } catch (error) {}
            setUser(res.user);
            setShowSnackBar(true);
            setSnackBarData("Sign In Successful");
            navigation.navigate('Chat', { screen: 'Chats' })
            setLoading(false);

          })
      } catch (err) {
        if(err.code === 'auth/wrong-password'){
            setShowSnackBar(true)
                setSnackBarData("Wrong Password")
          }else if(err.code === 'auth/too-many-requests'){
            setShowSnackBar(true)
                setSnackBarData("Too many trials, try again later!")
          }else if(err.code === 'auth/user-not-found'){
            setShowSnackBar(true)
                setSnackBarData("User Not found")
          }else if(err.code === 'auth/email-already-in-use'){
            setShowSnackBar(true)
                setSnackBarData("Email already in use")
          }else if(err.code === 'auth/network-request-failed'){
            setShowSnackBar(true)
                setSnackBarData("Sorry something went wrong!! Check your connection and try again")
          
          }else if(err.code === 'auth/weak-password'){
            setShowSnackBar(true)
                setSnackBarData("Password should be at least 6 characters")
          }
          else{
            setLoading(false)
            console.log(err.message)
        } 
      }finally{
            setLoading(false)
      }
    }
  };
 
  // useEffect(() => {
  //   if(user){
  //       navigation.navigate('Chat', { screen: 'Chats' })
  //   }
  // }, [user])

  useEffect(() => {
    if (showSnackBar === true) {
      setTimeout(() => {
        setShowSnackBar(false);
      }, 4000);
    }
  }, [showSnackBar]);

  

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      style={{ backgroundColor: "white" }}
      bounces={true}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.texts}>
          <Text style={{ fontSize: 30, fontFamily: "bold" }}>
            Hi, Welcome Back!👋
          </Text>
          <Text
            style={{ paddingVertical: 5, fontFamily: "regular", opacity: 0.6 }}
          >
            Hello again, you've being missed!
          </Text>
        </View>
        <View style={styles.form}>
          <Inputs
            setValue={setEmail}
            label="Email Address"
            placeholder="Enter your email address"
          />
          <Inputs
            setValue={setPassword}
            label="Password"
            placeholder="Enter your password"
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => setChecked(!isChecked)}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Checkbox
                value={isChecked}
                onValueChange={setChecked}
                color={isChecked ? "black" : undefined}
                style={styles.checkbox}
              />
              <Text style={{ fontSize: 12, fontFamily: "regular" }}>
                Remember me
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "regular",
                  color: "rgba(0,0,0,0.8)",
                }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          disabled={loading}
          onPress={() => {
            login();
          }}
          style={[styles.button, loading && { opacity: 0.7 }]}
        >
          {loading ? (
            <ActivityIndicator color={"white"} />
          ) : (
            <Text style={{ fontFamily: "regular", color: "white" }}>
              Sign In
            </Text>
          )}
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 10,
          }}
        >
          <Text style={{ fontFamily: "regular", marginRight: 3 }}>
            Don't have an account?
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Register");
            }}
          >
            <Text style={{ fontFamily: "regular", color: "rgba(0,0,0,0.4)" }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        
      </SafeAreaView>
      {showSnackBar && (
          <Snackbar
            message={snackBarData}
            style={{ position: "absolute", start: 16, end: 16, bottom: 16 }}
          />
        )}
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight + 80,
    paddingHorizontal: 20,
  },
  texts: {
    paddingVertical: 20,
  },
  form: {
    paddingVertical: 8,
  },
  checkbox: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    marginRight: 5,
  },
  button: {
    padding: 15,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    borderRadius: 6,
  },
});
