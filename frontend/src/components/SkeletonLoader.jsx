// src/components/SkeletonLoader.jsx
import React from "react";
import "../skeletonLoader.css"; // add shimmer effect

const SkeletonLoader = () => {
  return (
    <div className='skeleton-wrapper'>
      <div className='skeleton-header' />
      <div className='skeleton-avatar' />
      <div className='skeleton-line' />
      <div className='skeleton-line short' />
    </div>
  );
};

export default SkeletonLoader;
