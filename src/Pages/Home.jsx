import React from "react";
import { useEffect, useState, useContext } from "react";
import Banner from "../componets/Banner/Banner";
import Footer from "../componets/Footer/Footer";
import RowPost from "../componets/RowPost/RowPost";
import {
  originals,
  trending,
  comedy,
  horror,
  Adventure,
  SciFi,
  Animated,
  War,
  trendingSeries,
  UpcomingMovies,
} from "../Constants/URLs";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/FirebaseConfig";
import { AuthContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
function Home() {
  const { User } = useContext(AuthContext);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const navigate = useNavigate();
  useEffect(()=>{
    if(User?.email === "admin@gmail.com"){
      navigate("/admin/dashboard")
    }
  },[User])

  useEffect(() => {
    getDoc(doc(db, "WatchedMovies", User.uid)).then((result) => {
      if (result.exists()) {
        const mv = result.data();
        setWatchedMovies(mv.movies);
      }
    });
  }, []);

  return (
    <div>
      <Banner url={"trending"}></Banner>
      <div className="w-[99%] ml-1">
        <RowPost first title="Trending" url={"trending"} key={"trending"}></RowPost>
        <RowPost title="Top Rated" url={"top_rated"} key={"top_rated"}></RowPost>
        {watchedMovies.length != 0 ? (
          <RowPost
            title="Watched Movies"
            movieData={watchedMovies}
            key={"Watched Movies"}
          ></RowPost>
        ) : null}
        <RowPost
          title="Action"
          url={"action"}
          key={"action"}
        ></RowPost>
        <RowPost title="Animation" url={"animation"}></RowPost>
        <RowPost title="Drama" url={"drama"}></RowPost>
        <RowPost title="Comedy" url={"comedy"}></RowPost>
        <RowPost title="Adventure" url={"Adventure"}></RowPost>
        <RowPost title="Horror" url={"horror"}></RowPost>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Home;
