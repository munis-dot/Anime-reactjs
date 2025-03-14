import React from "react";
import { Button } from "./ui/button";
import { Trash2, Pencil } from "lucide-react";

const ViewUser = ({ user, onEdit, onDelete, onClose }) => {
  return (
    <div className="bg-zinc-900/95 border border-zinc-800 rounded-lg w-[500px] max-h-[90vh] flex flex-col z-[51]">
      <div className="border-b border-zinc-800 p-6">
        <h2 className="text-2xl font-bold text-white">User Details</h2>
        <p className="text-zinc-400">Detailed information about the user account</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {[
          { label: "Name", value: user.displayName },
          { label: "Email", value: user.email },
          { label: "Phone", value: user.phone },
          { label: "Age", value: user.age },
          { label: "Gender", value: user.gender },
          { label: "Premium", value: user.premium ? "Yes" : "No" }
        ].map((item) => (
          <div key={item.label} className="mb-4">
            <label className="text-sm font-medium text-zinc-400">{item.label}</label>
            <p className="text-base font-semibold text-white bg-zinc-800 p-2 rounded mt-1">
              {item.value || 'N/A'}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-800 p-6 flex justify-end gap-2">
        <Button 
          variant="outline" 
          className="bg-red-600 hover:bg-red-700 text-white border-0"
          onClick={() => onDelete(user.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
        <Button 
          variant="outline" 
          className="bg-blue-600 hover:bg-blue-700 text-white border-0"
          onClick={() => onEdit(user)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button 
          variant="outline"
          className="bg-zinc-800 hover:bg-zinc-700 text-white border-0"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default ViewUser;
