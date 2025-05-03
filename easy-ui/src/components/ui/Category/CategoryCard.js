import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

function CategoryCard({ category }) {
  if (!category) return null;
  
  const { id, name, description } = category;
  
  return (
    <Link 
      to={`/category/${id}`} 
      className="category-card"
    >
      <div className="category-card-content">
        <h3 className="category-card-title">{name}</h3>
        {description && (
          <p className="category-card-description">{description}</p>
        )}
      </div>
      <div className="category-card-icon">
        <i className="fas fa-angle-right"></i>
      </div>
    </Link>
  );
}

export default CategoryCard; 