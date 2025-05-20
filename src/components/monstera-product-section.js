import React from 'react';

function MonsteraProductSection() {
  return (
    <section className="py-16 bg-[#fffbef] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 relative">
          <div className="md:w-5/12">
            <img 
              src="/assets/bannerwithhand.png" 
              alt="Monstera Plant Food" 
              className="max-w-full relative z-10 rounded-lg mx-auto"
            />
          </div>
          <div className="md:w-5/12">
            <h2 className="text-4xl font-bold text-[#444] mb-4">Clean, effective formulas.</h2>
            <h2 className="text-4xl font-bold text-[#444] mb-6">Specific Plant Instructions.</h2>
            <p className="text-5xl font-bold text-[#ff7e78] mb-8">It's that easy.</p>
            
            <div className="space-y-5 mb-8">
              <div className="flex items-center gap-3">
                <span className="text-green-500">
                  <img src="/assets/leaf.png" alt="Leaf" className="w-6 h-6" />
                </span>
                <span className="text-xl font-medium">Simplify plant care.</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-green-500">
                  <img src="/assets/leaf.png" alt="Leaf" className="w-6 h-6" />
                </span>
                <span className="text-xl font-medium">Support all growers.</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-green-500">
                  <img src="/assets/leaf.png" alt="Leaf" className="w-6 h-6" />
                </span>
                <span className="text-xl font-medium">Nourish every plant.</span>
              </div>
            </div>
            
            <button className="bg-[#ff7e78] text-white px-10 py-3 rounded-full text-lg font-medium hover:bg-[#ff6c65] transition-colors uppercase">
              Shop All
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MonsteraProductSection; 