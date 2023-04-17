import {
  StyleSheet,
  Text,
  View,
  Animated,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import AntIcon from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native";
import { ImageBackground } from "react-native";
import { useCommunity } from "../contexts/CommunityContext";
import { useAuth } from "../contexts/AuthContext";
import { database } from "../firebase-config";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ActivityIndicator } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";

const CommunityInfo = ({ community, close, navigation }) => {
  const [removing, setRemoving] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const { allUsers } = useCommunity();
  const { userInfo } = useAuth();
  let scrollOffsetY = useRef(new Animated.Value(0)).current;
  const size = scrollOffsetY.interpolate({
    inputRange: [0, 220],
    outputRange: [28, 17],
    extrapolate: "clamp",
  });

  const Header_Max_Height = 210;
  const Header_Min_Height = 70;
  const Scroll_Distance = Header_Max_Height - Header_Min_Height;

  const animatedHeaderHeight = scrollOffsetY.interpolate({
    inputRange: [0, Scroll_Distance],
    outputRange: [Header_Max_Height, Header_Min_Height],
    extrapolate: "clamp",
  });

  const animateOpacity = scrollOffsetY.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const animateRevOpacity = scrollOffsetY.interpolate({
    inputRange: [0, Header_Max_Height - Header_Min_Height],
    outputRange: [0,1],
    extrapolate: "clamp",
  });

  const remove = async (email) => {
    try {
      setRemoving(true);
      const members = [...community?.members];
      const index = members.indexOf(email);
      if (index > -1) {
        members.splice(index, 1);
      }
      await updateDoc(doc(database, "communities", community?.id), {
        members: members,
      }).then(() => {
        setRemoving(false);
      });
    } catch (err) {}
  };
  const leave = async (email) => {
    try {
      setLeaving(true);
      const members = [...community?.members];
      const index = members.indexOf(email);
      if (index > -1) {
        members.splice(index, 1);
      }
      await updateDoc(doc(database, "communities", community?.id), {
        members: members,
      }).then(async () => {
        if (
          community?.members?.filter((u) => u !== userInfo?.email)?.length === 0
        ) {
          await deleteDoc(doc(database, "communities", community?.id)).then(
            () => {
              setLeaving(false);
              navigation.navigate("Chats");
              close();
            }
          );
        } else {
          setLeaving(false);
          navigation.navigate("Chats");
          close();
        }
      });
    } catch (err) {}
  };

  return (
    <View>
      <Animated.View
        style={{
          height: animatedHeaderHeight,
          overflow: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          minHeight: 80,
          zIndex: 1,
          backgroundColor: "black",
        }}
      >
        <ImageBackground
          source={{ uri: community?.profileImage }}
          style={[
            {
              width: "100%",
              height: "100%",
              filter: "brightness(0.3)",
            },
          ]}
          resizeMode={"cover"}
        >
          <Animated.View
            style={[
              {
                width: "100%",
                height: "100%",
                position: "relative",
                backgroundColor:
                  community?.profileImage ==
                  "https://cdn.raceroster.com/assets/images/team-placeholder.png"
                    ? `rgba(0,0,0,.9)`
                    : `rgba(0,0,0,.6)`,
                padding: 15,
                justifyContent: "flex-end",
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => close()}
              style={{
                position: "absolute",
                top: 15,
                left: 15,
                zIndex: 3,
                width: 50,
                height: 50,
                backgroundColor: "rgba(0,0,0,0.6)",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 40,
              }}
            >
              <AntIcon name="arrowleft" size={20} color={"white"} />
            </TouchableOpacity>
            <Animated.Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={[
                {
                  fontSize: 28,
                  color: "white",
                  fontFamily: "bold",
                  maxWidth: "100%",
                  width: "100%",
                  opacity:animateOpacity
                },
              ]}
            >
              {community?.name}
            </Animated.Text>
            <Animated.Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={[
                {
                  fontSize: 18,
                  color: "white",
                  fontFamily: "bold",
                  maxWidth: "100%",
                  width: "100%",
                  top:0,
                  position:"absolute",
                  left:80, 
                  top:30,
                  opacity:animateRevOpacity
                },
              ]}
            >
              {community?.name}
            </Animated.Text>
          </Animated.View>
        </ImageBackground>
      </Animated.View>
      <ScrollView
        contentContainerStyle={{ paddingTop: 210 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={{ padding: 20 }}>
          <Text style={{ fontFamily: "bold", fontSize: 17 }}>Description</Text>
          <Text style={{ fontFamily: "regular", fontSize: 14, padding: 10 }}>
            {community?.description}
          </Text>
          <Text style={{ fontFamily: "bold", fontSize: 17, paddingTop: 10 }}>
            Created
          </Text>
          <Text style={{ fontFamily: "regular", fontSize: 14, padding: 10 }}>
            {community?.createdAt?.split(" ")[0]} at{" "}
            {community?.createdAt?.split(" ")[1]}{" "}
            {community?.createdAt?.split(" ")[2]}
          </Text>
          
          <Text
            style={{
              fontFamily: "bold",
              fontSize: 17,
              paddingTop: 10,
              paddingBottom: 15,
            }}
          >
            Members
          </Text>
          {allUsers
            ?.filter((user) => community?.members?.includes(user.email))
            ?.sort((a, b) => {
              if (a.email === community.creator) return -1;
              if (b.email === community.creator) return 1;
              return 0;
            })
            ?.map((data) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingBottom: 13,
                    justifyContent: "space-between",
                  }}
                  key={data?.email}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      columnGap: 13,
                    }}
                  >
                    <Image
                      style={{ width: 45, height: 45, borderRadius: 45 }}
                      source={{ uri: data?.profileImage }}
                    />
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          columnGap: 2,
                        }}
                      >
                        <Text style={{ fontFamily: "medium", fontSize: 16 }}>
                          {data?.userName}
                        </Text>
                        {userInfo?.email == data?.email && (
                          <Text
                            style={{
                              fontFamily: "regular",
                              fontSize: 10,
                              opacity: 0.6,
                            }}
                          >
                            {"(you)"}
                          </Text>
                        )}
                      </View>
                      <Text
                        style={{
                          fontFamily: "regular",
                          fontSize: 12,
                          opacity: 0.7,
                        }}
                      >
                        {data?.email}
                      </Text>
                    </View>
                  </View>
                  {userInfo?.email == community?.creator &&
                    data?.email != community?.creator &&
                    (removing ? (
                      <ActivityIndicator color={"red"} />
                    ) : (
                      <TouchableOpacity
                        disabled={removing}
                        onPress={() => remove(data?.email)}
                        style={[
                          {
                            borderWidth: 1,
                            borderColor: "red",
                            padding: 5,
                            paddingHorizontal: 7,
                            borderRadius: 4,
                            alignItems: "center",
                            justifyContent: "center",
                          },
                          removing && { opacity: 0.5 },
                        ]}
                      >
                        <Text
                          style={{
                            fontFamily: "medium",
                            fontSize: 13,
                            color: "red",
                          }}
                        >
                          Remove
                        </Text>
                      </TouchableOpacity>
                    ))}
                  {data?.email == community?.creator && (
                    <Text style={{ fontFamily: "medium", fontSize: 13 }}>
                      Creator
                    </Text>
                  )}
                </View>
              );
            })}
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              columnGap: 10,
              paddingVertical: 10,
              marginTop: 10,
              justifyContent: "center",
            }}
          >
            {leaving ? (
              <ActivityIndicator color={"red"} />
            ) : (
              <TouchableOpacity
                onPress={() => leave(userInfo?.email)}
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  columnGap: 10,
                }}
              >
                <IonIcon
                  size={23}
                  color={"red"}
                  name="md-arrow-back-circle-outline"
                />
                <Text
                  style={{ fontSize: 16, color: "red", fontFamily: "medium" }}
                >
                  Leave Community
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CommunityInfo;

const styles = StyleSheet.create({});
