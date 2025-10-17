import React from 'react';
import { Heart, Users, Clock, Shield, Phone, Mail, MapPin } from 'lucide-react';

const NurseAbout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-12 w-12 text-pink-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">About Our Nursing Team</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dedicated to providing exceptional patient care with compassion, expertise, and innovation.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 text-center leading-relaxed">
              Our nursing team is committed to delivering the highest quality of patient care through 
              evidence-based practice, continuous learning, and compassionate service. We strive to 
              create a healing environment where patients feel safe, respected, and well-cared for.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Compassion</h3>
            <p className="text-gray-600">
              We provide care with empathy and understanding, treating each patient with dignity and respect.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Safety</h3>
            <p className="text-gray-600">
              Patient safety is our top priority, ensuring the highest standards of care and medication administration.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaboration</h3>
            <p className="text-gray-600">
              We work closely with doctors, patients, and families to provide comprehensive care.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Clock className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
            <p className="text-gray-600">
              We continuously improve our skills and knowledge to deliver the best possible care.
            </p>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Patient Care</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Medication administration and monitoring</li>
                <li>• Vital signs assessment</li>
                <li>• Patient education and support</li>
                <li>• Pain management</li>
                <li>• Wound care and dressing changes</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Clinical Excellence</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Evidence-based practice protocols</li>
                <li>• Infection control and prevention</li>
                <li>• Emergency response and critical care</li>
                <li>• Patient advocacy</li>
                <li>• Quality improvement initiatives</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team Stats */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-pink-100">Patients Cared For Monthly</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.8%</div>
              <div className="text-pink-100">Medication Safety Record</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-pink-100">Continuous Care Coverage</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseAbout;

