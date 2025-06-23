import React, { useEffect, useState, useContext } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { UserContext } from "@/context/UserReducer";
import { getTeachingTips } from "@/services/aiService";

const DEFAULT_TIPS = [
  "שלב אלמנטים חזותיים בהוראה להגברת ההבנה והזיכרון.",
  "הקדש זמן לרפלקציה בסוף כל שיעור.",
  "התאם את ההוראה לסגנונות למידה שונים."
];

const TeachingTips: React.FC = () => {
  const { user } = useContext(UserContext);
  const [tips, setTips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTips = async () => {
      try {
        if (user?.id) {
          const data = await getTeachingTips(user.id);
          if (data && data.length > 0) {
            setTips(data);
          } else {
            // במקרה שחוזר מערך ריק
            setTips(DEFAULT_TIPS);
          }
        } else {
          // אם אין יוזר — גם טיפים ברירת מחדל
          setTips(DEFAULT_TIPS);
        }
      } catch (error) {
        console.error("שגיאה בטעינת טיפים:", error);
        setTips(DEFAULT_TIPS);
      } finally {
        setIsLoading(false);
      }
    };

    loadTips();
  }, [user]);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-blue-700">
          <Lightbulb className="mr-2 h-5 w-5 text-blue-500" />
          טיפים להוראה
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-blue-100 rounded w-3/4"></div>
            <div className="h-4 bg-blue-100 rounded w-5/6"></div>
            <div className="h-4 bg-blue-100 rounded w-4/5"></div>
          </div>
        ) : (
          <ul className="space-y-3 text-right">
            {tips.slice(0, 3).map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <div className="w-5 h-5 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p>{tip.replace(/^\d+\.\s*/, "")}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default TeachingTips;
