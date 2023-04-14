import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { TouchableOpacity, TouchableNativeFeedback } from "react-native";
import { Image } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useAuth } from "../contexts/AuthContext";
import { useCommunity } from "../contexts/CommunityContext";

const CommunityCard = ({
  name,
  image,
  keyProp,
  longPressed,
  clicked,
  selected,
  recentMessage,
  unRead
}) => {
  const { userInfo } = useAuth();
  const { allUsers } = useCommunity();
  const user = allUsers.filter((user) => user.email === recentMessage[0]);
  
  return (
    <TouchableNativeFeedback
      onPress={() => clicked()}
      onLongPress={() => longPressed()}
      delayLongPress={200}
      key={keyProp}
    >
      <View
        style={[
          styles.container,
          { ...(selected && { backgroundColor: "rgba(0,0,0,0.06)" }) },
        ]}
      >
        {selected ? (
          <View
            style={[
              styles.image,
              {
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "black",
              },
            ]}
          >
            <Feather name="check" color={"white"} size={20} />
          </View>
        ) : (
          <Image
            source={{
              uri: image,
            }}
            style={[styles.image, { resizeMode: "cover" }]}
          />
        )}

        <View style={{ flex: 1 }}>
          <Text
            style={{ fontFamily: "medium", fontSize: 15, maxWidth: "90%" }}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text
            style={{
              fontFamily: unRead == 0 ? "regular" : "bold",
              fontSize: 12,
              opacity: unRead == 0 ? 0.7 : 1,
              maxWidth: "80%",

            }}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {!recentMessage[0]
              ? "No recent messages"
              : user[0]?.email === userInfo.email
              ? `You: ${recentMessage[1]}`
              : `${user[0]?.userName}: ${recentMessage[1]}`}
          </Text>
        </View>
        {unRead !== 0 && <View
          style={{
            backgroundColor: "black",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
            height:25, width:25
          }}
        >
          <Text style={{ color: "white", textAlign: "center", fontSize:11 }}>{unRead}</Text>
        </View>}
      </View>
    </TouchableNativeFeedback>
  );
};

export default CommunityCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.8,
    borderBottomColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 20,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#d9d9d9",
    marginRight: 16,
  },
});
