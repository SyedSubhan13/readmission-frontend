import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, LineChart, FileText, Settings, Search, User, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/lib/auth'; // You'll need to create this auth context
import { DataSettingsButton } from './DataSettingsButton';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth(); // Add auth context
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const menuItems = [
    { name: 'Home', path: '/', icon: <Home className="h-4 w-4 mr-2" /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LineChart className="h-4 w-4 mr-2" /> },
    { name: 'Reports', path: '/reports', icon: <FileText className="h-4 w-4 mr-2" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-4 w-4 mr-2" /> },
  ];
  
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center group"
          >
            <div className="h-9 w-9 rounded-lg bg-medical-500 flex items-center justify-center text-white font-bold text-xl mr-3 shadow-sm group-hover:shadow group-hover:bg-medical-600 transition-all">
              RF
            </div>
            <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-medical-800 to-medical-600">
              ReadmissionForecast
            </span>
          </button>
        </div>
        
        <div className="hidden md:flex items-center space-x-1">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "default" : "ghost"}
              className={`flex items-center px-3 py-2 rounded-md ${
                location.pathname === item.path 
                  ? 'bg-medical-100 text-medical-800' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {item.name}
            </Button>
          ))}
          
          {/* Add DataSettingsButton here */}
          {(location.pathname === '/dashboard' || location.pathname === '/reports') && (
            <DataSettingsButton />
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-full md:w-auto py-2 pl-10 pr-4 rounded-lg bg-gray-50 border-0 focus:ring-1 focus:ring-medical-400 text-sm"
            />
          </div>
          
          {/* Auth buttons */}
          {!user ? (
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-gray-700"
              >
                Log in
              </Button>
              <Button
                onClick={() => navigate('/signup')}
                className="bg-medical-600 text-white hover:bg-medical-700"
              >
                Sign up
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <div className="h-8 w-8 rounded-full bg-medical-100 flex items-center justify-center">
                    {user.imageUrl ? (
                      <img 
                        src={user.imageUrl} 
                        alt={user.fullName || 'Profile'} 
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <User className="h-4 w-4 text-medical-600" />
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.fullName || 'User'}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.primaryEmailAddress?.emailAddress || user.email || 'No email'}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="p-2"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-3 animate-slide-in">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {menuItems.map((item) => (
              <button
                key={item.path}
                className={`w-full flex items-center px-4 py-3 text-left ${
                  location.pathname === item.path
                    ? 'bg-medical-50 text-medical-800'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
            {/* Mobile auth buttons */}
            {!user && (
              <>
                <div className="border-t border-gray-100" />
                <button
                  className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    navigate('/login');
                    setIsOpen(false);
                  }}
                >
                  Log in
                </button>
                <button
                  className="w-full flex items-center px-4 py-3 text-left text-white bg-medical-600 hover:bg-medical-700"
                  onClick={() => {
                    navigate('/signup');
                    setIsOpen(false);
                  }}
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
