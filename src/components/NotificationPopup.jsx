import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { db } from "@/Firebase/FirebaseConfig";
import { collection, arrayUnion, updateDoc, doc, getDoc, setDoc } from "firebase/firestore";
import toast from 'react-hot-toast';

const NotificationPopup = ({ isOpen, onClose, userId, userName }) => {
  const [message, setMessage] = useState('');

  const handleSendNotification = async () => {
    try {
      const notificationRef = doc(db, "Notifications", userId);
      const notificationDoc = await getDoc(notificationRef);

      if (notificationDoc.exists()) {
        // Update existing notifications
        await updateDoc(notificationRef, {
          messages: arrayUnion({
            id: Date.now(),
            message,
            timestamp: new Date(),
            read: false
          })
        });
      } else {
        // Create new notifications document
        await setDoc(notificationRef, {
          userId,
          userName,
          messages: [{
            id: Date.now(),
            message,
            timestamp: new Date(),
            read: false
          }]
        });
      }

      toast.success('Notification sent successfully!');
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border border-zinc-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Send Notification</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-zinc-400 mb-2">To: {userName || userId}</p>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message..."
            className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
          />
        </div>
        <DialogFooter className="border-t border-zinc-800 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-zinc-800 text-white hover:bg-zinc-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendNotification}
            disabled={!message.trim()}
            className="bg-red-600 hover:bg-red-700 text-white ml-2"
          >
            Send Notification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationPopup;
