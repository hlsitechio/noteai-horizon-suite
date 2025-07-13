import React from 'react';

const PremiumHero: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Premium Experience
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Unlock the full potential of our platform
        </p>
        <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default PremiumHero;