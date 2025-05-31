import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface KPICardProps {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    trend?: "up" | "down" | "neutral";
    isLoading?: boolean;
  }
  
  const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    icon: Icon,
    description,
    trend = "neutral",
    isLoading = false,
  }) => {
  let TrendIcon = Minus;
  let trendColor = "text-gray-500";
  
  if (trend === "up") {
    TrendIcon = ArrowUp;
    trendColor = "text-green-500";
  } else if (trend === "down") {
    TrendIcon = ArrowDown;
    trendColor = "text-red-500";
  }

  return (
    <Card>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
            </div>
            <div className="h-7 bg-gray-200 rounded w-16 mt-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-medium text-gray-500">{title}</h3>
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl font-semibold mt-2">{value}</p>
            <div className={`flex items-center gap-1 text-sm ${trendColor} mt-1`}>
              <TrendIcon className="h-3 w-3" />
              <span>{description}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default KPICard;