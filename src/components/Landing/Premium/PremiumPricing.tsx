import React from 'react';

const PremiumPricing: React.FC = () => {
  return (
    <section className="py-16 px-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Premium Pricing</h2>
        <div className="flex justify-center">
          <div className="max-w-md p-8 border rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Premium Plan</h3>
            <p className="text-4xl font-bold mb-6">$99<span className="text-lg text-muted-foreground">/month</span></p>
            <ul className="text-left space-y-2 mb-8">
              <li>✓ All premium features</li>
              <li>✓ Priority support</li>
              <li>✓ Custom integrations</li>
              <li>✓ Advanced analytics</li>
            </ul>
            <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumPricing;