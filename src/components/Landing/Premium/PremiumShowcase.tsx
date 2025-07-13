import React from 'react';

const PremiumShowcase: React.FC = () => {
  return (
    <section className="py-16 px-8 bg-muted/20">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">See It In Action</h2>
        <div className="flex justify-center">
          <div className="w-full max-w-4xl h-64 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
            <p className="text-lg text-muted-foreground">Premium Showcase Demo</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumShowcase;