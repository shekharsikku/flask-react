import { Routes, Route } from "react-router-dom";
import { Form, Detail, Password, Forget, NotFound, User, Post } from "./components";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/password" element={<Password />} />
        <Route path="/user" element={<User />} />
        <Route path="/post" element={<Post />} />
        <Route path="/forget" element={<Forget />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App;