import { toast } from 'react-toastify';
import { useContext, useEffect, useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { UserContext } from '../context/UserContext';

const Detail = () => {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const {
    logoutCurrentUser,
    currentSessionUser,
    sessionUser: user,
    setSessionUser,
    updateUserDetails
  } = useContext(UserContext);

  const fetchExistsSession = async () => {
    if (!user) {
      const response = await currentSessionUser();
      if (response.success) {
        await setSessionUser(response.data);
      } else {
        navigate("/");
        console.clear();
      }
    }
  }

  useEffect(() => {
    fetchExistsSession();
  });

  /** Handler function for logout user */

  const handleLogoutClick = async (e) => {
    e.preventDefault();
    const response = await logoutCurrentUser();

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    await setSessionUser(null);
    navigate("/");
    console.clear();
  }

  /** Handler state and function for change form */

  const [isActive, setIsActive] = useState(false);

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  /** Handler state and function for update user details */

  const [details, setDetails] = useState({ fullname: user?.fullname, username: user?.username, email: user?.email });
  const { fullname, username, email } = details;

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    startTransition(async () => {
      const response = await updateUserDetails(`/api/user/update/details/${user.id}`, details);

      if (response.success) {
        toast.success(response.message);
        navigate("/");
      } else {
        toast.error(response.message);
        console.clear();
      }
    });
  }

  let isNotChanged = true;

  if (user?.fullname !== fullname || user?.username !== username || user?.email !== email) {
    isNotChanged = false;
  } else {
    isNotChanged = true;
  }

  return (
    <div id="container" className={`container ${isActive ? 'active' : ''}`} >
      <div className="form-container register-form">
        <form onSubmit={handleUpdateSubmit}>
          <h1>Update</h1>
          <span>{user ? user.id : "Your Detail!"}</span>
          <input type="text" placeholder="Fullname" name="fullname" autoComplete="off" required
            onChange={handleUpdateChange} value={fullname || ""} />
          <input type="text" placeholder="Username" name="username" autoComplete="off" required
            onChange={handleUpdateChange} value={username || ""} />
          <input type="email" placeholder="Email" name="email" autoComplete="off" required
            onChange={handleUpdateChange} value={email || ""} />
          <span>Update Your Detail?</span>
          <button type="submit" disabled={isNotChanged || isPending}>Update</button>
        </form>
      </div>
      <div className="form-container login-form">
        <form>
          <h1>Preview</h1>
          <span>{user ? user.id : "Your Detail!"}</span>
          <input type="text" name="preview-fullname" readOnly value={user ? user.fullname : ""} />
          <input type="text" name="preview-username" readOnly value={user ? user.username : ""} />
          <input type="text" name="preview-email" readOnly value={user ? user.email : ""} />
          <input type="text" name="preview-date" readOnly value={user ? user.date : ""} />
          <span>Preview Your Detail?</span>
          <button onClick={handleLogoutClick}>Logout</button>
        </form>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome, Back!</h1>
            <p>Preview your personal detail and info across the site feature!</p>
            <button className="hidden" id="preview-detail" onClick={handleLoginClick}>Preview</button>
            <p>Update your password if there is any type of security issue in your account!</p>
            <button className="hidden" id="update-user-password"
              onClick={() => navigate(`/password?id=${user?.id}`)}>Update</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome, User!</h1>
            <p>Update your personal detail according to your preference for site feature!</p>
            <button className="hidden" id="update-detail" onClick={handleRegisterClick}>Update</button>
            <p>Check all available user and interact with them according to your interest!</p>
            <button className="hidden" id="all-user-details" onClick={() => navigate("/user")}>
              User <FaUsers size={13} />
            </button>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Detail;