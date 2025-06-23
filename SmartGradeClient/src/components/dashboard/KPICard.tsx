import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  isLoading?: boolean;
  iconBg?: string; 
  iconColor?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  isLoading = false,
  iconColor = "text-blue-600",
  iconBg = "bg-blue-100",
}) => {
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
              <div className={`p-2 rounded-lg ${iconBg}`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
            </div>
            <p className="text-2xl font-semibold mt-2">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default KPICard;
