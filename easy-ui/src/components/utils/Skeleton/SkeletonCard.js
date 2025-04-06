import React from "react";
import "./SkeletonCard.css";

const Skeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-preview" />
      <div className="skeleton-divider" />
      <div className="skeleton-footer">
        <div className="skeleton-tags">
          <div className="skeleton-tag" />
          <div className="skeleton-tag" />
          <div className="skeleton-tag" />
        </div>
        <div className="skeleton-button" />
      </div>
    </div>
  );
};

export default Skeleton;
