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

const CommunityContext = React.createContext();
export const useCommunity = () => {
  return useContext(CommunityContext);
};

const CommunityProvider = ({ children }) => {
  const [communities, setCommunities] = useState([]);
  const [loadingCommunities, setLoadingCommunities] = useState(false);
  const [allUsers, setAllUsers] = useState([])
  const [selectedCommunity, setSelectedCommunity] = useState({});

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
      });
      
    } catch (err) {
      setLoadingCommunities(false);
    }
  };

  useEffect(() => {
    
    fetchCommunities();
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
    <CommunityContext.Provider value={{ allUsers,communities, loadingCommunities, selectedCommunity, setSelectedCommunity, fetchCommunities }}>
      {children}
    </CommunityContext.Provider>
  );
};

export default CommunityProvider;
