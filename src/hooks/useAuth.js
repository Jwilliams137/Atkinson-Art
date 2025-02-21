import { useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isUserAllowed, setIsUserAllowed] = useState(false);
  const [restrictedUsers, setRestrictedUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        fetch('/api/restricted-users')
          .then(response => response.json())
          .then(data => {
            setRestrictedUsers(data.restrictedUsers);
            setIsUserAllowed(data.restrictedUsers.includes(currentUser.email));
          })
          .catch(error => console.error("Error fetching restricted users:", error));
      } else {
        setIsUserAllowed(false);
        setRestrictedUsers([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, isUserAllowed, restrictedUsers };
};

export default useAuth;