import React, { useState, useEffect, useContext, ReactNode } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserReducer';
import {  LayoutDashboard,  Files,  MessageSquare, ChartBar, User as UserIcon, Menu, 
          LogOut, FileText, Brain, HelpCircle, Sun, Sparkles, BellRing } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger,} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

type Size = "small" | "default" | "large";
interface LogoProps {
    size?: Size;
  }
// SmartGrade Logo Component
const Logo = ({ size = "default" }: LogoProps) => {
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-10 h-10",
    large: "w-14 h-14"
  };
 
  return (
<div className="flex flex-col items-center">
  <div className="flex items-center space-x-0.5">
    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Grade
    </span>
    <svg
  xmlns="http://www.w3.org/2000/svg"
  className="w-6 h-6"
  //animate-bounce"
  fill="none"
  viewBox="0 0 24 24"
  strokeLinecap="round"
  strokeLinejoin="round"
  stroke="url(#gradient)"
>
  <defs>
    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#2563EB" />
      <stop offset="100%" stopColor="#7C3AED" />
    </linearGradient>
  </defs>
  <path strokeWidth={4} d="M5 13l4 4L19 7" />
</svg>

    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Smart
    </span>
  </div>

  {size !== "small" && (
    <p className="text-xs text-gray-500 mt-0 w-full max-w-[12rem] text-center">
      כל מה שמורה צריך, במקום אחד.
    </p>
  )}
</div>

  );
};

const mainNavItems = [
  {
    title: "דשבורד",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "קבצים",
    icon: Files,
    href: "/files",
  },
  {
    title: "צ'אט מורים",
    icon: MessageSquare,
    href: "/chat",
  },
  {
    title: "עוזר AI",
    icon: Brain,
    href: "/AI",
  },
  {
    title: "דוחות",
    icon: ChartBar,
    href: "/reports",
  },
  {
    title: "פרופיל",
    icon: UserIcon,
    href: "/profile",
  }

];


interface LayoutProps {
    children: ReactNode;
  }
  
export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useContext(UserContext);
  const [ currentUser, setCurrentUser] = useState(user);
  const [notifications, setNotifications] = useState(2); // Sample notifications count
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = user;
        setCurrentUser(userData);
      } catch (error) {
        // If no user is logged in and we're not on the landing page, redirect to landing
        if (location.pathname !== "/") {
          navigate('/');
        }
      }
    };
    
    loadUser();
  }, [location.pathname, navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-64 bg-white border-l">
        <div className="p-6">
          <Logo />
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors",
                location.pathname === item.href && "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
              {item.title === "צ'אט מורים" && notifications > 0 && (
                <Badge className="bg-red-500 text-white text-xs">{notifications}</Badge>
              )}
            </Link>
          ))}
        </nav>
        <div className="p-4 mt-2 mx-4 mb-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-blue-700">ברוכים הבאים ל-SmartGrade!</span>
          </div>
          <p className="text-sm text-gray-600">גלו עוד על הכלים החכמים שלנו בעזרת מדריך ההדרכה המלא</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 w-full bg-white border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <HelpCircle className="w-4 h-4 ml-2" />
            להדרכה מלאה
          </Button>
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                {user?.name?.split(' ').map(name => name[0]).join('') || 'מי'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.name || 'משתמש'}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              className="w-10 h-10 rounded-full border-gray-200"
              onClick={() => navigate("/profile")}
            >
              <UserIcon className="h-5 w-5 text-gray-700" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="w-10 h-10 rounded-full border-gray-200 relative"
            >
              <BellRing className="h-5 w-5 text-gray-700" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="w-10 h-10 rounded-full border-gray-200"
              onClick={async () => {
                // await user.logout();
                navigate("/");
              }}
            >
              <LogOut className="h-5 w-5 text-gray-700" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="fixed top-4 right-4 z-10">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64 p-0">
          <div className="flex flex-col h-full bg-white">
            <div className="p-6">
              <Logo />
            </div>
            <nav className="flex-1 px-4 space-y-2">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                  {item.title === "צ'אט מורים" && notifications > 0 && (
                    <Badge className="bg-red-500 text-white text-xs">{notifications}</Badge>
                  )}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t">
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                    {user?.name?.split(' ').map(name => name[0]).join('') || 'מי'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.name || 'משתמש'}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start text-gray-700"
                onClick={async () => {
                //   await User.logout();
                  navigate("/");
                  setIsMobileOpen(false);
                }}
              >
                <LogOut className="w-5 h-5 ml-2" />
                התנתק
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <main className="p-4 md:p-8">
        <Outlet />
     </main>
      </div>
    </div>
  );
}