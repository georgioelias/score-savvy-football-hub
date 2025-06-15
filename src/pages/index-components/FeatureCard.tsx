
import React from 'react';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
    <div className="flex justify-center mb-6">{icon}</div>
    <h4 className="text-xl font-bold text-gray-900 text-center mb-3">{title}</h4>
    <p className="text-gray-600 text-center leading-relaxed">{description}</p>
  </div>
);

export default FeatureCard;
