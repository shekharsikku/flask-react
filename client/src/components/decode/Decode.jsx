import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

const Decode = () => {
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    const token = Cookies.get('access_token_cookie');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, []);

  const all_tokens = Cookies.get();

  console.log(all_tokens);

  return (
    <div>
      {/* {decodedToken ? (
        <div>
          <h1>Decoded JWT</h1>
          <pre>{JSON.stringify(decodedToken, null, 2)}</pre>
        </div>
      ) : (
        <p>No token found or failed to decode token.</p>
      )} */}

      {decodedToken ? (
        <div>
          <h1>Decoded JWT</h1>
          <p><strong>Fresh:</strong> {decodedToken.fresh ? 'true' : 'false'}</p>
          <p><strong>Issued At:</strong> {new Date(decodedToken.iat * 1000).toLocaleString()}</p>
          <p><strong>JTI:</strong> {decodedToken.jti}</p>
          <p><strong>Type:</strong> {decodedToken.type}</p>
          <p><strong>Subject:</strong> {decodedToken.sub}</p>
          <p><strong>Not Before:</strong> {new Date(decodedToken.nbf * 1000).toLocaleString()}</p>
          <p><strong>CSRF:</strong> {decodedToken.csrf}</p>
          <p><strong>Expiration:</strong> {new Date(decodedToken.exp * 1000).toLocaleString()}</p>
        </div>
      ) : (
        <p>No token found or failed to decode token.</p>
      )}
    </div>
  );
};

export default Decode;
