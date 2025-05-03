import React from 'react';
import { useLocation } from 'react-router-dom';
import { LoginForm, SignupForm } from '@/components/auth/AuthForms';
import { Shield } from 'lucide-react';

const Auth = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  
  return (
    <>
      <title>{isLoginPage ? 'Login' : 'Sign Up'} | HealthRe</title>
      
      <div className="min-h-screen pt-20 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">
                {isLoginPage ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {isLoginPage 
                  ? 'Enter your credentials to access your account' 
                  : 'Choose your account type and provide your details'}
              </p>
            </div>
            
            {isLoginPage ? <LoginForm /> : <SignupForm />}
          </div>
        </div>
        
        <div className="py-4 text-center text-sm text-muted-foreground">
          <p>
            Protected by industry-standard encryption and security practices
          </p>
        </div>
      </div>
    </>
  );
};

export default Auth;
