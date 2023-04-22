import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  TouchableNativeFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import Inputs from "../components/Inputs";
import Checkbox from "expo-checkbox";
import { Snackbar } from "@react-native-material/core";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase-config";
import { useAuth } from "../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { Image } from "react-native";
import { Dimensions } from "react-native";
import { TouchableRipple } from "react-native-paper";

const { width, height } = Dimensions.get("screen");
const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackBarData, setSnackBarData] = useState("");
  const [showSnackBar, setShowSnackBar] = useState(false);
  const { setUser, user } = useAuth();
  const [sendingEmail, setSendingEmail] = useState(false);

  const login = async () => {
    if (email == "" || password == "") {
      setShowSnackBar(true);
      setSnackBarData("Please fill in all fields");
    } else {
      try {
        setLoading(true);
        await signInWithEmailAndPassword(auth, email, password).then(
          async (res) => {
            try {
              await AsyncStorage.setItem("user", JSON.stringify(res.user));
            } catch (error) {}
            setUser(res.user);
            setShowSnackBar(true);
            setSnackBarData("Sign In Successful");
            navigation.navigate("Chat", { screen: "Chats" });
            setLoading(false);
          }
        );
      } catch (err) {
        if (err.code === "auth/wrong-password") {
          setShowSnackBar(true);
          setSnackBarData("Wrong Password");
        } else if (err.code === "auth/too-many-requests") {
          setShowSnackBar(true);
          setSnackBarData("Too many trials, try again later!");
        } else if (err.code === "auth/user-not-found") {
          setShowSnackBar(true);
          setSnackBarData("User Not found");
        } else if (err.code === "auth/email-already-in-use") {
          setShowSnackBar(true);
          setSnackBarData("Email already in use");
        } else if (err.code === "auth/network-request-failed") {
          setShowSnackBar(true);
          setSnackBarData(
            "Sorry something went wrong!! Check your connection and try again"
          );
        } else if (err.code === "auth/weak-password") {
          setShowSnackBar(true);
          setSnackBarData("Password should be at least 6 characters");
        } else if (err.code === "auth/invalid-email") {
          setShowSnackBar(true);
          setSnackBarData("Email is Invalid");
        } else {
          setLoading(false);
          console.log(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (showSnackBar === true) {
      setTimeout(() => {
        setShowSnackBar(false);
      }, 4000);
    }
  }, [showSnackBar]);

  const forgotPassword = async () => {
    if (email === "") {
      setShowSnackBar(true);
      setSnackBarData("Please fill in your email");
    } else {
      setSendingEmail(true);
      await sendPasswordResetEmail(auth, email)
        .then(() => {
          setSendingEmail(false);
          Alert.alert(
            "Success!!",
            "A password reset link has been sent to your email."
          );
        })
        .catch((e) => {
          setSendingEmail(false);
          if (e.code === "auth/user-not-found") {
            setShowSnackBar(true);
            setSnackBarData(`No user found with email: ${email}`);
          } else if (e.code === "auth/invalid-email") {
            setShowSnackBar(true);
            setSnackBarData("Email is Invalid");
          } else {
            setShowSnackBar(true);
            setSnackBarData("An error occured");
            console.log(e.code);
          }
        });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ backgroundColor: "white" }}
        bounces={true}
        overScrollMode="never"
      >
        <SafeAreaView style={styles.container}>
          <View
            style={{
              backgroundColor: "white",
              height: height * 0.3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              resizeMode="contain"
              style={{ width: "100%", height: "100%" }}
              source={require("../assets/login.png")}
            />
          </View>
          <View style={styles.texts}>
            <Text style={{ fontSize: 30, fontFamily: "bold" }}>
              Hi, Welcome Back!👋
            </Text>
            <Text
              style={{
                paddingVertical: 5,
                fontFamily: "regular",
                opacity: 0.6,
              }}
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
            </View>
          </View>
          <TouchableNativeFeedback disabled={loading}
            onPress={() => {
              login();
            }} background={TouchableNativeFeedback.Ripple(
              "rgba(255,255,255,0.35)",
              false,
            )}>
          <View
            
            style={[
              styles.button,
              { marginBottom: 9 },
              loading && { opacity: 0.7 },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={"white"} />
            ) : (
              <Text style={{ fontFamily: "regular", color: "white" }}>
                Sign In
              </Text>
            )}
          </View>
          </TouchableNativeFeedback>
          <Text style={{ fontFamily: "medium", textAlign: "center" }}>or</Text>
          <View>
            
            <TouchableRipple
            disabled={loading || sendingEmail}
            onPress={() => forgotPassword()}
            rippleColor="rgba(0,0,0, 0.1)"
            borderless
              style={[
                styles.button,
                sendingEmail && { opacity: 0.5 },
                {
                  backgroundColor: "white",
                  borderWidth: 1,
                  marginTop: 9,
                  marginBottom: 25,
                },
              ]}
              
            >
              {sendingEmail ? (
                <ActivityIndicator color={"black"} />
              ) : (
                <Text style={{ fontFamily: "regular", color: "black" }}>
                  Forgot Password
                </Text>
              )}
            </TouchableRipple>
          </View>
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
      </ScrollView>
      {showSnackBar && (
        <Snackbar
          message={snackBarData}
          style={{ position: "absolute", start: 16, end: 16, bottom: 16 }}
        />
      )}
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
