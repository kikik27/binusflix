import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ContentCard from './ContentCard';

const ContentRow = ({ title, items = [], icon: Icon, onOpenTrailer }) => {
  const rowRef = useRef(null);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-2.5 my-8 relative group/row">
      {/* Row Header */}
      <div className="flex items-center justify-between px-4 sm:px-8 lg:px-12">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2 group cursor-pointer">
          {Icon && <Icon className="w-5 h-5 text-[#E50914]" />}
          <span>{title}</span>
          <span className="text-xs text-[#E50914] opacity-0 group-hover:opacity-100 transition-opacity font-semibold ml-1">
            Jelajahi Semua &gt;
          </span>
        </h2>
      </div>

      {/* Horizontal Slider Track Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-0 bottom-0 z-40 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-200 cursor-pointer backdrop-blur-sm"
          title="Geser ke Kiri"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        {/* Scrollable Content Items */}
        <div
          ref={rowRef}
          className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar py-4 px-4 sm:px-8 lg:px-12 scroll-smooth"
        >
          {items.map((item) => (
            <div key={item.id} className="w-[160px] sm:w-[190px] md:w-[220px] shrink-0">
              <ContentCard item={item} onOpenQuickTrailer={onOpenTrailer} />
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-0 bottom-0 z-40 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-200 cursor-pointer backdrop-blur-sm"
          title="Geser ke Kanan"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};

export default ContentRow;
