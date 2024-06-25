import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404 Not Found</h1>
      <p>The page you&apos;re looking for is does n&apos;t exist!</p>
      <Link to="/"> Home Page</Link>
    </div>
  )
}

export default NotFound;