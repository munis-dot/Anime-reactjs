import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import useUpdateWatchedMovies from "./useUpdateWatchedMovies";
import { AuthContext } from "@/Context/UserContext";
import { fetchDocumentById, getDocumentByCustomId } from "@/lib/utils";

function usePlayMovie() {
  const { addToWatchedMovies } = useUpdateWatchedMovies();
  const navigate = useNavigate();
  const { User } = useContext(AuthContext);

  const playMovie = async (movie, from) => {
    let movieData = await getDocumentByCustomId('movies', movie.id);
    fetchDocumentById('Users', User.uid).then((res) => {
      if (movieData.premium && !res.premium) {
        navigate('/payment')
      }
      else {
        addToWatchedMovies(movie);
        navigate(`/play/${movie.id}`, { replace: true, state: { From: from } });
      }
    })

  };

  return { playMovie };
}

export default usePlayMovie;
