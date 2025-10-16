import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Package, Save, X } from 'lucide-react';

const AddEditDrug = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get drug ID from URL if editing
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [fetchingDrug, setFetchingDrug] = useState(isEditMode);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    quantity: '',
    price: '',
    manufacturer: '',
    description: '',
    expiryDate: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      fetchDrug();
    }
  }, [id]);

  const fetchDrug = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/pharmacy/inventory/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data.success) {
        const drug = data.data;
        setFormData({
          name: drug.name || '',
          dosage: drug.dosage || '',
          quantity: drug.quantity || '',
          price: drug.price || '',
          manufacturer: drug.manufacturer || '',
          description: drug.description || '',
          expiryDate: drug.expiryDate ? drug.expiryDate.split('T')[0] : ''
        });
      } else {
        alert('Failed to fetch drug details');
        navigate('/pharmacist/inventory');
      }
    } catch (error) {
      console.error('Error fetching drug:', error);
      alert('Error fetching drug details');
      navigate('/pharmacist/inventory');
    } finally {
      setFetchingDrug(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Drug name is required';
    }

    if (!formData.dosage.trim()) {
      newErrors.dosage = 'Dosage is required';
    }

    if (!formData.quantity || formData.quantity < 0) {
      newErrors.quantity = 'Valid quantity is required';
    }

    if (formData.price && formData.price < 0) {
      newErrors.price = 'Price must be positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = isEditMode
        ? `http://localhost:8080/api/pharmacy/inventory/${id}`
        : 'http://localhost:8080/api/pharmacy/inventory';
      
      const method = isEditMode ? 'PUT' : 'POST';

      // Prepare data
      const submitData = {
        name: formData.name,
        dosage: formData.dosage,
        quantity: parseInt(formData.quantity),
        price: formData.price ? parseFloat(formData.price) : null,
        manufacturer: formData.manufacturer || null,
        description: formData.description || null,
        expiryDate: formData.expiryDate ? `${formData.expiryDate}T00:00:00` : null
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (data.success) {
        alert(isEditMode ? 'Drug updated successfully!' : 'Drug added successfully!');
        navigate('/pharmacist/inventory');
      } else {
        alert(data.message || 'Failed to save drug');
      }
    } catch (error) {
      console.error('Error saving drug:', error);
      alert('Error saving drug. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/pharmacist/inventory');
  };

  if (fetchingDrug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading drug details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            ← Back to Inventory
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Package className="w-8 h-8 mr-3 text-green-600" />
            {isEditMode ? 'Edit Drug' : 'Add New Drug'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditMode ? 'Update drug information' : 'Add a new drug to inventory'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Drug Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Drug Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Paracetamol"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Dosage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dosage <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.dosage ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 500mg"
                />
                {errors.dosage && (
                  <p className="mt-1 text-sm text-red-600">{errors.dosage}</p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.quantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 150"
                />
                {errors.quantity && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 5.99"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              {/* Manufacturer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., PharmaCorp"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter drug description, usage instructions, or additional notes..."
                />
              </div>
            </div>

            {/* Information Note */}
            <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Drug status will be automatically calculated based on quantity and expiry date.
                    <br />
                    • In Stock: quantity &gt; 10
                    <br />
                    • Low Stock: 1 ≤ quantity ≤ 10
                    <br />
                    • Out of Stock: quantity = 0
                    <br />
                    • Expired: expiry date has passed
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                disabled={loading}
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Saving...' : isEditMode ? 'Update Drug' : 'Add Drug'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditDrug;
