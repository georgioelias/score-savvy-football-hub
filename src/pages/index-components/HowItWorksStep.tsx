
import React from 'react';

const HowItWorksStep = ({ icon, step, title, description }: { icon: React.ReactNode, step: string, title: string, description: string }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
    <div className="flex justify-center items-center h-16 w-16 bg-green-100 rounded-full mx-auto mb-6">
      {icon}
    </div>
    <span className="text-sm font-bold text-green-600 tracking-wider">{step.toUpperCase()}</span>
    <h4 className="text-xl font-semibold text-gray-900 mt-2 mb-3">{title}</h4>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default HowItWorksStep;
