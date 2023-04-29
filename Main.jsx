import Login from "./pages/Login";
import Register from "./pages/Register";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import ChatHome from "./pages/ChatHome";
import FullScreenLoader from "./components/FullScreenLoader";
import { StatusBar } from "expo-status-bar";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import {
  Platform,
  StyleSheet,
  View,
  Text,
  BackHandler,
  TouchableOpacity,
  Linking,
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
import { useCommunity } from "./contexts/CommunityContext";
import registerNNPushToken, { getPushDataObject } from "native-notify";
import { Alert } from "react-native";

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function Home({ navigation }) {
  const { communities } = useCommunity();
  const [unRead, setUnRead] = useState(0);
  const { userInfo } = useAuth();
  registerNNPushToken(6814, "qCQrQQRHQQBajDw6DXo2wO");
  let pushDataObject = getPushDataObject();


  useEffect(() => {
    const url = pushDataObject?.link;
    console.log(pushDataObject);
    if(pushDataObject.link){
      const link = async () => {
        const supported = await Linking.canOpenURL(url);
  
        if (supported) {
          await Linking.openURL(url);
        } else {
          // Alert.alert(`Don't know how to open this URL: ${url}`);
        }
      }; 
      link();
    }
  }, [pushDataObject]);

  useEffect(() => {
    let temp = 0;
    communities
      ?.filter((com) => com.members.includes(userInfo?.email))
      .forEach((com) => {
        temp += com?.messages?.filter((msg) => {
          return !msg?.readBy?.includes(userInfo?.email);
        }).length;
      });
    setUnRead(temp);
  }, [communities]);

  return (
    <Tab.Navigator
      keyboardHidesTabBar={true}
      labeled={true}
      activeColor="#fff"
      inactiveColor="#fff"
      labelStyle={{ fontSize: 12, fontFamily: "regular" }}
      backgroundColor="#000"
      barStyle={{
        backgroundColor: "#000",
        alignItems: "center",
        paddingHorizontal: 10,
      }}
      sceneAnimationType="opacity"
      sceneAnimationEnabled={true}
      shifting
    >
      <Tab.Screen
        name="Chats"
        options={{
          tabBarBadge: unRead > 0 ? unRead : null,
          tabBarBadgeStyle: { backgroundColor: "white", color: "white" },
          tabBarLabel: <Text style={styles.tabBarLabel}>Communities</Text>,
          tabBarIcon: ({ focused, color }) => (
            <IonIcon color={"white"} size={23} name="ios-people-outline" />
          ),
        }}
        component={ChatHome}
      />
      <Tab.Screen
        name="Search"
        options={{
          tabBarLabel: <Text style={styles.tabBarLabel}>Explore</Text>,
          tabBarIcon: ({ focused }) => (
            <AntIcon color={"white"} size={23} name="search1" />
          ),
        }}
        component={SearchPage}
      />
      <Tab.Screen
        name="Create"
        options={{
          tabBarLabel: <Text style={styles.tabBarLabel}>Create</Text>,
          tabBarIcon: ({ focused }) => (
            <IonIcon color={"white"} size={23} name="create-outline" />
          ),
        }}
        component={BSheet}
      />

      <Tab.Screen
        name="Github"
        options={{
          tabBarLabel: <Text style={styles.tabBarLabel}>Github</Text>,
          tabBarIcon: ({ focused }) => (
            <AntIcon color={"white"} size={23} name="github" />
          ),
        }}
        component={Github}
      />

      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: <Text style={styles.tabBarLabel}>Profile</Text>,
          tabBarIcon: ({ focused }) => (
            <FthIcon color={"white"} size={23} name="user" />
          ),
        }}
        component={ProfilePage}
      />
    </Tab.Navigator>
  );
}

const Main = () => {
  const {
    user,
    loading,
    showSheet,
    setShowSheet,
    loadingUser,
    isOffline,
    setOfflineStatus,
  } = useAuth();
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
  tabBarLabel: {
    fontSize: 11,
    textAlign: "center",
    fontFamily: "medium",
    color: "white",
  },
});

export default Main;
