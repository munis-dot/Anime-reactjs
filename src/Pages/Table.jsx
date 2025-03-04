// import React, { useState } from "react";

// const Table = () => {
//   const styles = {
//     tableContainer: {
//       marginTop: "1.5rem", // mt-6
//     },
//     heading: {
//       fontSize: "1.875rem", // text-3xl
//       fontWeight: "700", // font-bold
//       marginBottom: "1.5rem", // mb-6
//       color: "#e50914", // text-netflix-red
//     },
//     table: {
//       width: "100%", // min-w-full
//       backgroundColor: "#141414", // bg-netflix-black
//       color: "white", // text-white
//       borderRadius: "0.5rem", // rounded-lg
//       overflow: "hidden", // overflow-hidden
//       boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // shadow-lg
//     },
//     tableHeader: {
//       backgroundColor: "#181818", // bg-netflix-dark
//     },
//     tableHeaderCell: {
//       padding: "1rem 1.5rem", // px-6 py-4
//       textAlign: "left", // text-left
//       fontSize: "1.125rem", // text-lg
//       fontWeight: "600", // font-semibold
//     },
//     tableCell: {
//       padding: "1rem 1.5rem", // px-6 py-4
//       borderBottom: "1px solid #181818", // border-b border-netflix-dark
//       color: "#808080", // text-netflix-gray
//     },
//     tableRow: {
//       transition: "background-color 0.2s ease-in-out", // transition-colors
//     },
//     tableRowHover: {
//       backgroundColor: "#181818", // hover:bg-netflix-dark
//     },
//     link: {
//       color: "#e50914", // text-netflix-red
//       textDecoration: "none", // no underline by default
//     },
//     linkHover: {
//       textDecoration: "underline", // hover:underline
//     },
//   };
//   const [formData, setFormData] = useState([]);
//   return (
//     <div style={styles.tableContainer}>
//       <h2 style={styles.heading}>Uploaded Video Details</h2>
//       <table style={styles.table}>
//         <thead style={styles.tableHeader}>
//           <tr>
//             <th style={styles.tableHeaderCell}>Field</th>
//             <th style={styles.tableHeaderCell}>Value</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Object.entries(formData).map(([key, value]) => (
//             <tr
//               key={key}
//               style={{
//                 ...styles.tableRow,
//                 ":hover": styles.tableRowHover,
//               }}
//             >
//               <td style={styles.tableCell}>{key}</td>
//               <td style={styles.tableCell}>
//                 {Array.isArray(value) ? value.join(", ") : value.toString()}
//               </td>
//             </tr>
//           ))}
//           <tr style={styles.tableRow}>
//             <td style={styles.tableCell}>Video URL</td>
//             <td style={styles.tableCell}>
//               <a
//                 href={videoUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={styles.link}
//               >
//                 View Video
//               </a>
//             </td>
//           </tr>
//           <tr style={styles.tableRow}>
//             <td style={styles.tableCell}>Thumbnail URL</td>
//             <td style={styles.tableCell}>
//               <a
//                 href={thumbnailUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={styles.link}
//               >
//                 View Thumbnail
//               </a>
//             </td>
//           </tr>
//           <tr style={styles.tableRow}>
//             <td style={styles.tableCell}>Banner URL</td>
//             <td style={styles.tableCell}>
//               <a
//                 href={bannerUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={styles.link}
//               >
//                 View Banner
//               </a>
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Table;
import { fetchAllMovies } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Table = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getMovies = async () => {
      const movieData = await fetchAllMovies();
      setMovies(movieData);
    };

    getMovies();
  }, []);
  console.log(movies)
  return (
    <div className="bg-black min-h-screen p-6">
      <h2 className="text-red-600 text-3xl font-bold mb-4 text-center">
        🎬 Netflix Movie List
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-gray-900 text-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-red-700 text-white uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Thumbnail</th>
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Genre</th>
              <th className="py-3 px-6 text-left">Year</th>
              <th className="py-3 px-6 text-left">Rating</th>
              <th className="py-3 px-6 text-left">Premium</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {movies.length > 0 ? (
              movies.map((movie) => (
                <tr
                  key={movie.id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition-all duration-200"
                >
                  <td className="py-3 px-6">
                    <img
                      src={movie.thumbnailUrl}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded-md"
                    />
                  </td>
                  <td className="py-3 px-6">{movie.title}</td>
                  <td className="py-3 px-6">{movie.genre}</td>
                  <td className="py-3 px-6">{new Date(movie.releaseDate).getFullYear()}</td>
                  <td className="py-3 px-6">{movie.vote_average}</td>
                  <td className="py-3 px-6">{movie.premium ? 'Premium' : 'Free'}</td>
                  <td className="py-3 px-6 flex space-x-3">
                    <button
                      onClick={() => navigate(`/play/${movie.id}`)}
                      className="text-blue-400 hover:text-blue-600 transition duration-200"
                    >
                      <Eye size={20} />
                    </button>

                    <button
                      onClick={() => navigate(`/admin/upload/${movie.id}`)}
                      className="text-yellow-400 hover:text-yellow-600 transition duration-200"
                    >
                      <Edit size={20} />
                    </button>

                    <button
                      onClick={() => handleDelete(movie.id)}
                      className="text-red-400 hover:text-red-600 transition duration-200"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  No movies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
