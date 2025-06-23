import React from "react";
import { MessageCircle, Brain } from "lucide-react";
import { Link } from "react-router-dom";

const QuickLinks: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* <h3 className="text-lg font-semibold text-gray-700">קיצורי דרך שימושיים</h3> */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/chat"
          className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl p-6 shadow-md hover:scale-105 transform transition"
        >
          <MessageCircle className="h-8 w-8 mb-2" />
          <span className="text-lg font-bold">צ׳אט מורים</span>
          <p className="text-sm opacity-80 mt-1 text-center">
            לשוחח בזמן אמת עם מורים אחרים
          </p>
        </Link>

        <Link
          to="/ai"
          className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl p-6 shadow-md hover:scale-105 transform transition"
        >
          <Brain className="h-8 w-8 mb-2" />
          <span className="text-lg font-bold">כלי ה־AI</span>
          <p className="text-sm opacity-80 mt-1 text-center">
            כל הכלים החכמים ליצירת תכנים והוראה קלה יותר
          </p>
        </Link>
      </div>
    </div>
  );
};

export default QuickLinks;
