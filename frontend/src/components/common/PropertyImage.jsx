import React, { useState } from 'react';
import { getPropertyFallbackImage } from '../../utils/propertyImages';

export default function PropertyImage({
  src,
  alt = 'Property Collateral Asset',
  propertyType = 'Apartment',
  className = 'w-full h-full object-cover',
  wrapperClassName = 'w-full h-full relative overflow-hidden bg-[#F8FAFC]'
}) {
  const [imageError, setImageError] = useState(false);
  const fallbackSvg = getPropertyFallbackImage(propertyType, alt);

  const displaySrc = (!src || imageError) ? fallbackSvg : src;

  return (
    <div className={wrapperClassName}>
      <img
        src={displaySrc}
        alt={imageError ? '' : alt}
        onError={(e) => {
          if (!imageError) {
            setImageError(true);
            e.target.onerror = null;
            e.target.src = fallbackSvg;
            e.target.alt = '';
          }
        }}
        className={className}
        loading="lazy"
      />
    </div>
  );
}
