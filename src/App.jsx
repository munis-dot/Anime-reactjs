import { useEffect, useContext, lazy, Suspense } from "react";
import "./App.css";

const Home = lazy(() => import("./Pages/Home"));
const Series = lazy(() => import("./Pages/Series"));
const Search = lazy(() => import("./Pages/Search"));
const Profile = lazy(() => import("./Pages/Profile"));
const MyList = lazy(() => import("./Pages/MyList"));
const SignIn = lazy(() => import("./Pages/SignIn"));
const SignUp = lazy(() => import("./Pages/SignUp"));
const Welcome = lazy(() => import("./Pages/Welcome"));
const ErrorPage = lazy(() => import("./Pages/ErrorPage"));
const Play = lazy(() => import("./Pages/Play"));
const LikedMovies = lazy(() => import("./Pages/LikedMovies"));
const History = lazy(() => import("./Pages/History"));

import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./Context/UserContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Loading from "./componets/Loading/Loading";
import Navbar from "./componets/Header/Navbar";
import NavbarWithoutUser from "./componets/Header/NavbarWithoutUser";
import VideoUploadForm from "./Pages/VideoUpload";
import PaymentScreen from "./componets/payment/PaymentScreen";
import Dashboard from "./Pages/Dashboard";
import Table from "./Pages/Table";
import AdminNav from './components/AdminNav';
import UserList from './components/UserList';
import BannedAccount from "./components/BannedAccount";
import SubscriptionPlans from "./Pages/subscription-plans/SubscriptionPlans";
import PremiumUserManagement from "./Pages/admin/PremiumUserManagement";
import { Toaster } from "react-hot-toast";
import NotificationsScreen from "./Pages/notifications/NotificationsScreen";
function App() {
  const { User, setUser } = useContext(AuthContext);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log(user);
    });
  }, []);

  const path = window.location.pathname

  return (
    <div className="body">
      <Toaster
        toastOptions={{
          style: {
            padding: "1.5rem",
            backgroundColor: "##f4fff4",
            borderLeft: "6px solid green",
          },
        }}
      />
      {User?.email === "admin@gmail.com" ? <AdminNav /> : User ? <Navbar></Navbar> : <NavbarWithoutUser></NavbarWithoutUser>}
      <Suspense replace fallback={<Loading />}>
        <Routes>
          <Route index path="/" element={User ? <Home /> : <Welcome />} />
          {User ? (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/series" element={<Series />} />
              <Route path="/search" element={<Search />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notification" element={<NotificationsScreen />} />
              <Route path="/mylist" element={<MyList />} />
              <Route path="/liked" element={<LikedMovies />} />
              <Route path="/history" element={<History />} />
              <Route path="/payment" element={<SubscriptionPlans />} />
              <Route path="/play/:id" element={<Play />} />
            </>
          ) : null}
          <Route
            path="/admin/*"
            element={
              <>
                <Routes>
                  <Route path="/upload" element={<VideoUploadForm />} />
                  <Route path="/upload/:videoId" element={<VideoUploadForm />} />
                  <Route path="/videos" element={<Table />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/users" element={<UserList />} />
                  <Route path="/premiumUsers" element={<PremiumUserManagement />} />
                </Routes>
              </>
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/bannedAccount" element={<BannedAccount />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
