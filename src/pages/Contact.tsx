
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from './index-components/ContactForm';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-600 via-green-500 to-blue-600 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-lg md:text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Have questions about our platform? Want to provide feedback? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
