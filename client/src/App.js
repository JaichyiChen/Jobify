import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Error, Register, Landing, ProtectedRoute } from "./pages";
import {
  AddJob,
  AllJob,
  Profile,
  SharedLayout,
  Stats,
} from "./pages/dashboard";
//nest routing requires outlet so the parent can render child path
//stats will be the front page using the index keyword
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout></SharedLayout>
            </ProtectedRoute>
          }
        >
          <Route index element={<Stats></Stats>}></Route>
          <Route path="all-jobs" element={<AllJob></AllJob>}></Route>
          <Route path="add-job" element={<AddJob></AddJob>}></Route>
          <Route path="profile" element={<Profile></Profile>}></Route>
        </Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/landing" element={<Landing></Landing>}></Route>
        <Route path="*" element={<Error />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
