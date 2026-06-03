import { useEffect, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import { getPaymentHistory } from '../../services/paymentService';
import toast from 'react-hot-toast';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getPaymentHistory();
        setPayments(data.payments);
        setTotalAmount(data.totalAmount);
      } catch {
        toast.error('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const statusColor = {
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
          <p className="text-gray-500 mt-1">All your transactions</p>
        </div>

        {/* Total Card */}
        <div className="bg-indigo-600 rounded-2xl p-6 text-white mb-6">
          <p className="text-indigo-200 text-sm">Total Transacted</p>
          <p className="text-4xl font-bold mt-1">₹{totalAmount.toLocaleString()}</p>
          <p className="text-indigo-200 text-sm mt-2">
            {payments.filter(p => p.status === 'completed').length} successful payments
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-5xl mb-4">💳</p>
            <p className="text-gray-500">No payments yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Gig', 'Milestone', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-800 max-w-[180px] truncate">
                        {p.gig?.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {p.client?.name} → {p.freelancer?.name}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{p.milestone}</td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-indigo-600">
                        ₹{p.amount?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;