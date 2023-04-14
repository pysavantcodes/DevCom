import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Animated,
  Alert
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import IonIcon from "react-native-vector-icons/Ionicons";
import AntIcon from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { useAuth } from "../contexts/AuthContext";
import ShimmerLoader from "../components/ShimmerLoader";
import CommunityCard from "../components/CommunityCard";
import { useCommunity } from "../contexts/CommunityContext";
import { log } from "react-native-reanimated";
import { FlatList } from "react-native";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { database } from "../firebase-config";
import { Image } from "react-native";

const { height, width } = Dimensions.get("screen");
const ChatHome = ({ navigation }) => {
  const { userInfo } = useAuth();
  const { loadingCommunities, communities, fetchCommunities } = useCommunity();
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectable, setSelectable] = useState(false);
  const [myCommunities, setMyCommunities] = useState([]);

  const leaveCommunity = ()=>{
    Alert.alert(`Dismiss ${selectedItems.length > 1 ? "communities?" : "community?"}`, `Are you sure you want to leave ${selectedItems.length > 1 ? "these" : "this"} ${selectedItems.length > 1 ? "communities?" : "community?"}`, [
      {
        text: 'NO',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'YES', onPress: () => {
        selectedItems.forEach(async(item)=>{
          const dt = communities?.filter((el)=>el?.id == item)[0]
          await updateDoc(doc(database, "communities", item),{
            members: dt?.members?.filter((u)=>u !== userInfo?.email)
          }).then(async()=>{
            console.log(dt?.members);
            if(dt?.members?.filter((u)=>u !== userInfo?.email)?.length === 0){
              await deleteDoc(doc(database, "communities", item)).then(()=>{
                setSelectedItems([])
              });
            }else{
              setSelectedItems([])
            }
            
          })
        })
      }},
    ]);
  }

  const handlePress = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  const handleLongPress = (item) => {
    if (!selectedItems.includes(item)) {
      setSelectable(true);
      setSelectedItems([...selectedItems, item]);
      
    }
  };

  useEffect(() => {
    setMyCommunities(
      communities.filter((com) => com.members.includes(userInfo?.email))
    );
  }, [communities, userInfo]);

  useEffect(() => {
    if (selectedItems.length < 1) {
      setSelectable(false);
    }
  }, [selectedItems]);

  return (
    <View style={{ flex: 1, height, backgroundColor: "black" }}>
      <SafeAreaView style={[styles.container]}>
        <Animated.View
          style={{
            paddingVertical: 17,
            zIndex: 9,
          }}
        >
          <View style={[styles.head]}>
            {selectable ? (
              <>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedItems([]);
                      setSelectable(false);
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: "rgba(255,255,255,0.08)",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 40,
                    }}
                  >
                    <AntIcon name="arrowleft" size={20} color={"white"} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: "medium",
                      fontSize: 17,
                      marginLeft: 10,
                      color:"white"
                    }}
                  >
                    {selectedItems.length}
                  </Text>
                </View>
                <TouchableOpacity
                onPress={()=>leaveCommunity()}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 40,
                  }}
                >
                  <Feather name="trash-2" size={20} color={"white"} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Animated.Text
                  style={{ fontFamily: "bold", fontSize: 20, opacity: 1, color:"white" }}
                >
                  My Communities
                </Animated.Text>
                <TouchableOpacity onPress={() => navigation.navigate("Search")}>
                  <IonIcon name="ios-search-outline" size={25} color={"white"}/>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>

        {loadingCommunities ? (
          <View style={{ paddingTop: 5, backgroundColor:"white", flex:1, borderTopLeftRadius:20, borderTopRightRadius:20 }}>
            <ShimmerLoader />
            <ShimmerLoader />
            <ShimmerLoader />
            <ShimmerLoader />
            <ShimmerLoader />
            <ShimmerLoader />
          </View>
        ) : (
          <View style={{backgroundColor:"white", flex:1, borderTopLeftRadius:20, borderTopRightRadius:20}}>
            <FlatList
          
            data={myCommunities.sort((a,b)=> new Date(b?.messages[b?.messages?.length -1]?.time) - new Date(a?.messages[a?.messages?.length -1]?.time))}
            overScrollMode={"never"}
            bounces
            refreshControl={
              <RefreshControl
                refreshing={myCommunities ? false : true}
                onRefresh={() => fetchCommunities()}
              />
            }
            ListEmptyComponent={() => (
              <View
                style={{
                  width: "100%",
                  height: height *0.69,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image style={{width:"100%", height:"45%", resizeMode:"contain",}} source={{uri:"https://user-images.githubusercontent.com/110984357/232028939-ad98af03-376f-40fc-91f5-4c298a4a3913.png"}}/>
                <Text style={{ fontFamily: "bold", fontSize: 19 }}>
                  No Community Found
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    columnGap: 5,
                    opacity: 0.6,
                    paddingVertical: 3,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontFamily: "medium" }}>
                    Create or Join a community!!
                  </Text>
                </View>
              </View>
            )}
            keyExtractor={(item) => {
              return item.id.toString();
            }}
            renderItem={({ item, index }) => (
              <CommunityCard
                longPressed={() => handleLongPress(item.id)}
                name={item.name}
                image={item.profileImage}
                keyProp={item.id}
                recentMessage={[
                  item?.messages?.at(-1)?.sender,
                  item?.messages?.at(-1)?.message,
                ]}
                selected={selectedItems.includes(item.id) ? true : false}
                clicked={() =>
                  selectable
                    ? handlePress(item.id)
                    : navigation.navigate("ChatScreen", { id: item.id })
                }
                unRead={
                  item?.messages?.filter((msg)=>{
                   return !msg?.readBy?.includes(userInfo?.email)
                  }).length
                }
              />
              
            )}
          />
          </View>
        )}

        {/* <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            overflow: "hidden",
            flexDirection: "column",
          }}
          overScrollMode={"never"}
          horizontal={false}
        >
          {myCommunities.length !== 0 &&
            myCommunities.map((data, index) => {
              return (
                <CommunityCard
                  longPressed={() => handleLongPress(data.id)}
                  name={data.name}
                  image={data.profileImage}
                  keyProp={index}
                  selected={selectedItems.includes(data.id) ? true : false}
                  clicked={() =>
                    selectable
                      ? handlePress(data.id)
                      : navigation.navigate("ChatScreen",{ id:data.id})
                  }
                />
              );
            })}
        </ScrollView> */}
      </SafeAreaView>
    </View>
  );
};

export default ChatHome;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",

    flex: 1,
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginVertical: 17,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.06)",
    overflow: "hidden",
    marginHorizontal: 20,
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    padding: 20,
  },
  deleteButtonText: {
    color: "#fff",
  },
});
