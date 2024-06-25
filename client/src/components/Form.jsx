import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useContext, useState, useTransition, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaGooglePlusG, FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { UserContext } from '../context/UserContext';
import { useDebounce } from '../hooks/useDebounce';

const Form = () => {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const {
    registerLoginUser,
    currentSessionUser,
    sessionUser,
    setSessionUser
  } = useContext(UserContext);

  const fetchExistsSession = useCallback(async () => {
    if (!sessionUser) {
      const response = await currentSessionUser();
      if (response.success) {
        await setSessionUser(response.data);
        navigate("/detail");
      } else {
        console.clear();
      }
    }
  }, [currentSessionUser, sessionUser, setSessionUser, navigate]);

  const debouncedChangeHandler = useDebounce(async () => {
    fetchExistsSession();
  }, 1000);

  useEffect(() => {
    debouncedChangeHandler();
  });

  /** Handler state and function for change form */

  const [isActive, setIsActive] = useState(false);

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  /** Handler state and function for register user */

  const initialState = { fullname: "", username: "", email: "", password: "" };
  const [details, setDetails] = useState(initialState);
  const { fullname, username, email, password } = details;

  const handleRegisterChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    startTransition(async () => {
      const response = await registerLoginUser("/api/user/register", details);

      if (response.success) {
        toast.success(response.message);
        setDetails(initialState);
      } else {
        toast.error(response.message);
        console.clear();
      }
    });
  }

  /** Handler state and function for login user */

  const loginInitial = { loginCredential: "", loginPassword: "" };
  const [loginDetails, setLoginDetails] = useState(loginInitial);
  const { loginCredential, loginPassword } = loginDetails;

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const credential = { "username": loginCredential, "email": loginCredential, "password": loginPassword };

    startTransition(async () => {
      const response = await registerLoginUser("/api/user/login", credential);

      if (response.success) {
        toast.success(response.message);
        await setSessionUser(response.data);
        setLoginDetails(loginInitial);
        navigate("/user");
      } else {
        toast.error(response.message);
        console.clear();
      }
    });
  }

  return (
    <div id="container" className={`container ${isActive ? 'active' : ''}`} >
      <div className="form-container register-form">
        <form onSubmit={handleRegisterSubmit}>
          <h1>Register</h1>
          <div className="social-icons">
            <Link to="#" className="icon"><FaGooglePlusG /></Link>
            <Link to="#" className="icon"><FaFacebookF /></Link>
            <Link to="#" className="icon"><FaGithub /></Link>
            <Link to="#" className="icon"><FaLinkedinIn /></Link>
          </div>
          <span>or use your details for registration</span>
          <input type="text" placeholder="Fullname" name="fullname" autoComplete="off" required
            onChange={handleRegisterChange} value={fullname || ''} />
          <input type="text" placeholder="Username" name="username" autoComplete="off" required
            onChange={handleRegisterChange} value={username || ''} />
          <input type="email" placeholder="Email" name="email" autoComplete="off" required
            onChange={handleRegisterChange} value={email || ''} />
          <input type="password" placeholder="Password" name="password" autoComplete="off" required
            onChange={handleRegisterChange} value={password || ''} />
          <button type="submit" disabled={isPending} >Register</button>
        </form>
      </div>
      <div className="form-container login-form">
        <form onSubmit={handleLoginSubmit}>
          <h1>Login</h1>
          <div className="social-icons">
            <Link to="#" className="icon"><FaGooglePlusG /></Link>
            <Link to="#" className="icon"><FaFacebookF /></Link>
            <Link to="#" className="icon"><FaGithub /></Link>
            <Link to="#" className="icon"><FaLinkedinIn /></Link>
          </div>
          <span>or use your username or email password</span>
          <input type="text" placeholder="Username or Email" name="loginCredential" autoComplete="off" required
            onChange={handleLoginChange} value={loginCredential || ''} />
          <input type="password" placeholder="Password" name="loginPassword" autoComplete="off" required
            onChange={handleLoginChange} value={loginPassword || ''} />
          <Link to="/forget">Forget Your Password?</Link>
          <button type="submit" disabled={isPending}>Login</button>
        </form>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome, Back!</h1>
            <p>Enter your personal details to use all of site features!</p>
            <button className="hidden" id="login" onClick={handleLoginClick}>Login</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome, Friend!</h1>
            <p>Enter your personal details to use all of site features!</p>
            <button className="hidden" id="register" onClick={handleRegisterClick}>Register</button>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Form;