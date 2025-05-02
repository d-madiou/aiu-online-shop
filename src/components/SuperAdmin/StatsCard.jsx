import React from 'react';
import { FaStore, FaUser, FaUserAlt } from 'react-icons/fa';

export const StatsCard = ({ icon: Icon, value, label, color }) => (
  <div className={`p-4 rounded-lg text-white flex items-center ${color}`}>
    <Icon className="text-3xl mr-3" />
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm">{label}</p>
    </div>
  </div>
);

export const SuperAdminStats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <StatsCard
      icon={FaUser}
      value={stats.totalUsers}
      label="Total Users"
      color="bg-blue-600"
    />
    <StatsCard
      icon={FaStore}
      value={stats.totalStores}
      label="Total Stores"
      color="bg-green-600"
    />
    <StatsCard
      icon={FaUserAlt}
      value={stats.totalSellers}
      label="Total Sellers"
      color="bg-purple-600"
    />
  </div>
);