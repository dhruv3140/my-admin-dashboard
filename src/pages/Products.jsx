import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import {
  getProducts,
  SearchProducts,
  getCategories,
  getProductsCategories,
  addProduct,
  editProduct,
  deleteProduct,
} from '../api/api';

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCats();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const skip = (page - 1) * limit;
      let data;

      if (search.trim() !== '') {
        data = await SearchProducts(search.trim(), limit, skip);
      } else if (selectedCategory) {
        data = await getProductsCategories(selectedCategory, limit, skip);
      } else {
        data = await getProducts(limit, skip);
      }

      let items = data.products || [];

      if (sortBy) {
        items = [...items].sort((a, b) => {
          let valA = a[sortBy];
          let valB = b[sortBy];
          if (typeof valA === 'string') {
            return order === 'asc'
              ? valA.localeCompare(valB)
              : valB.localeCompare(valA);
          }
          return order === 'asc' ? valA - valB : valB - valA;
        });
      }

      setProducts(items);
      setTotal(data.total || 0);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 400);

    return () => clearTimeout(timer);
  }, [page, limit, search, selectedCategory, sortBy, order]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setSelectedCategory('');
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSearch('');
    setPage(1);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const handleAddProduct = async () => {
    const title = prompt('Enter Product Title:');
    const price = prompt('Enter Product Price:');
    if (!title || !price) return;

    const newCustomItem = {
      id: Date.now(),
      title,
      price: Number(price),
      category: selectedCategory || 'general',
      rating: 5,
      stock: 10,
      thumbnail: 'https://via.placeholder.com/150',
      isCustom: true,
    };

    try {
      await addProduct({ title, price: Number(price) });
    } catch (err) {
      console.log('Dummy API add skipped, falling back to local state');
    }

    setProducts((prev) => [newCustomItem, ...prev]);
    setTotal((prev) => prev + 1);
    alert('Product added successfully!');
  };

  const handleEditProduct = async (item) => {
    const updatedTitle = prompt('Edit Title:', item.title);
    if (!updatedTitle) return;

    if (!item.isCustom && item.id <= 100) {
      try {
        await editProduct(item.id, { title: updatedTitle });
      } catch (err) {
        console.log('Dummy API edit error ignored');
      }
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, title: updatedTitle } : p))
    );
    alert('Product updated successfully!');
  };

  const handleDeleteProduct = async (id, isCustom) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    if (!isCustom && id <= 100) {
      try {
        await deleteProduct(id);
      } catch (err) {
        console.log('Dummy API delete error ignored');
      }
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    setTotal((prev) => prev - 1);
    alert('Product deleted successfully!');
  };

  const startCount = (page - 1) * limit + 1;
  const endCount = Math.min(page * limit, total);

  return (
    <div>
      <Navbar />

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Product Dashboard</h2>
          <button
            onClick={handleAddProduct}
            style={{ padding: '8px 16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            + Add Product
          </button>
        </div>

        {/* Controls Bar */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
            style={{ padding: '8px 12px', width: '200px', borderRadius: '4px', border: '1px solid #ccc' }}
          />

          <select
  value={selectedCategory}
  onChange={handleCategoryChange}
  style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
>
  <option value="">All Categories</option>
  {categories.map((cat, idx) => {
    const categoryValue = typeof cat === 'object' ? (cat.slug || cat.name) : cat;
    const categoryLabel = typeof cat === 'object' ? (cat.name || cat.slug) : cat;

    return (
      <option key={idx} value={categoryValue}>
        {categoryLabel}
      </option>
    );
  })}
</select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">Sort By (Default)</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            <option value="title">Title</option>
          </select>

          <button
            onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
            style={{ padding: '8px 12px', cursor: 'pointer' }}
          >
            Sort: {order.toUpperCase()}
          </button>

          <select
            value={limit}
            onChange={handleLimitChange}
            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', marginLeft: 'auto' }}
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && <p>Loading products...</p>}

        {/* Error State */}
        {error && (
          <div style={{ color: 'red', marginBottom: '20px' }}>
            <p>{error}</p>
            <button onClick={loadProducts} style={{ padding: '6px 12px', cursor: 'pointer' }}>
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && <p>No products found.</p>}

        {/* Table View */}
        {!loading && !error && products.length > 0 && (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Rating</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img src={item.thumbnail} alt={item.title} width="50" height="50" style={{ objectFit: 'cover' }} />
                      </td>
                      <td>
                        <Link to={`/products/${item.id}`} style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
                          {item.title}
                        </Link>
                      </td>
                      <td>{item.category}</td>
                      <td>${item.price}</td>
                      <td>{item.rating} ⭐</td>
                      <td>{item.stock}</td>
                      <td>
                        <button onClick={() => handleEditProduct(item)} style={{ marginRight: '5px', cursor: 'pointer' }}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteProduct(item.id, item.isCustom)} style={{ color: 'red', cursor: 'pointer' }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                style={{ padding: '8px 16px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>

              <span>
                Showing {total > 0 ? startCount : 0}-{endCount} of {total}
              </span>

              <button
                disabled={page * limit >= total}
                onClick={() => setPage((prev) => prev + 1)}
                style={{ padding: '8px 16px', cursor: page * limit >= total ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;