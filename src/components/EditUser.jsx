import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch"; // Add this import
import { Label } from "./ui/label"; // Add this import

const EditUser = ({ user, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    displayName: user.displayName || '',
    email: user.email || '',
    phone: user.phone || '',
    age: user.age || '',
    gender: user.gender || '',
    premium: user.premium ?? false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      premium: checked
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...user, ...formData });
    onClose();
  };

  return (
    <div className="bg-zinc-900/95 border border-zinc-800 rounded-lg w-[500px] max-h-[90vh] flex flex-col z-[51]">
      <div className="border-b border-zinc-800 p-6">
        <h2 className="text-2xl font-bold text-white">Edit User</h2>
        <p className="text-zinc-400">Make changes to user information</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Name", name: "displayName" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone", name: "phone" },
            { label: "Age", name: "age", type: "number" },
            { label: "Gender", name: "gender" }
          ].map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">{field.label}</label>
              <Input
                name={field.name}
                type={field.type || "text"}
                value={formData[field.name]}
                onChange={handleChange}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          ))}
          
          {/* Add Premium Switch */}
          <div className="flex items-center justify-between space-y-2">
            <Label htmlFor="premium" className="text-sm font-medium text-zinc-400">
              Premium Status
            </Label>
            <Switch
              id="premium"
              checked={formData.premium}
              onCheckedChange={handleSwitchChange}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </form>
      </div>

      <div className="border-t border-zinc-800 p-6 flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          className="bg-zinc-800 hover:bg-zinc-700 text-white border-0"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white border-0"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditUser;
