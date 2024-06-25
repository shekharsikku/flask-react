import { toast } from 'react-toastify';
import { useContext, useState, useEffect, useTransition } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext';
import { FaUsers } from 'react-icons/fa';

const Password = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [isPending, startTransition] = useTransition();
  const {
    currentSessionUser,
    updateUserDetails,
    sessionUser: user,
    setSessionUser,
    deleteUserDetails,
  } = useContext(UserContext);

  const getQueryParam = () => {
    const params = new URLSearchParams(location.search);
    setId(params.get("id"));
  };

  useEffect(() => {
    getQueryParam();
  });

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

  /** Handler state and function for change form */

  const [isActive, setIsActive] = useState(false);

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  /** Handler state and function for update user details */

  const [details, setDetails] = useState({ old_password: "", new_password: "", confirm_password: "" });
  const { old_password, new_password, confirm_password } = details;

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    startTransition(async () => {
      const response = await updateUserDetails(`/api/user/update/password/${id}`, details);

      if (response.success) {
        toast.success(response.message);
        navigate("/");
      } else {
        toast.error(response.message);
        console.clear();
      }
    });
  }

  /** Handler state and function for delete user details */

  const [passwordDetails, setPasswordDetails] = useState({ user_password: "", confirm_user_password: "" });
  const { user_password, confirm_user_password } = passwordDetails;

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordDetails({ ...passwordDetails, [name]: value });
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();

    startTransition(async () => {
      const response = await deleteUserDetails(id, passwordDetails);

      if (response.success) {
        toast.success(response.message);
        setPasswordDetails(null);
        navigate("/");
      } else {
        toast.error(response.message);
        console.clear();
      }
    });
  }

  return (
    <div id="container" className={`container ${isActive ? 'active' : ''}`} >
      <div className="form-container register-form">
        <form onSubmit={handleDeleteSubmit}>
          <h1>Delete</h1>
          <span>{id}</span>
          <input type="password" placeholder="User Password" name="user_password" autoComplete="off" required
            onChange={handlePasswordChange} value={user_password || ""} />
          <input type="password" placeholder="Confirm User Password" name="confirm_user_password" autoComplete="off" required onChange={handlePasswordChange} value={confirm_user_password || ""} />
          <span>Delete Your Account?</span>
          <button type="submit" disabled={isPending}>Delete</button>
        </form>
      </div>
      <div className="form-container login-form">
        <form onSubmit={handleUpdateSubmit}>
          <h1>Password</h1>
          <span>{id}</span>
          <input type="password" placeholder="Old Password" name="old_password" autoComplete="off" required
            onChange={handleUpdateChange} value={old_password || ""} />
          <input type="password" placeholder="New Password" name="new_password" autoComplete="off" required
            onChange={handleUpdateChange} value={new_password || ""} />
          <input type="password" placeholder="Confirm Password" name="confirm_password" autoComplete="off" required
            onChange={handleUpdateChange} value={confirm_password || ""} />
          <span>Change Your Password?</span>
          <button type="submit" disabled={isPending}>Update</button>
        </form>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome, Back!</h1>
            <p>Update your password if there is any security issues!</p>
            <button className="hidden" id="update-password" onClick={handleLoginClick}>Update</button>
            <p>Check all available user and interact with them according to your interest!</p>
            <button className="hidden" id="all-user-details" onClick={() => navigate("/user")}>
              User <FaUsers size={13} />
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome, User!</h1>
            <p>Delete your personal details and info if you don&apos;t want to use site!</p>
            <button className="hidden" id="delete-detail" onClick={handleRegisterClick}>Delete</button>
            <p>Preview your personal detail and info across the site feature!</p>
            <button className="hidden" id="details-preview" onClick={() => navigate("/detail")}>Detail</button>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Password;