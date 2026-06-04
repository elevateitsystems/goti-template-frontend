import { LucideIcon } from "lucide-react";

interface NotificationColumnProps {
  title: string;
  count: number;
  icon: LucideIcon;
  badgeColor: string;
  children: React.ReactNode;
}

export function NotificationColumn({
  title,
  count,
  icon: Icon,
  badgeColor,
  children,
}: NotificationColumnProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
        <Icon className={badgeColor} />
        <h3 className="font-display font-bold text-white text-base">{title}</h3>
        <span className={`badge text-[9px] ${badgeColor} font-bold ml-auto`}>
          {count}
        </span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
