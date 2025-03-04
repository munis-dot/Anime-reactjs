// import React, { useState, useEffect } from "react";
// import { useDropzone } from "react-dropzone";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";
// import { Switch } from "@/components/ui/switch";
// import { UploadCloud, Image as ImageIcon } from "lucide-react";
// import CreatableSelect from "react-select/creatable";
// import { db } from "@/Firebase/FirebaseConfig";
// import { collection, addDoc } from "firebase/firestore";

// const VideoUploadForm = () => {
//   const [video, setVideo] = useState(null);
//   const [thumbnail, setThumbnail] = useState(null);
//   const [videoUrl, setVideoUrl] = useState("");
//   const [thumbnailUrl, setThumbnailUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [tags, setTags] = useState([]);
//   const [formData, setFormData] = useState({
//     title: "",
//     overview: "",
//     genre: "",
//     tags: [],
//     language: "",
//     releaseDate: "",
//     duration: "",
//     rating: "",
//   });

//   useEffect(() => {
//     fetch("https://api.jikan.moe/v4/genres/anime")
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.data) {
//           setTags(data.data.map((genre) => ({ label: genre.name, value: genre.name })));
//         }
//       })
//       .catch((error) => console.error("Error fetching tags:", error));
//   }, []);

//   const { getRootProps, getInputProps } = useDropzone({
//     accept: "video/*",
//     onDrop: (acceptedFiles) => setVideo(acceptedFiles[0]),
//   });

//   const { getRootProps: getThumbProps, getInputProps: getThumbInputProps } = useDropzone({
//     accept: "image/*",
//     onDrop: (acceptedFiles) => setThumbnail(acceptedFiles[0]),
//   });

//   const uploadVideo = async () => {
//     if (!video) return alert("Please select a video!");

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("file", video);
//     formData.append("upload_preset", "demo12");

//     const res = await fetch("https://api.cloudinary.com/v1_1/dlliku5ku/video/upload", {
//       method: "POST",
//       body: formData,
//     });

//     const data = await res.json();
//     setVideoUrl(data.secure_url);

//     if (thumbnail) {
//       await uploadThumbnail();
//     } else {
//       setThumbnailUrl(`${data.secure_url.split(".mp4")[0]}.jpg`); // Generate thumbnail from video
//     }

//     await saveToFirestore(data.secure_url, thumbnailUrl || `${data.secure_url.split(".mp4")[0]}.jpg`);
//     setLoading(false);
//   };

//   const uploadThumbnail = async () => {
//     const formData = new FormData();
//     formData.append("file", thumbnail);
//     formData.append("upload_preset", "demo123");

//     const res = await fetch("https://api.cloudinary.com/v1_1/dlliku5ku/image/upload", {
//       method: "POST",
//       body: formData,
//     });

//     const data = await res.json();
//     setThumbnailUrl(data.secure_url);
//   };

//   const saveToFirestore = async (videoUrl, thumbnailUrl) => {
//     try {
//       await addDoc(collection(db, "movies"), {
//         ...formData,
//         videoUrl,
//         thumbnailUrl,
//         createdAt: new Date(),
//       });
//       alert("Video uploaded successfully!");
//     } catch (error) {
//       console.error("Error saving to Firestore:", error);
//     }
//   };

//   const handleChange = (value, name) => {
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }

//   console.log(formData, thumbnail, video)
//   return (
//     <div className="p-6 bg-black text-white min-h-screen flex justify-center items-center">
//       <Card className="w-full max-w-2xl p-6 bg-gray-900 shadow-lg rounded-2xl">
//         <h2 className="text-2xl font-bold mb-4 text-red-600">Upload Video</h2>
//         <CardContent>
//           <motion.div
//             {...getRootProps()}
//             className="border-2 border-dashed border-gray-600 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800"
//             whileHover={{ scale: 1.05 }}
//           >
//             <input {...getInputProps()} />
//             <UploadCloud size={48} className="text-gray-400 mb-2" />
//             {video ? (
//               <p className="text-green-500">{video.name}</p>
//             ) : (
//               <p className="text-gray-400">Drag & drop a video file here, or click to select</p>
//             )}
//           </motion.div>

//           {/* Thumbnail Upload */}
//           <motion.div
//             {...getThumbProps()}
//             className="border-2 border-dashed border-gray-600 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800 mt-4"
//             whileHover={{ scale: 1.05 }}
//           >
//             <input {...getThumbInputProps()} />
//             <ImageIcon size={40} className="text-gray-400 mb-2" />
//             {thumbnail ? (
//               <img src={thumbnail} alt="Thumbnail Preview" className="mt-2 w-32 h-32 rounded-lg object-cover" />
//             ) : (
//               <p className="text-gray-400">Upload Thumbnail (Optional)</p>
//             )}
//           </motion.div>

//           <div className="mt-4 space-y-3">
//             <Input className="text-white placeholder-gray-400" placeholder="Title" name="title" onChange={(e) => handleChange(e.target.value, "title")} />
//             <Textarea className="text-white placeholder-gray-400" placeholder="overview" name="overview" onChange={(e) => handleChange(e.target.value, "overview")} />

// <Select onValueChange={(value) => handleChange(value, "genre")}>
//   <SelectTrigger className="text-white placeholder-gray-400">
//     <SelectValue placeholder="Select Genre" />
//   </SelectTrigger>
//   <SelectContent className="bg-gray-800 text-white">
//     <SelectItem value="Action">Action</SelectItem>
//     <SelectItem value="Comedy">Comedy</SelectItem>
//     <SelectItem value="Drama">Drama</SelectItem>
//     <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
//   </SelectContent>
// </Select>

// {/* Dark Theme for Multi-Select */}
// <CreatableSelect
//   isMulti
//   options={tags}
//   placeholder="Select or create tags"
//   onChange={(selectedOptions) => handleChange(selectedOptions.map((option) => option.value), "tags")}
//   styles={{
//     control: (base) => ({ ...base, backgroundColor: "#1f2937", color: "white", borderColor: "gray" }),
//     menu: (base) => ({ ...base, backgroundColor: "#111827" }),
//     option: (base, state) => ({
//       ...base,
//       backgroundColor: state.isSelected ? "#374151" : "#1f2937",
//       color: "white",
//     }),
//     placeholder: (base) => ({ ...base, color: "#9ca3af" }),
//   }}
// />

//             <Input className="text-white placeholder-gray-400" placeholder="Language" name="language" onChange={(e) => handleChange(e.target.value, "language")} />
//             <Input type="date" className="text-white placeholder-gray-400" name="releaseDate" onChange={(e) => handleChange(e.target.value, "releaseDate")} />
//             <Input className="text-white placeholder-gray-400" placeholder="Duration (e.g., 1h 30m)" name="duration" onChange={(e) => handleChange(e.target.value, "duration")} />

//             <Select onValueChange={(value) => handleChange(value, "rating")}>
//               <SelectTrigger className="text-white placeholder-gray-400">
//                 <SelectValue placeholder="Select Rating" />
//               </SelectTrigger>
//               <SelectContent className="bg-gray-800 text-white">
//                 <SelectItem value="PG-13">PG-13</SelectItem>
//                 <SelectItem value="R">R</SelectItem>
//                 <SelectItem value="G">G</SelectItem>
//               </SelectContent>
//             </Select>
//             <div className="flex items-center justify-between">
//               <span className="text-gray-400">Premium Video</span>
//               <Switch
//                 checked={formData.isPremium}
//                 onCheckedChange={(checked) => {
//                   handleChange(checked, "premium");
//                 }}
//               />
//             </div>
//             <Button onClick={uploadVideo} disabled={loading} className="bg-red-600 hover:bg-red-700 w-full">
//               {loading ? "Uploading..." : "Upload"}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };
//////////////////////////////////////////////////////////////////////////////////////////////
// export default VideoUploadForm;
import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { UploadCloud, Image as ImageIcon } from "lucide-react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { db } from "@/Firebase/FirebaseConfig";
import { collection, addDoc, doc, getDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { getDocumentByCustomId } from "@/lib/utils";

const VideoUploadForm = () => {
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [banner, setBanner] = useState("");
  const [bannerPreview, setBannerPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);

  const [categories, setCategories] = useState([
    { value: 'trending', label: 'Trending' },
    { value: 'top_rated', label: 'Top Rated' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'popular', label: 'Popular' },
    { value: 'horror', label: 'Horror' },
    { value: 'action', label: 'Action' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'drama', label: 'Drama' },
    { value: 'animation', label: 'Animation' }
  ]);

  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    genre: [],
    tags: [],
    category: "",
    language: "",
    releaseDate: "",
    duration: "",
    vote_average: 0,
    premium: false,
  });

  const { videoId } = useParams()
  useEffect(() => {
    if (videoId) {
      const fetchVideoDetails = async () => {
        try {
          const data = await getDocumentByCustomId('movies', videoId);
          if (data) {
            setFormData(data);
          } else {
            console.log("No video found with this ID.");
          }
        } catch (error) {
          console.error("Error fetching video details:", error);
        }
      };
      fetchVideoDetails();
    }
  }, [videoId]);

  useEffect(() => {
    fetch("https://api.jikan.moe/v4/genres/anime")
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          const options = data.data.map((item) => ({ label: item.name, value: item.name }));
          setGenres(options);
        }
      })
      .catch((error) => console.error("Error fetching genres:", error));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "video/*": [".mp4", ".mov", ".avi", ".mkv"] },
    onDrop: (acceptedFiles) => setVideo(acceptedFiles[0]),
  });

  const { getRootProps: getThumbProps, getInputProps: getThumbInputProps } = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    },
  });

  const { getRootProps: getThumbProps2, getInputProps: getThumbInputProps2 } = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    },
  });

  const uploadVideo = async () => {
    setLoading(true);
    let data;
    if (!videoId) {
      if (!video) return alert("Please select a video!");

      const formData = new FormData();
      formData.append("file", video);
      formData.append("upload_preset", "demo12");

      const res = await fetch("https://api.cloudinary.com/v1_1/dlliku5ku/video/upload", {
        method: "POST",
        body: formData,
      });

      data = await res.json();
      setVideoUrl(data.secure_url);
    }
    let thumbnailUrls = '';
    let bannerUrls = '';
    if (thumbnail) {
      thumbnailUrls = await uploadThumbnail();
    }
    else if (videoId) {
      thumbnailUrls = formData.thumbnailUrl;
    }
    else {
      setThumbnailUrl(`${data.secure_url.split(".mp4")[0]}.jpg`); // Generate thumbnail from video
    }

    if (banner) {
      bannerUrls = await uploadBanner();
    }
    else if (videoId) {
      bannerUrls = formData.bannerUrl;
    }
    if (videoId) {
      await saveToFirestore(formData.videoUrl, thumbnailUrls, bannerUrls);
    }
    else await saveToFirestore(data.secure_url, thumbnailUrls ?? `${data.secure_url.split(".mp4")[0]}.jpg`, bannerUrls);
    setLoading(false);
  };

  const uploadThumbnail = async () => {
    const formData = new FormData();
    formData.append("file", thumbnail);
    formData.append("upload_preset", "demo123");

    const res = await fetch("https://api.cloudinary.com/v1_1/dlliku5ku/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setThumbnailUrl(data.secure_url);
    return data.secure_url;
  };

  const uploadBanner = async () => {
    const formData = new FormData();
    formData.append("file", banner);
    formData.append("upload_preset", "demo123");

    const res = await fetch("https://api.cloudinary.com/v1_1/dlliku5ku/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setBannerUrl(data.secure_url);
    return data.secure_url;
  };

  const saveToFirestore = async (videoUrl, thumbnailUrl, bannerUrl) => {
    try {
      const videoData = {
        ...formData,
        videoUrl,
        thumbnailUrl,
        bannerUrl,
        updatedAt: new Date(),
      };

      if (videoId) {
        // Update existing video
        const moviesRef = collection(db, "movies");
        const isNumeric = typeof videoId === "number" || /^\d+$/.test(videoId);
        const formattedId = isNumeric ? Number(videoId) : videoId;
        if(isNumeric) {
          const q = query(moviesRef, where("id", "==", formattedId)); // Query based on `videoId`

          const querySnapshot = await getDocs(q);
  
          if (querySnapshot.empty) {
            throw new Error("Video not found");
          }
          // Assuming `videoId` is unique, update the first matched document
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, videoData);
        }
        else{
          // Update existing document with unique `videoId`
          const docRef = doc(collection(db, "movies"), videoId);
          await updateDoc(docRef, videoData);
        }
       
        toast.success("Video updated successfully!");
      } else {
        // Create new video
        await addDoc(collection(db, "movies"), {
          ...videoData,
          createdAt: new Date(),
        });
        toast.success("Video uploaded successfully!");
      }
    } catch (error) {
      console.error("Error saving to Firestore:", error);
    }
  };

  const handleChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#1f2937",
      color: "white",
      borderColor: "#333",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1a1a1a",
      color: "white",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#333" : "#1a1a1a",
      color: state.isSelected ? "white" : "#ccc",
    }),
    singleValue: (base) => ({
      ...base,
      color: "white",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#bbb",
    }),
    input: (base) => ({
      ...base,
      color: "white",
    }),
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen flex justify-center items-center">
      <Toaster
        toastOptions={{
          style: {
            padding: "1.5rem",
            backgroundColor: "#f4fff4",
            borderLeft: "6px solid lightgreen",
          },
        }}
      />
      <Card className="w-full max-w-2xl p-6 bg-gray-900 shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Upload Video</h2>
        <CardContent>
          {!videoId && <motion.div {...getRootProps()} className="border-2 border-dashed border-gray-600 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800">
            <input {...getInputProps()} />
            <UploadCloud size={48} className="text-gray-400 mb-2" />
            {video ? <p className="text-green-500">{video.name}</p> : <p className="text-gray-400">Drag & drop a video file here, or click to select</p>}
          </motion.div>}

          <motion.div {...getThumbProps()} className="border-2 border-dashed border-gray-600 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800 mt-4">
            <input {...getThumbInputProps()} />
            <ImageIcon size={40} className="text-gray-400 mb-2" />
            {thumbnailPreview || formData.thumbnailUrl ? <img src={thumbnailPreview ?? formData.thumbnailUrl} alt="Thumbnail Preview" className="mt-2 w-32 h-32 rounded-lg object-cover" /> : <p className="text-gray-400">Upload Thumbnail</p>}
          </motion.div>

          <motion.div {...getThumbProps2()} className="border-2 border-dashed border-gray-600 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800 mt-4">
            <input {...getThumbInputProps2()} />
            <ImageIcon size={40} className="text-gray-400 mb-2" />
            {bannerPreview || formData.bannerUrl ? <img src={bannerPreview ?? formData.bannerUrl} alt="Thumbnail Preview" className="mt-2 w-32 h-32 rounded-lg object-cover" /> : <p className="text-gray-400">Upload Banner (big)</p>}
          </motion.div>

          <div className="mt-4 space-y-4">
            {/* Title Input */}
            <Input
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded-lg w-full placeholder-gray-400"
              placeholder="Title"
              name="title"
              value={formData.title}
              onChange={(e) => handleChange(e.target.value, "title")}
            />

            {/* Overview Textarea */}
            <Textarea
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded-lg w-full placeholder-gray-400"
              placeholder="Overview"
              name="overview"
              value={formData.overview}
              onChange={(e) => handleChange(e.target.value, "overview")}
            />

            {/* Genre Select */}
            <Select
              styles={selectStyles}
              isMulti
              options={genres}
              value={genres.filter(g => formData.genre.includes(g.value))}
              onChange={(selected) => handleChange(selected.map(opt => opt.value), "genre")}
              placeholder="Select Genre"
            />

            {/* Tags Select (Creatable) */}
            <CreatableSelect
              styles={selectStyles}
              isMulti
              options={genres}
              value={genres.filter(g => formData.tags.includes(g.value))}
              onChange={(selected) => handleChange(selected.map(opt => opt.value), "tags")}
              placeholder="Select or create tags"
            />

            {/* Category Select */}
            <Select
              styles={selectStyles}
              options={categories}
              value={categories.find(c => c.value === formData.category)}
              onChange={(selected) => handleChange(selected.value, "category")}
              placeholder="Select Category"
            />

            {/* Other Inputs */}
            <Input
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded-lg w-full placeholder-gray-400"
              placeholder="Language"
              name="language"
              value={formData.language}
              onChange={(e) => handleChange(e.target.value, "language")}
            />

            <Input
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded-lg w-full placeholder-gray-400"
              type="date"
              placeholder="Release Date"
              name="releaseDate"
              value={formData.releaseDate?.includes('T') ? formData.releaseDate.split("T")[0] : formData.releaseDate}
              onChange={(e) => handleChange(e.target.value, "releaseDate")}
            />

            <Input
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded-lg w-full placeholder-gray-400"
              placeholder="Duration"
              name="duration"
              value={formData.duration}
              onChange={(e) => handleChange(e.target.value, "duration")}
            />

            <Input
              className="bg-gray-800 text-white border border-gray-600 p-2 rounded-lg w-full placeholder-gray-400"
              placeholder="Vote"
              name="vote_average"
              type="number"
              value={formData.vote_average}
              onChange={(e) => handleChange(e.target.value, "vote_average")}
            />

            {/* Premium Switch */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.premium}
                onCheckedChange={(checked) => handleChange(checked, "premium")}
              />
              <span className="text-white">Premium Content</span>
            </div>

            {/* Upload Button */}
            <Button
              onClick={uploadVideo}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white w-full p-2 rounded-lg disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};
const customSelectStyles = {
  control: (base) => ({ ...base, backgroundColor: "#1f2937", color: "white", borderColor: "white" }),
  menu: (base) => ({ ...base, backgroundColor: "#1f2937", color: "white" }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#374151" : "#1f2937",
    color: "white",
  }),
  placeholder: (base) => ({ ...base, color: "#9ca3af" }),
};
export default VideoUploadForm;
