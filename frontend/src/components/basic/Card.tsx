import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";

interface MainCardProps {
  title: string;
  description: string;
  href: string;
  buttonText: string;
  className?: string;
}

const MainCard = ({
  title,
  description,
  href,
  buttonText,
  className,
}: MainCardProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <Link href={href}>
            <h2>{title}</h2>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pointer-events-none">
        <p>{description}</p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <nav>
          <Link href={href} className="text-xl text-blue-500">
            {buttonText}
          </Link>
        </nav>
      </CardFooter>
    </Card>
  );
};

export default MainCard;
