import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  User,
  Phone,
  Mail,
  ShoppingBag,
  TrendingUp,
  Calendar,
  Award,
} from 'lucide-react';
import { analyticsAPI } from '../../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await analyticsAPI.getCustomers();
      setCustomers(response.data.data.customers);
      setStats(response.data.data.stats);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(query) ||
      customer.phone?.includes(query) ||
      customer.email?.toLowerCase().includes(query)
    );
  });

  const frequentCustomers = customers.filter((c) => c.totalOrders >= 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-chocolate-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {[
          { label: 'Total', value: stats?.totalCustomers || 0, icon: User, color: 'blue' },
          { label: 'Repeat', value: stats?.repeatCustomers || 0, icon: TrendingUp, color: 'green' },
          { label: 'Repeat %', value: `${stats?.repeatPercentage || 0}%`, icon: Award, color: 'purple' },
          { label: 'Avg Order', value: `₹${stats?.avgOrderValue || 0}`, icon: ShoppingBag, color: 'amber' },
        ].map((m, i) => (
          <div key={i} className="admin-stat-card">
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`p-1.5 bg-${m.color}-50 rounded-lg`}>
                <m.icon className={`w-4 h-4 text-${m.color}-600`} />
              </div>
              <span className="stat-label">{m.label}</span>
            </div>
            <p className="stat-value text-gray-800">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Frequent Customers Banner */}
      {frequentCustomers.length > 0 && (
        <div className="admin-card bg-gradient-to-r from-chocolate-600 to-chocolate-800 p-3 text-white">
          <h3 className="text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 text-cream-300">
            <Award className="w-3.5 h-3.5" /> Frequent Customers
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {frequentCustomers.slice(0, 4).map((customer) => (
              <div key={customer._id} className="bg-white/10 rounded-lg p-2.5 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-semibold">{customer.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{customer.name}</p>
                    <p className="text-[10px] text-cream-300">{customer.totalOrders} orders · ₹{customer.totalSpent}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input pl-8"
          />
        </div>
        <p className="text-[11px] text-gray-400 flex-shrink-0">
          {filteredCustomers.length} of {customers.length}
        </p>
      </div>

      {/* Customer Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th className="hidden md:table-cell">Contact</th>
                <th>Orders</th>
                <th>Spent</th>
                <th className="hidden sm:table-cell">Last Order</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer._id}
                  className="cursor-pointer"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-chocolate-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-semibold text-chocolate-600">
                          {customer.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 text-xs truncate">{customer.name}</p>
                        {customer.totalOrders >= 3 && (
                          <span className="admin-badge bg-yellow-50 text-yellow-700 mt-0.5">Frequent</span>
                        )}
                        <p className="text-[10px] text-gray-400 md:hidden">{customer.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">
                    <div className="space-y-0.5">
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-300" />
                        {customer.phone}
                      </p>
                      {customer.email && (
                        <p className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-300" />
                          {customer.email}
                        </p>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="font-medium text-gray-800 text-xs">{customer.totalOrders}</span>
                  </td>
                  <td>
                    <span className="font-semibold text-chocolate-600 text-xs">₹{customer.totalSpent}</span>
                  </td>
                  <td className="hidden sm:table-cell">
                    <span className="text-[11px] text-gray-500">
                      {new Date(customer.lastOrder).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-8">
            <User className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No customers found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
