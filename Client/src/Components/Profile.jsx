import React from "react";

export default function Profile({ user }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm text-center">
        <h2 className="text-xl font-bold mb-4">Profile</h2>
        {user ? (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </>
        ) : (
          <p>No user logged in</p>
        )}
      </div>
    </div>
  );
}
