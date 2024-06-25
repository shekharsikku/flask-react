import { Link } from "react-router-dom";
// import Debounce from "./debounce/Debounce";
// import Decode from "./decode/Decode";
import Location from "./location/Location";

const Forget = () => {
  return (
    <div id="container" className={`container`} >
      <p>Soon forget password reset feature will be add!</p>
      <Link to="/" className="home-button">Home Page</Link>
      <Location />
    </div>
  )
}

export default Forget;