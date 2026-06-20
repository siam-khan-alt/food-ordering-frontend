import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import API from "../../api/axios";
import CustomSelect from "../../components/common/CustomSelect";
import CustomerDetailsModal from "../../components/admin/CustomerDetailsModal";
import { showSuccess, showError } from "../../components/common/Toast";

const statusOptions = ["placed", "preparing", "delivered", "cancelled"];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/order/allOrder");
      setOrders(res.data.reverse());
    } catch (err) {
      showError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.patch(`/order/status/${orderId}`, { orderStatus: newStatus });
      showSuccess("Order status updated");
      fetchOrders();
    } catch (err) {
      showError("Failed to update status");
    }
  };

  if (loading) return <p className="text-muted font-bold">Loading orders...</p>;

  return (
    <div>
      <h2 className="text-xl font-black text-text-main mb-6">Manage Orders</h2>

      <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-bg-main text-muted text-left">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t border-card-border">
                <td className="p-3 font-bold text-text-main">#{order._id.slice(-8)}</td>

                <td className="p-3">
                  <button
                    onClick={() => setSelectedCustomerId(order.customer?._id)}
                    className="flex items-center gap-1.5 hover:text-brand transition group"
                  >
                    <div className="text-left">
                      <p className="font-bold text-text-main group-hover:text-brand transition">
                        {order.customer?.name}
                      </p>
                      <p className="text-xs text-muted">{order.customer?.email}</p>
                    </div>
                    <Eye className="w-3.5 h-3.5 text-muted group-hover:text-brand transition" />
                  </button>
                </td>

                <td className="p-3 font-bold text-brand">৳{order.totalAmount}</td>

                <td className="p-3">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-md ${
                      order.paymentStatus === "paid"
                        ? "bg-accent/10 text-accent"
                        : order.paymentStatus === "failed"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    {order.paymentStatus.toUpperCase()}
                  </span>
                </td>

                <td className="p-3">
                  <CustomSelect
                    value={order.orderStatus}
                    options={statusOptions.map((status) => ({ value: status, label: status.toUpperCase() }))}
                    onChange={(newStatus) => handleStatusChange(order._id, newStatus)}
                    className="min-w-[110px] py-2 px-2.5 text-xs"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CustomerDetailsModal
        customerId={selectedCustomerId}
        isOpen={!!selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
      />
    </div>
  );
}