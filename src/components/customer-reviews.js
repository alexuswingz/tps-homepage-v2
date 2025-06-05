import React, { useState } from 'react';

const CustomerReviews = () => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const reviews = [
    {
      id: 1,
      name: 'Jennifer S.',
      image: '/assets/Customer Review Image Exports/Woman 1.png',
      headline: '"My monstera is thriving!"',
      content: "I've used a lot of different fertilizers over the years, but this is hands down the best for my monstera. Within 3 weeks of the first application, I got TWO new leaves! My plant was struggling before, but now it's thriving.",
      date: 'March 15, 2023',
      category: 'Monstera Plant Food'
    },
    {
      id: 2,
      name: 'Mike R.',
      image: '/assets/Customer Review Image Exports/Man 1.png',
      headline: '"Bigger leaves with more splits!"',
      content: "I was skeptical at first because I've tried so many products for my monstera, but the difference is remarkable. New growth appeared within days, and the leaves are bigger and have more splits.",
      date: 'February 22, 2023',
      category: 'Monstera Plant Food'
    },
    {
      id: 3,
      name: 'Samantha K.',
      image: '/assets/Customer Review Image Exports/Woman 2.png',
      headline: '"Incredible growth results"',
      content: "After using this fertilizer for about 2 months, my monstera has exploded with growth. I follow the directions exactly - diluting as recommended and applying every 2 weeks. The leaves are darker and healthier looking.",
      date: 'April 3, 2023',
      category: 'Monstera Plant Food'
    }
  ];

  const handlePrevReview = () => {
    setCurrentReviewIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const handleNextReview = () => {
    setCurrentReviewIndex((prevIndex) => 
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentReview = reviews[currentReviewIndex];

  const ReviewCard = ({ review, isMobile }) => (
    <div 
      key={review.id} 
      className={`${isMobile ? 'w-[320px]' : 'min-w-[320px] max-w-[380px]'} h-[480px] rounded-3xl border border-gray-200 bg-white p-6 flex flex-col shadow-sm mx-auto`}
      style={{ 
        boxShadow: review.id === 1 
          ? '0px 4px 12px rgba(144, 205, 144, 0.5)' 
          : review.id === 2 
            ? '0px 4px 12px rgba(255, 87, 87, 0.3)' 
            : '0px 4px 12px rgba(87, 155, 255, 0.3)'
      }}
    >
      <div className="flex flex-col items-center mb-2">
        <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
          <img 
            src={review.image} 
            alt={review.name}
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="text-center">
          <h4 className="font-medium text-lg mb-1">{review.name}</h4>
          <p className="text-sm text-gray-500">Verified Purchase</p>
        </div>
      </div>
      
      <div className="flex justify-center mb-4">
        <div className="flex text-[#FF5757]">
          {'★★★★★'.split('').map((star, i) => (
            <span key={i}>{star}</span>
          ))}
        </div>
      </div>
      
      <h3 className="text-lg font-bold mb-2 text-center">{review.headline}</h3>
      <p className="text-sm text-gray-600 mb-4 overflow-y-auto leading-relaxed">{review.content}</p>

      <div className="flex flex-col items-center gap-2 mt-auto">
        <span 
          className="text-xs font-medium py-1 px-3 rounded-full"
          style={{
            backgroundColor: review.id === 1 
              ? 'rgba(144, 205, 144, 0.2)' 
              : review.id === 2 
                ? 'rgba(255, 87, 87, 0.1)' 
                : 'rgba(87, 155, 255, 0.1)',
            color: review.id === 1 
              ? '#3e8e41' 
              : review.id === 2 
                ? '#FF5757' 
                : '#579BFF'
          }}
        >
          {review.category}
        </span>

        <p className="text-xs text-gray-400">
          Reviewed on {review.date}
        </p>
      </div>
    </div>
  );

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#FF5757]">
          15,000+ Great<br />Reviews
        </h2>
        
        {/* Web View - Multiple Reviews */}
        <div className="hidden md:block relative">
          <div className="flex gap-6 pb-8 overflow-x-auto no-scrollbar">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} isMobile={false} />
            ))}
          </div>
        </div>

        {/* Mobile View - Single Review */}
        <div className="md:hidden relative w-full">
          <ReviewCard review={currentReview} isMobile={true} />
          
          <button 
            onClick={handlePrevReview}
            className="absolute top-1/2 -left-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          
          <button 
            onClick={handleNextReview}
            className="absolute top-1/2 -right-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div className="flex justify-center gap-2 mt-6">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReviewIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentReviewIndex ? 'bg-[#FF5757]' : 'bg-gray-300'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews; 