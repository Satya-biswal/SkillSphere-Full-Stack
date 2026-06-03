import { useState } from 'react';
import { createOrder, verifyPayment } from '../../services/paymentService';
import toast from 'react-hot-toast';

const PaymentModal = ({ gig, freelancer, onClose, onSuccess }) => {
  const [amount, setAmount] = useState(gig?.budget?.min || '');
  const [milestone, setMilestone] = useState('Full Payment');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!amount || amount <= 0) return toast.error('Enter valid amount');
    setLoading(true);
    try {
      const orderData = await createOrder({
        amount: Number(amount),
        gigId: gig._id,
        freelancerId: freelancer._id,
        milestone,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'SkillSphere',
        description: `Payment for: ${gig.title}`,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              paymentId: orderData.paymentId,
            });
            toast.success('Payment successful! 🎉');
            onSuccess?.();
            onClose();
          } catch {
            toast.error('Payment verification failed');
          }
        },
        prefill: { name: '', email: '' },
        theme: { color: '#4F46E5' },
        modal: { ondismiss: () => setLoading(false) },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-gray-800">Make Payment</h2>
          <button onClick={onClose} className="text-gray-400 text-xl hover:text-gray-600">×</button>
        </div>

        <div className="bg-indigo-50 rounded-xl p-4 mb-5">
          <p className="text-xs text-indigo-400 mb-1">Paying for</p>
          <p className="font-semibold text-indigo-700">{gig?.title}</p>
          <p className="text-sm text-indigo-500 mt-1">To: {freelancer?.name}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Milestone</label>
          <select value={milestone} onChange={(e) => setMilestone(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Full Payment</option>
            <option>Milestone 1 — 50%</option>
            <option>Milestone 2 — 50%</option>
            <option>Advance Payment</option>
            <option>Final Payment</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (₹)</label>
          <input type="number" value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount" min="1"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Budget: ₹{gig?.budget?.min?.toLocaleString()} – ₹{gig?.budget?.max?.toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span className="font-medium">₹{Number(amount || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Platform Fee</span>
            <span className="font-medium text-green-600">₹0 (Free)</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-indigo-600">₹{Number(amount || 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl text-sm font-medium hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handlePayment} disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-medium transition disabled:opacity-50">
            {loading ? 'Processing...' : `Pay ₹${Number(amount || 0).toLocaleString()}`}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">🔒 Secured by Razorpay</p>
      </div>
    </div>
  );
};

export default PaymentModal;