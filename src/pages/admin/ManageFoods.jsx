import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import API from "../../api/axios";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import CategorySelector from "../../components/admin/CategorySelector";
import { showSuccess, showError, showConfirm } from "../../components/common/Toast";

export default function ManageFoods() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({ name: "", category: "", price: "", image: "" });

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await API.get("/food/all");
      setFoods(res.data);
    } catch (err) {
      showError("Failed to load foods");
    } finally {
      setLoading(false);
    }
  };

  const existingCategories = [...new Set(foods.map((food) => food.category))];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (category) => {
    setFormData({ ...formData, category });
  };

  const openAddForm = () => {
    setEditingFood(null);
    setFormData({ name: "", category: "", price: "", image: "" });
    setShowForm(true);
  };

  const openEditForm = (food) => {
    setEditingFood(food);
    setFormData({ name: food.name, category: food.category, price: food.price, image: food.image || "" });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      showError("Please select or add a category");
      return;
    }

    try {
      if (editingFood) {
        await API.patch(`/food/update/${editingFood._id}`, formData);
        showSuccess("Food item updated!");
      } else {
        await API.post("/food/add", formData);
        showSuccess("Food item added!");
      }
      setShowForm(false);
      fetchFoods();
    } catch (err) {
      showError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = (food) => {
    showConfirm(`Delete ${food.name}?`, async () => {
      try {
        await API.delete(`/food/delete/${food._id}`);
        showSuccess("Food item deleted");
        fetchFoods();
      } catch (err) {
        showError("Failed to delete");
      }
    });
  };

  if (loading) return <p className="text-muted font-bold">Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-text-main">Manage Foods</h2>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={openAddForm}>
          Add Food
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-card-bg border border-card-border rounded-2xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <Input label="Name" name="name" value={formData.name} onChange={handleChange} required />

          <CategorySelector
            categories={existingCategories}
            value={formData.category}
            onChange={handleCategoryChange}
          />

          <Input label="Price" type="number" name="price" value={formData.price} onChange={handleChange} required />
          <Input label="Image URL" name="image" value={formData.image} onChange={handleChange} />

          <div className="sm:col-span-2 flex gap-3">
            <Button type="submit" variant="primary">
              {editingFood ? "Update" : "Add"} Food
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-main text-muted text-left">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food._id} className="border-t border-card-border">
                <td className="p-3">
                  <img
                    src={food.image || "/placeholder-food.png"}
                    alt={food.name}
                    className="w-10 h-10 rounded-lg object-cover"
                    onError={(e) => { e.target.src = "/placeholder-food.png"; }}
                  />
                </td>
                <td className="p-3 font-bold text-text-main">{food.name}</td>
                <td className="p-3 text-muted">{food.category}</td>
                <td className="p-3 font-bold text-brand">৳{food.price}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEditForm(food)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(food)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}