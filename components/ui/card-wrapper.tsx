import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface CardWrapperProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function CardWrapper({ title, children, className }: CardWrapperProps) {
  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}
