import { useState, useEffect, useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserReducer';
import { LayoutDashboard, Files, MessageSquare, ChartBar, User as UserIcon, Menu, LogOut, Brain, Sparkles, BellRing } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Logo = () => (
  <div className="flex flex-col items-center">
    <div className="flex items-center space-x-0.5">
      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Grade</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="url(#gradient)">
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <path strokeWidth={4} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Smart</span>
    </div>
    <p className="text-xs text-gray-500 mt-0 w-full max-w-[12rem] text-center">כל מה שמורה צריך, במקום אחד.</p>
  </div>
);

const mainNavItems = [
  { title: "דשבורד", icon: LayoutDashboard, href: "/dashboard" },
  { title: "קבצים", icon: Files, href: "/files" },
  { title: "צ'אט מורים", icon: MessageSquare, href: "/chat" },
  { title: "עוזר AI", icon: Brain, href: "/AI" },
  { title: "דוחות", icon: ChartBar, href: "/reports" },
  { title: "פרופיל", icon: UserIcon, href: "/profile" },
];

export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, userDispatch } = useContext(UserContext);
  const [notifications] = useState(2);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && location.pathname !== "/") navigate("/");
  }, [user, location.pathname, navigate]);

  const renderNavLinks = (closeMobile = false) => (
    mainNavItems.map(({ title, icon: Icon, href }) => (
      <Link key={href} to={href} onClick={() => closeMobile && setIsMobileOpen(false)}
        className={cn("flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors",
          location.pathname === href && "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100")}
      >
        <Icon className="w-5 h-5" />
        <span>{title}</span>
        {title === "צ'אט מורים" && notifications > 0 && (
          <Badge className="bg-red-500 text-white text-xs">{notifications}</Badge>
        )}
      </Link>
    ))
  );

  const UserSection = () => (
    <div className="p-4 border-t text-right">
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
        <Button variant="outline" size="icon" className="w-10 h-10" onClick={() => navigate("/profile")}><UserIcon className="h-5 w-5 text-gray-700" /></Button>
        <Button variant="outline" size="icon" className="w-10 h-10 relative">
          <BellRing className="h-5 w-5 text-gray-700" />
          {notifications > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{notifications}</span>}
        </Button>
        <Button variant="outline" size="icon" className="w-10 h-10" onClick={() => { localStorage.removeItem("token"); userDispatch({ type: "LOG_OUT" }); navigate("/"); }}>
          <LogOut className="h-5 w-5 text-gray-700" />
        </Button>
      </div>
    </div>
  );

  const WelcomeCard = () => (
    <div className="p-4 mt-auto mx-4 mb-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 text-right">
      <div className="flex items-center gap-3">
        <Sparkles className="w-7 h-7 text-blue-500" />
        <div>
          <p className="text-base font-semibold text-blue-700">SmartGrade מברכת אותך!</p>
          <p className="text-sm text-gray-600 mt-1">ניהול ההוראה מעולם לא היה פשוט ונעים יותר. תרגיש בבית</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      <div className="hidden lg:flex flex-col w-64 bg-white border-l sticky top-0 h-screen">
        <div className="p-6"><Logo /></div>
        <nav className="flex-1 px-4 space-y-2">{renderNavLinks()}</nav>
        <WelcomeCard />
        <UserSection />
      </div>
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="fixed top-4 right-4 z-10"><Menu className="h-6 w-6" /></Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64 p-0">
          <div className="flex flex-col h-full bg-white">
            <div className="p-6"><Logo /></div>
            <nav className="flex-1 px-4 space-y-2">{renderNavLinks(true)}</nav>
            <UserSection />
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex-1 min-w-0"><main className="p-4 md:p-8"><Outlet /></main></div>
    </div>
  );
}
