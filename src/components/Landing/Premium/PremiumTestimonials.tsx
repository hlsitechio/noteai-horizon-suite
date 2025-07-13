import React from 'react';

const PremiumTestimonials: React.FC = () => {
  return (
    <section className="py-16 px-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg">
            <p className="text-muted-foreground mb-4">"Amazing premium features that transformed our workflow."</p>
            <p className="font-semibold">- Happy Customer</p>
          </div>
          <div className="p-6 border rounded-lg">
            <p className="text-muted-foreground mb-4">"The best investment we've made for our team."</p>
            <p className="font-semibold">- Satisfied User</p>
          </div>
          <div className="p-6 border rounded-lg">
            <p className="text-muted-foreground mb-4">"Premium support is outstanding and responsive."</p>
            <p className="font-semibold">- Loyal Client</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumTestimonials;