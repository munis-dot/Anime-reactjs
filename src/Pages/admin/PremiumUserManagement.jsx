import React, { useEffect, useState } from 'react';
import { db } from '@/Firebase/FirebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import './PremiumUserManagement.css';
import EditPremiumModal from '../../components/EditPremiumModal/EditPremiumModal';
import toast from 'react-hot-toast';
import { UserCheck, Clock1, CalendarCheck2, Star } from 'lucide-react';

const PremiumUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        totalPremium: 0,
        threeMonths: 0,
        sixMonths: 0,
        oneYear: 0
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        calculateStats();
    }, [users]);

    const fetchUsers = async () => {
        try {
            const usersCollection = collection(db, 'Users');
            const userSnapshot = await getDocs(usersCollection);
            const userList = userSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(userList);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const calculateStats = () => {
        const premiumUsers = users.filter(user => user.premium);
        setStats({
            totalPremium: premiumUsers.length,
            threeMonths: premiumUsers.filter(user => user.currentPlan === '3 Months').length,
            sixMonths: premiumUsers.filter(user => user.currentPlan === '6 Months').length,
            oneYear: premiumUsers.filter(user => user.currentPlan === '1 Year').length
        });
    };

    const handleCancelPremium = async (userId) => {
        try {
            const userRef = doc(db, 'Users', userId);
            await updateDoc(userRef, {
                premium: false,
                planExpiry: null,
                currentPlan: null
            });
            fetchUsers();
            toast.success('Premium subscription cancelled successfully');
        } catch (error) {
            console.error("Error canceling premium:", error);
            toast.error('Failed to cancel premium subscription');
        }
    };

    const handleEditPremium = async (planData) => {
        try {
            const userRef = doc(db, 'Users', selectedUser.id);
            await updateDoc(userRef, {
                currentPlan: planData.plan,
                planExpiry: new Date(planData.validityDate).toISOString().split("T")[0],
                premium: true
            });
            fetchUsers();
            toast.success('Premium details updated successfully');
        } catch (error) {
            console.error("Error updating premium:", error);
            toast.error('Failed to update premium details');
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    return (
        <div className="premium-management-container">
            <h2>Premium Users Management</h2>
            
            <div className="stats-container">
                <div className="stat-card total">
                    <UserCheck size={24} color="#E50914" />
                    <h3>Total Premium</h3>
                    <p>{stats.totalPremium}</p>
                    <span>Active Users</span>
                </div>
                <div className="stat-card three-month">
                    <Clock1 size={24} color="#E50914" />
                    <h3>3 Months Plan</h3>
                    <p>{stats.threeMonths}</p>
                    <span>Subscribers</span>
                </div>
                <div className="stat-card six-month">
                    <CalendarCheck2 size={24} color="#E50914" />
                    <h3>6 Months Plan</h3>
                    <p>{stats.sixMonths}</p>
                    <span>Subscribers</span>
                </div>
                <div className="stat-card one-year">
                    <Star size={24} color="#E50914" />
                    <h3>1 Year Plan</h3>
                    <p>{stats.oneYear}</p>
                    <span>Subscribers</span>
                </div>
            </div>

            <table className="premium-users-table">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>User Name</th>
                        <th>Premium Status</th>
                        <th>Current Plan</th>
                        <th>Validity Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.displayName || 'N/A'}</td>
                            <td>{user.premium ? 'Active' : 'Inactive'}</td>
                            <td>{user.currentPlan || 'N/A'}</td>
                            <td>{user.planExpiry ? new Date(user.planExpiry).toLocaleDateString() : 'N/A'}</td>
                            <td>
                                {user.premium && (
                                    <>
                                        <button 
                                            className="cancel-btn"
                                            onClick={() => handleCancelPremium(user.id)}
                                        >
                                            Cancel Premium
                                        </button>
                                        <button 
                                            className="edit-btn"
                                            onClick={() => openEditModal(user)}
                                        >
                                            Edit Premium
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <EditPremiumModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleEditPremium}
                currentPlan={selectedUser?.currentPlan}
                currentValidity={selectedUser?.planExpiry}
            />
        </div>
    );
};

export default PremiumUserManagement;
