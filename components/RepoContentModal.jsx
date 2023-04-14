import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

const RepoContentModal = ({ repoName, repoOwner, isOpen, onClose }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [content, setContent] = useState([]);
  const [folderContent, setFolderContent] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const fetchRepoContent = async () => {
      setLoadingData(true);
      const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents`;
      const response = await fetch(url);
      const data = await response.json();
      setContent(data);
      setLoadingData(false);
    };
    fetchRepoContent();
  }, []);

  const handleFolderClick = async (item) => {
    if (item.type === "dir") {
      setLoadingData(true);
      const url = item.url;
      const response = await fetch(url);
      const data = await response.json();
      setFolderContent({ data, path: item.path });
      setLoadingData(false);
    }
  };

  const handleFileClick = async (item) => {
    if (item.type === "file") {
      const url = item.download_url;
      setLoadingData(true);
      const response = await fetch(url);
      const data = await response.text();
      
      if (data.length > 1024 * 102) {
        setSelectedItem({ data: "File size too large", path: item.path });
        setLoadingData(false);
      } else {
        setSelectedItem({ data, path: item.path });
        setLoadingData(false);
      }
    }
  };

  return (
    <Modal
      onRequestClose={() => onClose()}
      visible={isOpen}
      animationType="slide"
    >
      <View
        style={{
          backgroundColor: "white",
          padding: 20,
          flex: 1,
          paddingBottom: 0,
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            columnGap: 15,
          }}
        >
          <View
            style={{
              opacity: 0.8,
              backgroundColor: "rgba(0,0,0,0.09)",
              overflow: "scroll",
              borderRadius: 6,
              maxWidth: "91%",
            }}
          >
            <ScrollView
              contentContainerStyle={{
                padding: 8,
              }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              overScrollMode="never"
            >
              <Text style={{ fontSize: 13.5, fontFamily: "medium" }}>
                {repoOwner} {">"} {repoName}
              </Text>
            </ScrollView>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Feather name="chevron-down" size={24} />
          </TouchableOpacity>
        </View>
        <ScrollView
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10 }}
        >
          {!content && !loadingData ? (
            <Text>No Data found</Text>
          ) : loadingData ? (
            <View style={{paddingVertical:20}}>
              <ActivityIndicator color="black" size={25} />
            </View>
          ) : (
            content.map((item) => (
              <TouchableOpacity
                key={item.sha}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 15,
                  columnGap: 10,
                  borderBottomColor: "rgba(0,0,0,0.07)",
                  borderBottomWidth: 1,
                  padding: 13,
                }}
                onPress={() => {
                  if (item.type === "dir") {
                    handleFolderClick(item);
                  } else {
                    handleFileClick(item);
                  }
                }}
              >
                <Feather
                  name={item.type === "dir" ? "folder" : "file-text"}
                  size={17}
                />
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={{
                    fontFamily: "medium",
                    fontSize: 14,
                    maxWidth: "70%",
                  }}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      <Modal
        onRequestClose={() => setSelectedItem(null)}
        visible={selectedItem ? true : false}
        animationType="slide"
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            flex: 1,
            paddingBottom: 60,
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              columnGap: 15,
            }}
          >
            <View
              style={{
                opacity: 0.8,
                backgroundColor: "rgba(0,0,0,0.09)",
                overflow: "scroll",
                borderRadius: 6,
                maxWidth: "91%",
              }}
            >
              <ScrollView
                contentContainerStyle={{
                  padding: 8,
                }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                overScrollMode="never"
              >
                <Text style={{ fontSize: 13.5, fontFamily: "medium" }}>
                  {selectedItem?.path?.replace("/", " > ")}
                </Text>
              </ScrollView>
            </View>
            <TouchableOpacity onPress={() => setSelectedItem(null)}>
              <Feather name="chevron-down" size={24} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.05)",
              marginTop: 20,
              borderRadius: 7,
            }}
          >
            <ScrollView
              overScrollMode="never"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 10 }}
            >
              <Text
                selectable={true}
                style={{ opacity: 0.9, fontFamily: "code" }}
                selectionColor={"rgba(0,0,0,0.1)"}
              >
                {selectedItem?.data}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        onRequestClose={() => setFolderContent(null)}
        visible={folderContent ? true : false}
        animationType="slide"
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            flex: 1,
            paddingBottom: 0,
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              columnGap: 15,
            }}
          >
            <View
              style={{
                opacity: 0.8,
                backgroundColor: "rgba(0,0,0,0.09)",
                overflow: "scroll",
                borderRadius: 6,
                maxWidth: "91%",
              }}
            >
              <ScrollView
                contentContainerStyle={{
                  padding: 8,
                }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                overScrollMode="never"
              >
                <Text style={{ fontSize: 13.5, fontFamily: "medium" }}>
                  {repoOwner} {">"} {repoName} {">"}{" "}
                  {folderContent?.path?.replace("/", " > ")}
                </Text>
              </ScrollView>
            </View>
            <TouchableOpacity onPress={() => setFolderContent(null)}>
              <Feather name="chevron-down" size={24} />
            </TouchableOpacity>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 10 }}
          >
            {!folderContent && !loadingData ? (
              <View style={{paddingVertical:20}}>
              <Text style={{fontSize:15, fontFamily:"medium"}}>No content found</Text>
            </View>
            ) : loadingData ? (
              <View style={{paddingVertical:20}}>
              <ActivityIndicator color="black" size={25} />
            </View>
            ) : (
              folderContent?.data?.map((item) => (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 15,
                    columnGap: 10,
                    borderBottomColor: "rgba(0,0,0,0.07)",
                    borderBottomWidth: 1,
                    padding: 13,
                  }}
                  key={item.sha}
                  onPress={() => {
                    if (item.type === "dir") {
                      handleFolderClick(item);
                    } else {
                      handleFileClick(item);
                    }
                  }}
                >
                  <Feather
                    name={item.type === "dir" ? "folder" : "file-text"}
                    size={17}
                  />
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={{
                      fontFamily: "medium",
                      fontSize: 14,
                      maxWidth: "70%",
                    }}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>
    </Modal>
  );
};

export default RepoContentModal;
