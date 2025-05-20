import React from 'react';

const CustomerReviews = () => {
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

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#FF5757]">
          15,000+ Great<br />Reviews
        </h2>
        
        <div className="relative">
          <div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="min-w-[320px] max-w-[380px] rounded-3xl border border-gray-200 bg-white p-6 flex flex-col shadow-sm"
                style={{ 
                  boxShadow: review.id === 1 
                    ? '0px 4px 12px rgba(144, 205, 144, 0.5)' 
                    : review.id === 2 
                      ? '0px 4px 12px rgba(255, 87, 87, 0.3)' 
                      : '0px 4px 12px rgba(87, 155, 255, 0.3)'
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden mr-3">
                    <img 
                      src={review.image} 
                      alt={review.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">{review.name}</h4>
                    <p className="text-sm text-gray-500">Verified Purchase</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex text-[#FF5757]">
                    {'★★★★★'.split('').map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold mb-3">{review.headline}</h3>
                <p className="text-gray-600 mb-6 flex-grow">{review.content}</p>
                
                <div className="mt-auto">
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
                  
                  <p className="text-xs text-gray-400 mt-4">
                    Reviewed on {review.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="absolute top-1/2 -left-4 -translate-y-1/2">
            <button className="bg-white rounded-full p-2 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </div>
          
          <div className="absolute top-1/2 -right-4 -translate-y-1/2">
            <button className="bg-white rounded-full p-2 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews; 