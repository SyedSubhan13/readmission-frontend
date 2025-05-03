import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import { Loader2, Mail, Lock, User, Building2, Phone, MapPin } from 'lucide-react';
import AccountTypeSelector, { AccountType } from './AccountTypeSelector';
import { Link } from 'react-router-dom';

// Login Form Schema
const loginSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

// Personal Sign Up Schema
const personalSignupSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
  phone: z.string().min(6, {
    message: 'Please enter a valid phone number.',
  }),
});

// Organization Sign Up Schema
const organizationSignupSchema = personalSignupSchema.extend({
  organizationName: z.string().min(2, {
    message: 'Organization name must be at least 2 characters.',
  }),
  address: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
  licenseNumber: z.string().min(5, {
    message: 'License number must be at least 5 characters.',
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type PersonalSignupFormValues = z.infer<typeof personalSignupSchema>;
type OrganizationSignupFormValues = z.infer<typeof organizationSignupSchema>;

export const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      console.log(values);
      setIsSubmitting(false);
      toast.success('Login successful');
    }, 1500);
  }

  return (
    <div className="w-full max-w-md animate-scale-in">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      placeholder="you@example.com" 
                      className="pl-10" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80 transition-colors underline">
                    Forgot Password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full hover-lift"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </Form>
      
      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Don't have an account?</span>{' '}
        <Link to="/signup" className="text-primary hover:text-primary/80 font-medium">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export const SignupForm = () => {
  const [accountType, setAccountType] = useState<AccountType>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form for personal accounts
  const personalForm = useForm<PersonalSignupFormValues>({
    resolver: zodResolver(personalSignupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
    },
  });

  // Form for organization accounts
  const organizationForm = useForm<OrganizationSignupFormValues>({
    resolver: zodResolver(organizationSignupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      organizationName: '',
      address: '',
      licenseNumber: '',
    },
  });

  const handleAccountTypeChange = (type: AccountType) => {
    setAccountType(type);
  };

  function onPersonalSubmit(values: PersonalSignupFormValues) {
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      console.log({ type: 'personal', ...values });
      setIsSubmitting(false);
      toast.success('Account created successfully', {
        description: 'You can now log in with your credentials.',
      });
    }, 1500);
  }

  function onOrganizationSubmit(values: OrganizationSignupFormValues) {
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      console.log({ type: 'organization', ...values });
      setIsSubmitting(false);
      toast.success('Organization account created', {
        description: 'Your account is pending verification. We will notify you once it is approved.',
      });
    }, 1500);
  }

  return (
    <div className="w-full max-w-md">
      <AccountTypeSelector selectedType={accountType} onChange={handleAccountTypeChange} />
      
      {accountType === 'personal' ? (
        <Form {...personalForm}>
          <form onSubmit={personalForm.handleSubmit(onPersonalSubmit)} className="space-y-4 animate-scale-in">
            <FormField
              control={personalForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input placeholder="John Doe" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={personalForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input placeholder="you@example.com" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={personalForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={personalForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input placeholder="+1 (555) 123-4567" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full mt-2 hover-lift"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Personal Account'
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...organizationForm}>
          <form onSubmit={organizationForm.handleSubmit(onOrganizationSubmit)} className="space-y-4 animate-scale-in">
            <FormField
              control={organizationForm.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input placeholder="Hospital or Healthcare Organization" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={organizationForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="John Doe" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={organizationForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="+1 (555) 123-4567" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={organizationForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input placeholder="organization@example.com" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={organizationForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={organizationForm.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input placeholder="123 Medical Center Dr, City, State" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={organizationForm.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License/Verification Number</FormLabel>
                  <FormControl>
                    <Input placeholder="HC12345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full mt-2 hover-lift"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Organization Account'
              )}
            </Button>
          </form>
        </Form>
      )}

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Already have an account?</span>{' '}
        <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
          Login
        </Link>
      </div>
    </div>
  );
};
