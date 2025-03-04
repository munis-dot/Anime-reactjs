import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/Firebase/FirebaseConfig";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    totalMovies: 0,
    newReleases: 0,
  });

  const [uploadData, setUploadData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Users Data
        const usersSnapshot = await getDocs(collection(db, "Users"));
        const totalUsers = usersSnapshot.size;
        const premiumUsers = usersSnapshot.docs.filter(doc => doc.data().premium === true).length;

        // Fetch Movies Data
        const moviesSnapshot = await getDocs(collection(db, "movies"));
        const totalMovies = moviesSnapshot.size;
        
        // Filter movies released in the current month
        const currentMonth = new Date().getMonth() + 1;
        const newReleases = moviesSnapshot.docs.filter(doc => {
          const releaseDate = new Date(doc.data().releaseDate);
          return releaseDate.getMonth() + 1 === currentMonth;
        }).length;

        // Fetch Upload Data (Grouped by Month)
        const monthlyUploads = {};
        moviesSnapshot.docs.forEach(doc => {
          const releaseDate = new Date(doc.data().releaseDate);
          const month = releaseDate.toLocaleString("default", { month: "short" });

          if (!monthlyUploads[month]) monthlyUploads[month] = 0;
          monthlyUploads[month]++;
        });

        const uploadDataArray = Object.keys(monthlyUploads).map(month => ({
          month,
          uploads: monthlyUploads[month],
        }));

        setStats({ totalUsers, premiumUsers, totalMovies, newReleases });
        setUploadData(uploadDataArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="text-white min-h-screen pt-12 p-5 bg-black">
      <h1 className="text-5xl font-extrabold mb-6 text-center text-grey-600">Anime Dashboard</h1>

      {/* Video Uploads Chart */}
      <div className="mt-12 bg-[#141414] p-6 rounded-2xl shadow-lg shadow-red-700/40 border border-red-500">
        <h2 className="text-2xl font-bold mb-5 text-grey-500">Monthly Video Uploads</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={uploadData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis dataKey="month" stroke="#fff" tick={{ fill: "#ff0000", fontSize: 14 }} />
            <YAxis stroke="#fff" tick={{ fill: "#ff0000", fontSize: 14 }} />
            <Tooltip wrapperStyle={{ backgroundColor: "#141414", color: "#fff", borderRadius: "10px", padding: "10px" }} />
            <Line 
              type="monotone" 
              dataKey="uploads" 
              strokeWidth={3} 
              dot={{ fill: "#ff0000", r: 6 }} 
              activeDot={{ r: 8, fill: "#dc2626" }} 
              stroke="#ff0000"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Cards */}
      <div className="grid mt-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#1a1a1a] shadow-lg shadow-red-700/40 rounded-2xl p-8 text-center border border-red-500">
          <CardContent>
            <h2 className="text-xl font-bold text-gray-300">Total Users</h2>
            <p className="text-3xl font-extrabold mt-3 text-red-500">{stats.totalUsers}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] shadow-lg shadow-red-700/40 rounded-2xl p-8 text-center border border-red-500">
          <CardContent>
            <h2 className="text-xl font-bold text-gray-300">Premium Users</h2>
            <p className="text-3xl font-extrabold mt-3 text-red-500">{stats.premiumUsers}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] shadow-lg shadow-red-700/40 rounded-2xl p-8 text-center border border-red-500">
          <CardContent>
            <h2 className="text-xl font-bold text-gray-300">Total Movies & Series</h2>
            <p className="text-3xl font-extrabold mt-3 text-red-500">{stats.totalMovies}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1a1a] shadow-lg shadow-red-700/40 rounded-2xl p-8 text-center border border-red-500">
          <CardContent>
            <h2 className="text-xl font-bold text-gray-300">New Releases This Month</h2>
            <p className="text-3xl font-extrabold mt-3 text-red-500">{stats.newReleases}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
