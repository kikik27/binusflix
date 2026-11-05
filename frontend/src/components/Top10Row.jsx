import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

const Top10Row = ({ title = '10 Film & Serial TV Teratas Hari Ini', items = [] }) => {
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

  const topItems = items.slice(0, 10);
  if (topItems.length === 0) return null;

  return (
    <div className="space-y-2.5 my-10 relative group/top10 select-none">
      {/* Row Title */}
      <div className="px-4 sm:px-8 lg:px-12">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-5 bg-[#E50914] rounded-sm inline-block" />
          <span>{title}</span>
        </h2>
      </div>

      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-0 bottom-0 z-40 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/top10:opacity-100 transition-all duration-200 cursor-pointer backdrop-blur-sm"
          title="Geser ke Kiri"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        {/* Scrollable Numbered Cards Track */}
        <div
          ref={rowRef}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-4 px-4 sm:px-8 lg:px-12 scroll-smooth"
        >
          {topItems.map((item, index) => {
            const rank = index + 1;
            return (
              <div
                key={item.id}
                className="relative flex items-center shrink-0 w-[220px] sm:w-[260px] group cursor-pointer transition-transform duration-300 hover:scale-105"
              >
                {/* Giant Netflix Outlined Number */}
                <div className="relative w-20 sm:w-28 flex items-center justify-center shrink-0 select-none">
                  <span
                    className="text-7xl sm:text-9xl font-black text-transparent leading-none drop-shadow-2xl"
                    style={{
                      WebkitTextStroke: '4px #595959',
                    }}
                  >
                    {rank}
                  </span>
                  <span
                    className="absolute text-7xl sm:text-9xl font-black text-[#07080A] leading-none -z-10"
                  >
                    {rank}
                  </span>
                </div>

                {/* Poster Card */}
                <Link
                  to={`/detail/${item.contentType}/${item.id}`}
                  className="relative -ml-4 sm:-ml-6 aspect-[2/3] w-32 sm:w-40 rounded-lg overflow-hidden shadow-2xl bg-[#0D1017] border border-white/[0.08] group-hover:border-[#E50914]/50 transition"
                >
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Netflix Ribbon */}
                  <div className="absolute top-1.5 left-1.5 bg-[#E50914] px-1 py-0.5 rounded text-[8px] font-black text-white uppercase">
                    TOP 10
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-black ml-0.5" />
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-0 bottom-0 z-40 w-10 sm:w-12 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover/top10:opacity-100 transition-all duration-200 cursor-pointer backdrop-blur-sm"
          title="Geser ke Kanan"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};

export default Top10Row;
