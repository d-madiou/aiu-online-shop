import React from 'react';

export const SellersTable = ({ sellers, stores, onDeleteSeller }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <h3 className="text-lg font-semibold p-4 border-b">Sellers</h3>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Store</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Joined</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sellers.map(seller => (
            <tr key={seller.id}>
              <td className="px-4 py-3">{seller.name}</td>
              <td className="px-4 py-3">{seller.email}</td>
              <td className="px-4 py-3">{seller.type}</td>
              <td className="px-4 py-3">
                {stores.find(s => s.id === seller.store_id)?.name || 'N/A'}
              </td>
              <td className="px-4 py-3">
                {new Date(seller.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
              <td className="px-4 py-3">
                    <button
                    onClick={() => onDeleteSeller(seller.id)}
                    className="text-red-600 hover:text-red-800"
                    >
                    Delete
                    </button>
                </td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);