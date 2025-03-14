import React from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const BannedAccount = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <img 
            src="/sad-emoji.svg" // You can replace this with your preferred sad image
            alt="Sad Face"
            className="w-32 h-32 mx-auto mb-6 opacity-75"
          />
          <h1 className="text-3xl font-bold text-red-500 mb-4">
            Account Banned
          </h1>
          <p className="text-zinc-400 text-lg mb-8">
            Your account has been banned. Please use a different account or contact our support team for assistance.
          </p>
          <div className="space-y-4">
            <Button
              onClick={() => navigate('/login')}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Use Different Account
            </Button>
            <Button
              onClick={() => navigate('/support')}
              variant="outline"
              className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannedAccount;
