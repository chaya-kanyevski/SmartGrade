import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Brain, FileText, BookOpen, BarChart2, ChevronLeft} from 'lucide-react';

type FeatureCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-blue-50">
    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mb-6">
      <Icon className="w-8 h-8 text-blue-500" />
    </div>
    <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default function Landing() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };
  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-right">
      <header className="py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SmartGrade
            </span>
            <p className="text-sm text-gray-600">כל מה שמורה צריך, במקום אחד.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="border-blue-400 text-blue-600 hover:bg-blue-50 hidden md:flex"
            onClick={handleLogin}
          >
            התחברות
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 shadow-md"
            onClick={handleRegister}
          >
            הרשמה עכשיו
          </Button>
        </div>
      </header>
      <section className="py-16 px-4 md:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="block mb-2">כל מה שמורה צריך,</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                במקום אחד
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              מערכת SmartGrade היא פלטפורמה חכמה לניהול הוראה עבור מורים, מרצים ומדריכים מקצועיים.
              נהלו את הקבצים, צרו תוכן לימודי, קבלו ניתוחים חכמים והתקשרו עם עמיתים - הכל תחת קורת גג אחת.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 shadow-lg text-lg py-6"
                onClick={handleLogin}
              >
                התחילו עכשיו
                <ChevronLeft className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-400 text-blue-600 hover:bg-blue-50 text-lg py-6"
                onClick={() => {
                  const el = document.getElementById('features');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                גלו עוד
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -top-8 -right-8 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
            <img
              src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
              alt="דשבורד SmartGrade"
              className="relative rounded-xl shadow-2xl border-8 border-white"
            />
          </div>
        </div>
      </section>
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">פיצ'רים מובילים</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SmartGrade מציעה מגוון כלים חכמים שיעזרו לכם לנהל את ההוראה ביעילות ובקלות
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={MessageCircle}
              title="צ'אט בין מורים"
              description="התקשרו עם עמיתים בזמן אמת, שתפו קבצים והחליפו רעיונות בקלות"
            />
            <FeatureCard
              icon={Brain}
              title="ניתוח AI"
              description="קבלו תובנות חכמות, הפיקו שאלות אוטומטית וזהו תוכן דומה בעזרת טכנולוגיית AI מתקדמת"
            />
            <FeatureCard
              icon={FileText}
              title="ניהול קבצים חכם"
              description="ארגנו את כל חומרי ההוראה שלכם במקום אחד עם תיוג אוטומטי וחיפוש מתקדם"
            />
            <FeatureCard
              icon={BookOpen}
              title="יצירת תוכן לימודי"
              description="צרו מערכי שיעור, מבחנים ושאלונים בקלות עם כלים אוטומטיביים"
            />
            <FeatureCard
              icon={BarChart2}
              title="דוחות וסטטיסטיקות"
              description="קבלו תמונה מלאה על הפעילות שלכם עם גרפים ודוחות אוטומטיים"
            />
          </div>
        </div>
      </section>
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">מוכנים להתחיל?</h2>
          <p className="text-xl mb-10 text-blue-100">
            הצטרפו למאות מורים שכבר משתמשים ב-SmartGrade וחוסכים זמן יקר בעבודת ההוראה
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg text-lg py-6"
            onClick={handleLogin}
          >
            התחברות והתחלת השימוש
          </Button>
        </div>
      </section>
      <footer className="bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-6 md:mb-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-md font-bold text-white">SG</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SmartGrade
            </span>
          </div>
          <p className="text-gray-600 text-center md:text-right">
            &copy; כל הזכויות שמורות. 
          2025
          SmartGrade. 
          </p>
        </div>
      </footer>

    </div>
  );
}
