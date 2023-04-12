import Login from "./pages/Login";
import Register from "./pages/Register";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import ChatHome from "./pages/ChatHome";
import FullScreenLoader from "./components/FullScreenLoader";
import { StatusBar } from "expo-status-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Platform,
  StyleSheet,
  View,
  Text,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import FthIcon from "react-native-vector-icons/Feather";
import AntIcon from "react-native-vector-icons/AntDesign";
import SearchPage from "./pages/SearchPage";
import Github from "./pages/Github";
import ProfilePage from "./pages/ProfilePage";
import BSheet from "./components/BottomSheet";
import ChatsScreen from "./pages/ChatsScreen";
import LoadingUserPage from "./components/LoadingUserPage";
import { BottomSheet } from "react-native-btr";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Home() {
  return (
    <Tab.Navigator
      keyboardHidesTabBar={true}
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          paddingVertical: Platform.OS === "ios" ? 20 : 0,
          backgroundColor: "black",
          elevation: 0,
          position: "absolute",
          zIndex: 99,
          bottom: 0,
          left: 0,
          ...styles.shadow,

          height: 74,
        },
      }}
    >
      <Tab.Screen
        name="Chats"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                flexDirection: "column",
                opacity: 0.5,
                ...(focused && { opacity: 1 }),
              }}
            >
              <IonIcon color={"white"} size={23} name="ios-people-outline" />
              <Text
                style={{ fontSize: 10, color: "white", fontFamily: "regular" }}
              >
                Communities
              </Text>
            </View>
          ),
        }}
        component={ChatHome}
      />
      <Tab.Screen
        name="Search"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                flexDirection: "column",
                opacity: 0.5,
                ...(focused && { opacity: 1 }),
              }}
            >
              <IonIcon color={"white"} size={23} name="ios-compass-outline" />
              <Text
                style={{ fontSize: 10, color: "white", fontFamily: "regular" }}
              >
                Explore
              </Text>
            </View>
          ),
        }}
        component={SearchPage}
      />
      <Tab.Screen
        name="Create"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                flexDirection: "column",
                opacity: 0.5,
                ...(focused && { opacity: 1 }),
              }}
            >
              <IonIcon
                color={"white"}
                size={23}
                name="ios-add-circle-outline"
              />
              <Text
                style={{ fontSize: 10, color: "white", fontFamily: "regular" }}
              >
                Create
              </Text>
            </View>
          ),
        }}
        component={BSheet}
      />

      <Tab.Screen
        name="Github"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                flexDirection: "column",
                opacity: 0.5,
                ...(focused && { opacity: 1 }),
              }}
            >
              <AntIcon color={"white"} size={23} name="github" />
              <Text
                style={{ fontSize: 10, color: "white", fontFamily: "regular" }}
              >
                Github
              </Text>
            </View>
          ),
        }}
        component={Github}
      />

      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                flexDirection: "column",
                opacity: 0.5,
                ...(focused && { opacity: 1 }),
              }}
            >
              <FthIcon color={"white"} size={23} name="user" />
              <Text
                style={{ fontSize: 10, color: "white", fontFamily: "regular" }}
              >
                Profile
              </Text>
            </View>
          ),
        }}
        component={ProfilePage}
      />
    </Tab.Navigator>
  );
}

const Main = () => {
  const { user, loading, showSheet, setShowSheet, loadingUser, isOffline } =
    useAuth();
  useEffect(() => {
    const backAction = () => {
      if (showSheet) {
        setShowSheet(false);
        return true;
      } else {
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [showSheet]);

  return (
    <>
      {loading && <FullScreenLoader />}
      {loadingUser && <LoadingUserPage />}
      {showSheet && (
        <BSheet
          show={true}
          onClose={() => {
            setShowSheet(false);
          }}
        />
      )}
      <BottomSheet
        visible={isOffline}
        onBackButtonPress={() => {}}
        onBackdropPress={() => {}}
      >
        <View style={styles.card}>
          <Text style={{ fontSize: 23, fontFamily: "bold", marginBottom: 10 }}>
            Connection Error
          </Text>
          <Text
            style={{
              fontSize: 17,
              fontFamily: "medium",
              opacity: 0.7,
              textAlign: "center",
            }}
          >
            Oops! Looks like your device is not connected to the internet
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "black",
              width: "100%",
              padding: 15,
              marginTop: 15,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontFamily: "medium",
                color: "white",
                textAlign: "center",
              }}
            >
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>

      <NavigationContainer>
        <StatusBar style="light" translucent={false} backgroundColor="#000" />
        <Stack.Navigator
          initialRouteName={"Login"}
          screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}
        >
          {!user ? (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Chat"
                component={Home}
                options={{
                  style: {
                    paddingVertical: Platform.OS === "ios" ? 20 : 0,
                    height: 78,
                    backgroundColor: "white",
                  },
                }}
              />
              <Stack.Screen name="ChatScreen" component={ChatsScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 10,
  },
  card: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
});

export default Main;
