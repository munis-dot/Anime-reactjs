import React, { useContext, useEffect, useState } from 'react';
import './SubscriptionPlans.css';
import PaymentScreen from '@/componets/payment/PaymentScreen';
import { AuthContext } from '@/Context/UserContext';
import toast, { Toaster } from "react-hot-toast";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/Firebase/FirebaseConfig';

const SubscriptionPlans = () => {
  const plans = [
    {
      duration: '3 Months',
      price: 9999,
      features: ['HD Available', 'Watch on any device', 'Cancel anytime']
    },
    {
      duration: '6 Months',
      price: 15999,
      features: ['Ultra HD Available', 'Watch on any device', 'Cancel anytime', '20% savings']
    },
    {
      duration: '1 Year',
      price: 23999,
      features: ['Ultra HD Available', 'Watch on any device', 'Cancel anytime', '40% savings', 'First month free']
    }
  ];
  const [flag, setFlag] = useState({ open: false, amount: 0 });

  useEffect(() => {
    setFlag({ open: false, amount: 0 })
  }, []);

   const { User } = useContext(AuthContext);
 
  console.log(User)
  function getFutureDate(option) {
    const currentDate = new Date();
    switch (option) {
      case "3 Months":
        currentDate.setMonth(currentDate.getMonth() + 3);
        break;
      case "6 Months":
        currentDate.setMonth(currentDate.getMonth() + 6);
        break;
      case "1 Year":
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        break;
    }
    return currentDate.toISOString().split("T")[0]; // Returns date in YYYY-MM-DD format
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = (price, plan) => {
    
    const options = {
      key: "rzp_test_CqgPJqGRPp5PWg",
      amount: price,
      currency: "INR",
      name: "Anime",
      description: `Payment for Order ${plan} plan`,
      image: "anime.png", // Optional logo
      handler: async function (response) {
        toast.success(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        const userRef = doc(db, 'Users', User.uid);
        await updateDoc(userRef, {
          premium: true,
          planExpiry: getFutureDate(plan),
          currentPlan: plan
        });
      },
      prefill: {
        name: User.displayName,
        email: User.email,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new (window).Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="subscription-container">
      <h1>Choose your plan</h1>
      <div className="plans-container">
        {plans.map((plan, index) => (
          <div key={index} className="plan-card">
            <h2>{plan.duration}</h2>
            <div className="price">
              <span className="currency">₹</span>
              <span className="amount">{plan.price / 100}</span>
              <span className="period">/period</span>
            </div>
            <ul className="features">
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            {/* <button onClick={() => setFlag({ open: true, amount: plan.price })} className="subscribe-btn">Subscribe Now</button> */}
            <button onClick={() => handlePayment(plan.price, plan.duration)} className="subscribe-btn">Subscribe Now</button>
          </div>
        ))}
      </div>
      {/* <form><script src="https://cdn.razorpay.com/static/widget/subscription-button.js" data-subscription_button_id="pl_Q8fiIzDRM4u1zo" data-button_theme="brand-color" async> </script> </form> */}
      {flag.open && <PaymentScreen amount={flag.amount} />}
    </div>
  );
};

export default SubscriptionPlans;
