import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);
  const [tokenExpired, setTokenExpired] = useState(true);

  useEffect(() => {
    /** Change name of cookies that you want to decode from your browser */
    const token = Cookies.get("cookie_name");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);

        const isExpired = Date.now() > decoded.exp * 1000;
        setTokenExpired(isExpired);

        if (!isExpired) {
          setCurrentUser(decoded.sub);
        }
      } catch (error) {
        console.error(`Failed to decode token ${error.message}`);
        setDecodedToken(null);
        setTokenExpired(true);
      }
    }
  }, []);

  return { currentUser, decodedToken, tokenExpired };
};

export { useCurrentUser };
