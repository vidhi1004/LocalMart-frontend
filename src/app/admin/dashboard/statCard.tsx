import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  onClick?: () => void;
  trend?: {
    value: number | string;
    isPositive: boolean;
  };
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  onClick,
  trend,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col justify-between"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 tracking-wide uppercase">
            {title}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900 tracking-tight">
            {value}
          </h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {trend && (
          <span
            className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
              trend.isPositive
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {trend.isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {trend.value}%
          </span>
        )}
        {description && (
          <p className="text-xs text-gray-400 font-medium">{description}</p>
        )}
      </div>
    </div>
  );
}
