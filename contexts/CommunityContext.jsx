import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { database } from "../firebase-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import NetInfo from "@react-native-community/netinfo";

const CommunityContext = React.createContext();
export const useCommunity = () => {
  return useContext(CommunityContext);
};

const CommunityProvider = ({ children }) => {
  const [communities, setCommunities] = useState([]);
  const [loadingCommunities, setLoadingCommunities] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState({});
  const { isOffline } = useAuth();

  const fetchCommunities = async () => {
    setLoadingCommunities(true);
    try {
      const q = await query(collection(database, "communities"));
      const unsubscribe = await onSnapshot(q, (querySnapshot) => {
        const tempCom = [];
        querySnapshot.forEach((doc) => {
          tempCom.push(doc.data());
        });
        setCommunities(tempCom);
        setLoadingCommunities(false);
        AsyncStorage.setItem("communities", JSON.stringify(tempCom));
      });
    } catch (err) {
      setLoadingCommunities(false);
      const storedCommunities = await AsyncStorage.getItem("communities");
      if (storedCommunities) {
        const communitiesData = JSON.parse(storedCommunities);
        setCommunities(communitiesData);
      }
    }
  };

  useEffect(() => {
    const setOfflineData = async () => {
      if (isOffline) {
        setLoadingCommunities(true);
        const storedCommunities = await AsyncStorage.getItem("communities");
        if (storedCommunities) {
          const communitiesData = JSON.parse(storedCommunities);
          setCommunities(communitiesData);
          setLoadingCommunities(false);
          console.log(communitiesData);
        }
      } else {
        fetchCommunities();
      }
    };
    setOfflineData();
  }, [database]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const q = await query(collection(database, "users"));
        const unsubscribe = await onSnapshot(q, (querySnapshot) => {
          const tempCom = [];
          querySnapshot.forEach((doc) => {
            tempCom.push(doc.data());
          });
          setAllUsers(tempCom);
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllUsers();
  }, [database]);

  return (
    <CommunityContext.Provider
      value={{
        allUsers,
        communities,
        loadingCommunities,
        selectedCommunity,
        setSelectedCommunity,
        fetchCommunities,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export default CommunityProvider;
