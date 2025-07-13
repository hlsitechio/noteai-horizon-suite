import React from 'react';

const PremiumCTA: React.FC = () => {
  return (
    <section className="py-16 px-8 bg-primary text-primary-foreground">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Go Premium?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of satisfied customers and unlock your full potential
        </p>
        <button className="bg-background text-foreground px-8 py-3 rounded-lg hover:bg-background/90">
          Start Your Premium Journey
        </button>
      </div>
    </section>
  );
};

export default PremiumCTA;