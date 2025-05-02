import React from 'react';

export const StoresTable = ({ stores, users, onDeleteStore }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <h3 className="text-lg font-semibold p-4 border-b">Stores</h3>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Phone</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Created</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {stores.map(store => (
            <tr key={store.id}>
              <td className="px-4 py-3">{store.name}</td>
              <td className="px-4 py-3">{store.phone_number}</td>
              <td className="px-4 py-3">
                {new Date(store.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                {users.find(u => u.id === store.user_id)?.email || 'N/A'}
              </td>
                <td className="px-4 py-3">
                    <button
                    onClick={() => onDeleteStore(store.id)}
                    className="text-red-600 hover:text-red-800"
                    >
                    Delete
                    </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);