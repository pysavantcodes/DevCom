import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Inputs from "../components/Inputs";
import Checkbox from "expo-checkbox";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../firebase-config";
import { collection, doc, setDoc } from "firebase/firestore";
import { Snackbar } from "@react-native-material/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../contexts/AuthContext";
import { Image } from "react-native";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("screen");
const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackBarData, setSnackBarData] = useState("");
  const [showSnackBar, setShowSnackBar] = useState(false);
  const { setUser, user } = useAuth();

  const register = async () => {
    if (userName === "" || email === "" || password === "") {
      setShowSnackBar(true);
      setSnackBarData("Please fill in all fields");
    } else {
      try {
        setLoading(true);
        await createUserWithEmailAndPassword(auth, email, password).then(
          async (res) => {
            setDoc(doc(collection(database, "users"), email), {
              email,
              userName,
              profileImage:
                "https://media.istockphoto.com/id/1288129985/vector/missing-image-of-a-person-placeholder.jpg?s=612x612&w=0&k=20&c=9kE777krx5mrFHsxx02v60ideRWvIgI1RWzR1X4MG2Y=",
              githubAcc: null,
            });
            try {
              await AsyncStorage.setItem("user", JSON.stringify(res.user));
            } catch (error) {}
            setUser(res.user);
            setLoading(false);
            setShowSnackBar(true);
            setSnackBarData("Sign Up Successful");
            navigation.navigate("Chat", { screen: "Chats" });
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
    if (user) {
      navigation.navigate("Chat", { screen: "Chats" });
    }
  }, [user]);

  useEffect(() => {
    if (showSnackBar === true) {
      setTimeout(() => {
        setShowSnackBar(false);
      }, 4000);
    }
  }, [showSnackBar]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ backgroundColor: "white" }}
        bouncesZoom={true}
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
              source={require("../assets/signup.png")}
            />
          </View>
          <View style={styles.texts}>
            <Text style={{ fontSize: 30, fontFamily: "bold" }}>
              Create Account
            </Text>
            <Text
              style={{
                paddingVertical: 5,
                fontFamily: "regular",
                opacity: 0.6,
              }}
            >
              Connect with developers today!
            </Text>
          </View>
          <View style={styles.form}>
            <Inputs
              setValue={setUserName}
              label="Username"
              placeholder="Enter a username"
            />
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
              style={{ flexDirection: "row", justifyContent: "space-between" }}
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
              {/* <TouchableOpacity><Text style={{ fontSize: 12, fontFamily: "regular", color: "rgba(0,0,0,0.8)" }}>Forgot Password?</Text></TouchableOpacity> */}
            </View>
          </View>
          <TouchableNativeFeedback disabled={loading}
            onPress={() => {
              register();
            }} background={TouchableNativeFeedback.Ripple(
              "rgba(255,255,255,0.35)",
              false,
            )}>
          <View
            
            style={[
              styles.button,
              
              loading && { opacity: 0.7 },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={"white"} />
            ) : (
              <Text style={{ fontFamily: "regular", color: "white" }}>
                Sign Up
              </Text>
            )}
          </View>
          </TouchableNativeFeedback>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 10,
              marginTop: 9 
            }}
          >
            <Text style={{ fontFamily: "regular", marginRight: 3 }}>
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              <Text style={{ fontFamily: "regular", color: "rgba(0,0,0,0.4)" }}>
                Sign In
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
