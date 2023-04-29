import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
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
  const [time, setTime] = useState("")
  
  useEffect(() => {
    
      const interval = setInterval(()=>{
        const date = new Date(recentMessage[2]);
      const hours = date.getHours() % 12 || 12; // Get hours in 12-hour format
      const minutes = date.getMinutes();
      const ampm = date.getHours() >= 12 ? 'pm' : 'am';
    
      // Calculate time difference in milliseconds
      const diffTime = Date.now() - date.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
      const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    
     
      if (diffDays < 1) {
        setTime(`${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`)
      } else if (diffDays === 1) {
        setTime('Yesterday')
      } else if (diffDays < 7) {
        setTime(`${diffDays}d`)
      } else if (diffWeeks === 1) {
        setTime("1w")
      } else if (diffWeeks < 4) {
        setTime(`${diffWeeks}w`);
      } else if (diffMonths === 1) {
        setTime("1mth")
      } else if (diffMonths < 12) {
        setTime(`${diffMonths}m`)
      } else if (diffYears === 1) {
        setTime("1yr")
      } else {
        setTime(`${diffYears}yrs`);
      }
      }, 1000);

      return ()=>{
        clearInterval(interval)
      }
    
  }, [recentMessage[2]])
  
  
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
        <Text style={{
                      fontFamily: "regular",
                      fontSize: 11.5,
                      opacity: 0.8,}}>{time}</Text>
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
