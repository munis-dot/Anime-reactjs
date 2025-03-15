import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/Firebase/FirebaseConfig";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Eye, Edit, Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import ViewUser from "./ViewUser";
import EditUser from "./EditUser";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showComponent, setShowComponent] = useState(null); // 'view' or 'edit'

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, "Users");
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).filter(user => user.email !== "admin@gmail.com");
      setUsers(userList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleEdit = async (updatedUser) => {
    try {
      const userRef = doc(db, "Users", updatedUser.id);
      await updateDoc(userRef, {
        displayName: updatedUser.displayName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        age: updatedUser.age,
        gender: updatedUser.gender,
        premium: updatedUser.premium
      });
      
      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      setEditingUser(null);
      toast.success("User updated successfully!");
    } catch (error) {
      toast.error("Error updating user:", error.message);
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "Users", userId));
      setUsers(users.filter(user => user.id !== userId));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Error deleting user:", error.message);
      console.error("Error deleting user:", error);
    }
  };

  const handleViewClick = (user) => {
    setSelectedUser(user);
    setShowComponent('view');
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowComponent('edit');
  };

  const handleClose = () => {
    setSelectedUser(null);
    setShowComponent(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full p-4">
       <Toaster
        toastOptions={{
          style: {
            padding: "1.5rem",
            backgroundColor: "#f4fff4",
            borderLeft: "6px solid lightgreen",
          },
        }}
      />
      <div className="bg-zinc-900/90 rounded-lg p-6 h-full flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-white">User Management</h2>
        <div className="rounded-md border border-zinc-800 flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-zinc-800/50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="text-zinc-400 font-medium">ID</TableHead>
                <TableHead className="text-zinc-400 font-medium">Name</TableHead>
                <TableHead className="text-zinc-400 font-medium">Email</TableHead>
                <TableHead className="text-zinc-400 font-medium">Phone</TableHead>
                <TableHead className="text-zinc-400 font-medium text-center">Premium</TableHead>
                <TableHead className="text-zinc-400 font-medium text-center">Age</TableHead>
                <TableHead className="text-zinc-400 font-medium text-center">Gender</TableHead>
                <TableHead className="text-zinc-400 font-medium text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow 
                  key={user.id}
                  className="border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                >
                  <TableCell className="text-zinc-300">{user.id}</TableCell>
                  <TableCell className="text-zinc-300">{user.displayName || 'N/A'}</TableCell>
                  <TableCell className="text-zinc-300">{user.email || 'N/A'}</TableCell>
                  <TableCell className="text-zinc-300">{user.phone || 'N/A'}</TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.premium 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-zinc-500/20 text-zinc-400'
                    }`}>
                      {user.premium ? 'Yes' : 'No'}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-300 text-center">{user.age || 'N/A'}</TableCell>
                  <TableCell className="text-zinc-300 text-center">{user.gender || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white border-0"
                        onClick={() => handleViewClick(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                        onClick={() => handleEditClick(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white border-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 border border-zinc-800">
                          <DialogHeader>
                            <DialogTitle className="text-white">Confirm Deletion</DialogTitle>
                            <DialogDescription className="text-zinc-400">
                              Are you sure you want to delete this user? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="border-t border-zinc-800 pt-4">
                            <Button
                              variant="destructive"
                              onClick={() => deleteUser(user.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Replace bottom components with overlays */}
        {showComponent === 'view' && selectedUser && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <ViewUser 
              user={selectedUser}
              onDelete={deleteUser}
              onEdit={handleEditClick}
              onClose={handleClose}
            />
          </div>
        )}

        {showComponent === 'edit' && selectedUser && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <EditUser 
              user={selectedUser}
              onUpdate={handleEdit}
              onClose={handleClose}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;