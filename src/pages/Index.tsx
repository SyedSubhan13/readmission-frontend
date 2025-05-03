
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, ShieldCheck, FileCheck, Zap, CheckCircle } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: <BarChart3 className="w-10 h-10 text-medical-600" />,
      title: "Predictive Analytics",
      description: "Advanced machine learning models to predict 30-day readmission risk based on comprehensive patient data."
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-medical-600" />,
      title: "Evidence-Based",
      description: "Built on established clinical research and continuously validated with real-world hospital data."
    },
    {
      icon: <FileCheck className="w-10 h-10 text-medical-600" />,
      title: "Detailed Reports",
      description: "Generate comprehensive risk assessment reports with actionable recommendations for care teams."
    },
    {
      icon: <Zap className="w-10 h-10 text-medical-600" />,
      title: "Real-time Analysis",
      description: "Process patient data in real-time to provide immediate risk assessments when they're needed most."
    }
  ];

  const benefits = [
    "Reduce 30-day readmission rates by up to 25%",
    "Optimize resource allocation for high-risk patients",
    "Improve care coordination across healthcare teams",
    "Enhance patient outcomes through targeted interventions",
    "Generate significant cost savings for healthcare systems"
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-medical-950 to-medical-800 z-0"></div>
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581093588401-fbb62a02f120?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20 z-0"
          style={{ backgroundPosition: "center 40%" }}
        ></div>
        
        <div className="container mx-auto px-6 z-10 animate-slide-in">
          <div className="max-w-3xl">
            <span className="inline-block py-1 px-3 rounded-full bg-medical-100 text-medical-800 text-sm font-medium mb-4">
              Healthcare AI Solution
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Predict Patient Readmissions with Clinical Precision
            </h1>
            <p className="text-xl text-medical-100 mb-8 max-w-2xl">
              Our advanced predictive model helps hospitals identify high-risk patients, reduce readmission rates, and improve care outcomes through targeted interventions.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                className="bg-medical-500 hover:bg-medical-600 text-white font-medium px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all btn-hover text-lg"
                onClick={() => navigate('/dashboard')}
              >
                Explore Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 font-medium px-8 py-6 rounded-lg btn-hover text-lg"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-10 h-10 rounded-full border-2 border-white/50 flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-white/70 transform rotate-90" />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-medical-100 text-medical-800 text-sm font-medium mb-4">
              Key Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Tools for Healthcare Providers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform leverages advanced machine learning to deliver actionable insights that improve patient care and reduce costs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="bg-medical-50 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-16 mb-10 lg:mb-0">
              <span className="inline-block py-1 px-3 rounded-full bg-medical-100 text-medical-800 text-sm font-medium mb-4">
                Benefits
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Transform Patient Care and Reduce Costs
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                By identifying high-risk patients early, our model enables proactive interventions that improve outcomes and reduce unnecessary readmissions.
              </p>
              
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-medical-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="mt-10 bg-medical-600 hover:bg-medical-700 text-white font-medium px-8 py-3 rounded-lg shadow hover:shadow-md transition-all"
                onClick={() => navigate('/dashboard')}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-medical-100 rounded-lg"></div>
                <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-medical-50 rounded-lg"></div>
                <div className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80" 
                    alt="Healthcare professional analyzing data" 
                    className="w-full h-auto"
                    style={{ maxHeight: "500px", objectFit: "cover" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white font-medium">
                      "This platform has revolutionized how we approach post-discharge care planning."
                    </p>
                    <p className="text-white/70 text-sm mt-2">
                      — Dr. Sarah Chen, Chief Medical Officer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-medical-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to reduce readmissions?
          </h2>
          <p className="text-medical-100 text-lg mb-8 max-w-2xl mx-auto">
            Start using our predictive analytics platform today and transform your approach to patient care management.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              className="bg-white text-medical-900 hover:bg-gray-100 font-medium px-8 py-3 rounded-lg shadow hover:shadow-md transition-all"
              onClick={() => navigate('/dashboard')}
            >
              Explore Dashboard
            </Button>
            <Button 
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 font-medium px-8 py-3 rounded-lg transition-all"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <div className="h-9 w-9 rounded-lg bg-medical-500 flex items-center justify-center text-white font-bold text-xl mr-3">
                  RF
                </div>
                <span className="text-xl font-semibold text-white">
                  ReadmissionForecast
                </span>
              </div>
              <p className="text-gray-400 max-w-xs">
                Advanced predictive analytics for healthcare providers to reduce patient readmissions.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Case Studies</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between">
            <p className="text-gray-500">© 2023 ReadmissionForecast. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <span className="text-gray-500">Made with precision for healthcare professionals</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
