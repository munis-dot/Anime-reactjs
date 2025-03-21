import React, { useState, useContext, useEffect, useRef } from "react";
import { getAuth, updateProfile, signOut } from "firebase/auth";
import { db } from "../Firebase/FirebaseConfig";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { Fade } from "react-reveal";
import toast, { Toaster } from "react-hot-toast";

import { AuthContext } from "../Context/UserContext";
import WelcomePageBanner from "../images/WelcomePageBanner.jpg";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { fetchDocumentById } from "@/lib/utils";
import { premiumUrl } from "@/Constants/Constance";
import { doc, updateDoc } from "firebase/firestore";

function Profile() {
  const { User } = useContext(AuthContext);

  const [profilePic, setProfilePic] = useState("");
  const [isUserNameChanged, setIsUserNameChanged] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (User != null) {
      setProfilePic(User.photoURL);
      fetchDocumentById('Users', User.uid).then((res) => {
        setFormData(res)
      })
    }
  }, []);

  function notify() {
    toast.success("Data Updated Sucessfuly  ");
  }

  const changeUserName = (e) => {
    e.preventDefault();
    if (isUserNameChanged) {
      const auth = getAuth();
      updateDoc(
        doc(db, "Users", User.uid),
        formData,
        { merge: true }
      )
        .catch(err => toast.error('failure'))
      updateProfile(auth.currentUser, { displayName: userName })
        .then(() => {
          notify();
        })
        .catch((error) => {
          alert(error.message);
        });
      setIsUserNameChanged(false);
    }
  };

  const updateProfilePic = (imageURL) => {
    const auth = getAuth();
    updateProfile(auth.currentUser, { photoURL: imageURL })
      .then(() => {
        setProfilePic(User.photoURL);
        notify();
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const SignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const cancelPremium = async () => {
    try {
      const userRef = doc(db, 'Users', User.uid);
      await updateDoc(userRef, {
        premium: false,
        planExpiry: null,
        currentPlan: null
      });
      fetchDocumentById('Users', User.uid).then((res) => {
        setFormData(res)
      })
      toast.success('Subscription Cancelled Successfully');
    } catch (error) {
      console.error("Error canceling premium:", error);
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  console.log(User);
  return (
    <div>
      <div
        className="flex justify-center items-center"
        style={{
          backgroundImage: `linear-gradient(0deg, hsl(0deg 0% 0% / 73%) 0%, hsl(0deg 0% 0% / 73%) 35%), url(${WelcomePageBanner})`,
        }}
      >

        <Toaster
          toastOptions={{
            style: {
              padding: "1.5rem",
              backgroundColor: "##f4fff4",
              borderLeft: "6px solid green",
            },
          }}
        />

        <Fade>
          <div className="bg-[#000000bf] p-5 md:p-12 rounded-md">
            <h1 className="text-4xl text-white font-bold mb-4 md:mb-8">
              Edit your Profile
            </h1>
            <div className="flex justify-center flex-col items-center md:flex-row md:items-start">
              <img
                className={
                  profilePic
                    ? "h-28 w-28 rounded-full cursor-pointer mb-3 md:mr-16"
                    : "h-28 w-28 rounded-full cursor-pointer mb-3 md:mr-16"
                }
                src={
                  profilePic
                    ? `${profilePic}`
                    : `https://www.citypng.com/public/uploads/preview/profile-user-round-red-icon-symbol-download-png-11639594337tco5j3n0ix.png`
                }
                alt="Anime"
              />
              <div>
                <hr className="mb-2 h-px bg-gray-500 border-0 dark:bg-gray-700"></hr>
                <h1 className="text-white text-lg font-medium mb-2">
                  User Name
                </h1>
                <input
                  type="text"
                  name="displayName"
                  onChange={(e) =>
                    handleChange(e) || setUserName(e.target.value) || setIsUserNameChanged(true)
                  }
                  className="block w-full rounded-md bg-stone-900 text-white border-gray-300 p-2 mb-6 focus:border-indigo-500 focus:ring-indigo-500 sm:text-base"
                  placeholder={User ? User.displayName : null}
                />
                <h1 className="text-white text-lg font-medium mb-2">Email</h1>
                <h1 className="text-white text-xl bg-stone-900 p-2 rounded mb-4 md:pr-52">
                  {User ? User.email : null}
                </h1>
                <h1 className="text-white text-lg font-medium mb-2">Age</h1>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={(e) =>
                    handleChange(e) || setIsUserNameChanged(true)
                  }
                  className="block w-full rounded-md bg-stone-900 text-white border-gray-300 p-2 mb-6 focus:border-indigo-500 focus:ring-indigo-500 sm:text-base"
                  placeholder='age'
                />
                <h1 className="text-white text-lg font-medium mb-2">Gender</h1>
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={(e) =>
                    handleChange(e) || setIsUserNameChanged(true)
                  }
                  className="block w-full rounded-md bg-stone-900 text-white border-gray-300 p-2 mb-6 focus:border-indigo-500 focus:ring-indigo-500 sm:text-base"
                  placeholder='gender'
                />
                <h1 className="text-white text-lg font-medium mb-2">Phone</h1>
                <input
                  type="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    handleChange(e) || setIsUserNameChanged(true)
                  }
                  className="block w-full rounded-md bg-stone-900 text-white border-gray-300 p-2 mb-6 focus:border-indigo-500 focus:ring-indigo-500 sm:text-base"
                  placeholder='phone'
                />
                <h1 className="text-white text-xl p-2 rounded mb-4">
                  Unique ID : {User ? User.uid : null}
                </h1>
                <h1 className="text-white text-xl p-2 rounded mb-4 flex gap-2 items-center">
                  <img className="w-10 h-10 rounded-md cursor-pointer" src={premiumUrl}></img>
                  <div>{formData.premium ?
                    <>
                      <div>{`You\'re the ${formData.currentPlan} Premium Member`}</div>
                      <span>Expiry on {formData.planExpiry}</span>
                      <button
                        onClick={() => cancelPremium()}
                        className="flex items-center bg-red-700 text-white font-medium sm:font-bold text-xs px-10 md:px-16 md:text-xl  py-3 rounded shadow hover:shadow-lg hover:bg-white hover:text-red-700 outline-none focus:outline-none mr-3 mb-1 ease-linear transition-all duration-150"
                      >Cancel</button>
                    </>
                    : <button
                      onClick={() => navigate("/payment")}
                      className="flex items-center bg-red-700 text-white font-medium sm:font-bold text-xs px-10 md:px-16 md:text-xl  py-3 rounded shadow hover:shadow-lg hover:bg-white hover:text-red-700 outline-none focus:outline-none mr-3 mb-1 ease-linear transition-all duration-150"
                    >Subscribe Now</button>}</div>
                </h1>
                <hr className="h-px bg-gray-500 border-0 mb-4 md:mb-10 dark:bg-gray-700"></hr>

                <h1 className="text-white text-lg font-medium mb-4">
                  Who is Watching ?
                </h1>
                <div className="flex justify-between cursor-pointer mb-4 md:mb-8">
                  <img
                    onClick={() =>
                      updateProfilePic(
                        "https://i.pinimg.com/originals/ba/2e/44/ba2e4464e0d7b1882cc300feceac683c.png"
                      )
                    }
                    className="w-16 h-16 rounded-md cursor-pointer"
                    src="https://i.pinimg.com/originals/ba/2e/44/ba2e4464e0d7b1882cc300feceac683c.png"
                  />
                  <img
                    onClick={() =>
                      updateProfilePic(
                        "https://i.pinimg.com/736x/db/70/dc/db70dc468af8c93749d1f587d74dcb08.jpg"
                      )
                    }
                    className="w-16 h-16 rounded-md cursor-pointer"
                    src="https://i.pinimg.com/736x/db/70/dc/db70dc468af8c93749d1f587d74dcb08.jpg"
                  />
                  <img
                    onClick={() =>
                      updateProfilePic(
                        "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
                      )
                    }
                    className="w-16 h-16 rounded-md cursor-pointer"
                    src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
                  />
                  <img
                    onClick={() =>
                      updateProfilePic(
                        "https://ih0.redbubble.net/image.618363037.0853/flat,1000x1000,075,f.u2.jpg"
                      )
                    }
                    className="w-16 h-16 rounded-md cursor-pointer"
                    src="https://ih0.redbubble.net/image.618363037.0853/flat,1000x1000,075,f.u2.jpg"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={SignOut}
                className="flex items-center border-[0.7px] border-white text-white font-medium sm:font-bold text-xs px-14 md:px-24 md:text-xl  py-3 rounded shadow hover:shadow-lg hover:bg-white hover:border-white hover:text-red-700 outline-none focus:outline-none mr-3 mb-1 ease-linear transition-all duration-150"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                  />
                </svg>
                SignOut
              </button>
              {(userName != "" || isUserNameChanged) ? (
                <button
                  onClick={changeUserName}
                  className="flex items-center bg-red-700 text-white font-medium sm:font-bold text-xs px-10 md:px-16 md:text-xl  py-3 rounded shadow hover:shadow-lg hover:bg-white hover:text-red-700 outline-none focus:outline-none mr-3 mb-1 ease-linear transition-all duration-150"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>
                  Save and continue
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (User.email === "admin@gmail.com") {
                      navigate("/admin/dashboard")
                    } else {
                      navigate("/")
                    }
                  }}
                  className="flex items-center bg-red-700 text-white font-medium sm:font-bold text-xs px-10 md:px-16 md:text-xl  py-3 rounded shadow hover:shadow-lg hover:bg-white hover:text-red-700 outline-none focus:outline-none mr-3 mb-1 ease-linear transition-all duration-150"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                  Back to Home
                </button>
              )}
            </div>
          </div>
        </Fade>
      </div>
    </div>
  );
}

export default Profile;
