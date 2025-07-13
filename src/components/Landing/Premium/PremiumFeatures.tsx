import React from 'react';

const PremiumFeatures: React.FC = () => {
  return (
    <section className="py-16 px-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Premium Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Advanced Analytics</h3>
            <p className="text-muted-foreground">Deep insights into your data</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Priority Support</h3>
            <p className="text-muted-foreground">24/7 premium support</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Custom Integrations</h3>
            <p className="text-muted-foreground">Tailored to your workflow</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumFeatures;