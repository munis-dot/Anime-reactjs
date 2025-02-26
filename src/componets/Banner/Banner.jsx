import React, { useState, useEffect, useContext } from "react";
import { PopUpContext } from "../../Context/moviePopUpContext";
import { Fade } from "react-reveal";
import StarRatings from "react-star-ratings";
import MoviePopUp from "../PopUp/MoviePopUp";
import usePlayMovie from "../../CustomHooks/usePlayMovie";
import { getMoviesByCategory, getTrendingMovies } from "@/lib/utils";
import { premiumUrl } from "@/Constants/Constance";

function Banner(props) {
  const { showModal, setShowModal } = useContext(PopUpContext);
  const { playMovie } = usePlayMovie();

  const [movie, setMovie] = useState([]);
  const [moviePopupInfo, setMoviePopupInfo] = useState({});
  const [urlId, setUrlId] = useState("");

  function getWindowSize() {
    const { innerWidth: width } = window;
    return {
      width
    }
  }

  const [windowSeize, setWindowSeize] = useState(getWindowSize())

  useEffect(() => {
    if (props.url === 'trending') {
      getTrendingMovies().then((movies) => {
        setMovie(movies[Math.floor(Math.random() * movies.length)]);
      });
    }
    else {
      getMoviesByCategory(props.url).then((movies) => {
        setMovie(movies[Math.floor(Math.random() * movies.length)]);
      });
    }

    function handleWindowResize() {
      setWindowSeize(getWindowSize())
    }

    window.addEventListener('resize', handleWindowResize)

    return (() => {
      window.removeEventListener('resize', handleWindowResize)
    })

  }, []);

  const handleMoviePopup = (movieInfo) => {
    setMoviePopupInfo(movieInfo);
    setShowModal(true);
  };

  return (
    <>
      <div
        style={{
          backgroundImage: `linear-gradient(90deg, hsl(0deg 0% 7% / 91%) 0%, hsl(0deg 0% 0% / 0%) 35%, hsl(220deg 26% 44% / 0%) 100%), url(${movie
            ? movie.thumbnailUrl
            : ""
            })`,
        }}
        className="h-[50rem] md:h-[55rem] 3xl:h-[63rem] bg-cover bg-center object-contain grid items-center"
      >
        <div className="ml-2  mr-2 sm:mr-0 sm:ml-12 mt-[75%] sm:mt-52">
          <Fade bottom>
            {movie.title || movie.name ? (
              <>
                <h1 className="text-white text-3xl font-semibold text-center mb-5 py-2 sm:text-left sm:text-5xl sm:border-l-8 pl-4 border-red-700 md:text-6xl lg:w-2/3 xl:w-1/2 sm:font-bold drop-shadow-lg">
                  {movie.title || movie.name}
                </h1>
              </>
            ) : (
              <div className="grid justify-center sm:justify-start">
                <div className="animate-pulse w-72 ml-4 sm:ml-0 sm:w-96 py-5 mb-7 xl:py-7 xl:w-45rem bg-neutral-900 rounded-md"></div>
              </div>
            )}

            <div className="flex">
              <div className=" hidden sm:flex justify-center sm:justify-start ml-2">
                {movie.vote_average ? (
                  <h1 className="flex text-white text-xl drop-shadow-lg 2xl:text-lg">
                    <div className="-mt-1">
                      <StarRatings
                        rating={movie.vote_average / 2}
                        starRatedColor="red"
                        numberOfStars={5}
                        name="rating"
                        starDimension="1.1rem"
                        starSpacing="0.2rem"
                      />
                    </div>
                  </h1>
                ) : null}
              </div>
              <div className="ml-2 hidden sm:flex justify-center sm:justify-start">
                {movie.releaseDate || movie.first_air_date ? (
                  <h1 className="flex text-white text-base font-bold drop-shadow-lg">
                    {movie.releaseDate || movie.first_air_date}
                  </h1>
                ) : null}
              </div>
              {movie.id && (
                <h1 className="hidden sm:flex text-white px-2 bg-[#1e1e1e89] border-2 border-stone-600 rounded ml-2">
                  HD
                </h1>
              )}
            </div>

            <div className="mt-3 mb-4">
              {movie.premium && <><h1 className="text-white text-xl p-2 rounded mb-4 flex gap-2 items-center">
                <img className="w-10 h-10 rounded-md cursor-pointer" src={premiumUrl}></img> Premium Content
              </h1></>}
              {movie.overview ? (
                <>
                  <h1 className="text-white text-xl drop-shadow-xl  text-center line-clamp-2 sm:line-clamp-3 sm:text-left w-full md:w-4/5 lg:w-8/12/2 lg:text-xl xl:w-5/12 2xl:text-2xl">
                    {movie.overview}
                  </h1>
                </>
              ) : (
                <>
                  <div className="grid justify-center md:justify-start">
                    <div className="animate-pulse w-80 sm:w-40rem md:w-45rem py-1 mb-3 xl:w-70rem xl:py-2 bg-neutral-900 rounded-md"></div>
                    <div className="animate-pulse w-80 sm:w-40rem md:w-45rem py-1 mb-3 xl:w-70rem xl:py-2 bg-neutral-900 rounded-md"></div>
                    <div className="animate-pulse w-80 sm:w-40rem md:w-45rem py-1 mb-7 xl:w-70rem xl:py-2 bg-neutral-900 rounded-md"></div>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-center sm:justify-start">
              {movie.id ? (
                <>
                  <button
                    onClick={() => playMovie(movie)}
                    className="bg-red-800 hover:bg-red-900 transition duration-500 ease-in-out shadow-2xl flex items-center mb-3 mr-3 text-base sm:text-xl font-semibold text-white py-2 sm:py-2 px-10 sm:px-14 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 mr-2 "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                      />
                    </svg>
                    Play
                  </button>
                  <button
                    onClick={() => handleMoviePopup(movie)}
                    className="bg-[#33333380] flex items-center shadow-2xl mb-3 text-base sm:text-xl font-semibold text-white hover:bg-white hover:text-black transition duration-500 ease-in-out py-2 px-8 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 items-center mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    More Info
                  </button>
                </>
              ) : (
                <>
                  <button className="animate-pulse bg-neutral-900 transition duration-500 ease-in-out shadow-2xl flex items-center mb-3 mr-3 text-base sm:text-xl font-semibold text-neutral-500 py-2 sm:py-2 px-10 sm:px-14 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-5 items-center mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Play
                  </button>
                  <button className="animate-pulse bg-neutral-900 flex items-center shadow-2xl mb-3 text-base sm:text-xl font-semibold text-neutral-500 transition duration-500 ease-in-out py-2 px-8 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 items-center mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    More Info
                  </button>
                </>
              )}
            </div>
          </Fade>
        </div>
        <div
          style={{
            backgroundImage:
              "linear-gradient(hsl(0deg 0% 0% / 0%), hsl(0deg 0% 0% / 38%), hsl(0deg 0% 7%))",
          }}
          className="h-80 mt-auto "
        ></div>
      </div>

      {showModal ? <MoviePopUp data1={moviePopupInfo} data2={urlId} /> : null}
    </>
  );
}

export default Banner;
