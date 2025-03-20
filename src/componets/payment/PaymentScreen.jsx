import React, { useContext, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AuthContext } from "@/Context/UserContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/Firebase/FirebaseConfig";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PaymentScreen = ({ amount }) => {
    const [isOpen, setIsOpen] = useState(true);

    const { User } = useContext(AuthContext);
    const navigation = useNavigate();

    useEffect(() => {
        if (!isOpen) navigation(-1)
    }, [isOpen])
    const paynow = () => {
        setDoc(
            doc(db, "Users", User.uid),
            {
                premium: true,
            },
            { merge: true }
        )
            .then(() => {
                toast.success("Payment successfull!");
                navigation(-1);
            })
            .catch(err => toast.error('payment failure'))
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
            <Toaster
                toastOptions={{
                    style: {
                        padding: "1.5rem",
                        backgroundColor: "#f4fff4",
                        borderLeft: "6px solid lightgreen",
                    },
                }}
            />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl w-full bg-gray-900 text-white shadow-lg p-6 rounded-2xl">
                    <DialogHeader className="flex justify-between items-center">
                        <DialogTitle className="text-xl font-bold">Payment Details</DialogTitle>
                        <DialogTitle className="text-xl font-bold">Anime Lifetime Pack Subscription</DialogTitle>
                    </DialogHeader>
                    <Card className="bg-transparent border-0 text-white shadow-lg p-6 rounded-2xl w-full">
                        <CardContent className="flex flex-col items-center gap-4">
                            <QRCodeSVG
                                value={`upi://pay?pa=your_upi_id&pn=Your Name&am=${amount}`}
                                size={200}
                                bgColor="#ffffff00"
                                fgColor="#ffffff"
                            />
                            <p className="text-lg font-semibold text-red-500">Pay ₹{amount}</p>
                            <Button className="bg-red-600 hover:bg-red-700 w-full" onClick={paynow}>Pay Now</Button>
                        </CardContent>
                    </Card>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PaymentScreen;
