import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { getProductsById } from '../api/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductsById(id);
        setProduct(data);
      } catch (err) {
        setError('Product Not Found');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) return <div><Navbar /><p style={{ padding: '20px' }}>Loading product details...</p></div>;

  if (error || !product) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>404 - Product Not Found</h2>
          <p>The product with ID "{id}" does not exist.</p>
          <button onClick={() => navigate('/products')} style={{ padding: '8px 16px', cursor: 'pointer' }}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => navigate('/products')} style={{ marginBottom: '20px', cursor: 'pointer' }}>
          ← Back to Dashboard
        </button>

        <h1>{product.title}</h1>
        <p><strong>Category:</strong> {product.category} | <strong>Brand:</strong> {product.brand}</p>

        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', margin: '20px 0' }}>
          {product.images?.map((img, index) => (
            <img key={index} src={img} alt={product.title} width="150" height="150" style={{ objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} />
          ))}
        </div>

        <h3>Price: ${product.price} (Rating: {product.rating} ⭐)</h3>
        <p><strong>Description:</strong> {product.description}</p>

        <hr style={{ margin: '30px 0' }} />

        <h3>Customer Reviews</h3>
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((rev, index) => (
            <div key={index} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <p><strong>{rev.reviewerName}</strong> - {rev.rating} ⭐</p>
              <p>{rev.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;