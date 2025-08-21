import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader, Ticket, Sparkles } from "lucide-react";
import { useCouponStore } from "../stores/useCouponStore";
import { useUserStore } from "../stores/useUserStore";
import { useNotificationStore } from "../stores/useNotificationStore";
import Select from "react-select";

const CreateCouponForm = () => {
  const [form, setForm] = useState({
    code: "",
    discountPercentage: "10",
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    userId: "",
  });

  const { users, fetchAllUsers } = useUserStore();
  const { createCoupon, loading } = useCouponStore();
  const { fetchNotifications } = useNotificationStore();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await createCoupon(form);
    if (success) {
      await fetchNotifications();
      setForm({
        code: "",
        discountPercentage: "10",
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        userId: "",
      });
    }
  };

  const generateRandomCode = () => {
    const randomCode =
      "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setForm((prev) => ({ ...prev, code: randomCode }));
  };

  const customerOptions = users
    .filter((u) => u.role === "customer")
    .map((u) => ({
      value: u._id,
      label: `${u.name} (${u.email})`,
    }));

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-8 max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-blue-300 text-center">
        Create Discount Coupon
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="col-span-1 relative">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Coupon Code
          </label>
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Enter or generate code"
            required
            className="w-full bg-gray-700 rounded-md px-3 py-2 text-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={generateRandomCode}
            className="absolute top-[34px] right-2 bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
            title="Generate random code"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Discount (%)
          </label>
          <input
            type="number"
            name="discountPercentage"
            value={form.discountPercentage}
            onChange={handleChange}
            required
            min="1"
            max="100"
            placeholder="10"
            className="w-full bg-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Assign to Customer
          </label>
          <Select
            value={
              customerOptions.find((opt) => opt.value === form.userId) || null
            }
            onChange={(selected) =>
              setForm((prev) => ({
                ...prev,
                userId: selected ? selected.value : "",
              }))
            }
            options={customerOptions}
            placeholder="Search and select a customer..."
            isClearable
            className="text-black"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#374151",
                color: "#fff",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#1f2937",
                color: "#fff",
              }),
              singleValue: (base) => ({
                ...base,
                color: "#fff",
              }),
              input: (base) => ({
                ...base,
                color: "#fff",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#2563eb" : "#1f2937",
                color: "#fff",
              }),
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Expiration Date
          </label>
          <input
            type="date"
            name="expirationDate"
            value={form.expirationDate}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md flex items-center justify-center transition duration-200 disabled:opacity-50"
          >
            {loading ? (
              <Loader className="animate-spin h-5 w-5 mr-2" />
            ) : (
              <Ticket className="h-5 w-5 mr-2" />
            )}
            Create Coupon
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateCouponForm;
