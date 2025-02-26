import React from "react";
import Banner from "../componets/Banner/Banner";
import Footer from "../componets/Footer/Footer";
import RowPost from "../componets/RowPost/RowPost";
import {
  originals,
  comedy,
  horror,
  Adventure,
  SciFi,
  Animated,
  War,
  trendingSeries,
  UpcomingMovies,
} from "../Constants/URLs";

function Series() {
  return (
    <div>
       <Banner url={"trending"}></Banner>
      <div className="w-[99%] ml-1">
        <RowPost first title="Trending" url={"trending"} key={"trending"}></RowPost>
        <RowPost title="Top Rated" url={"top_rated"} key={"top_rated"}></RowPost>
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

export default Series;
