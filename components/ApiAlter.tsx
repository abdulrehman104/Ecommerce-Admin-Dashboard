import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge, BadgeProps } from "@/components/ui/badge";

import { Copy, Server } from "lucide-react";
import toast from "react-hot-toast";

interface AProps {
  title: string;
  desc: string;
  varient: "public" | "admin";
}

const textMap: Record<AProps["varient"], string> = {
  public: "Public",
  admin: "Admin",
};

const varientMap: Record<AProps["varient"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

const ApiAlter = ({ title, desc, varient = "public" }: AProps) => {
  const onCopy = () => {
    navigator.clipboard.writeText(desc);
    toast.success("APi Route copied to clipboard");
  };

  return (
    <Alert>
      <Server className="size-4" />
      <AlertTitle className="flex gap-x-2">
        {title}
        <Badge variant={varientMap[varient]}>{textMap[varient]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="bg-muted text-s relative rounded-md px-[0.3rem] py-[0.2rem] font-mono font-semibold">
          {desc}
        </code>
        <Button variant="outline" size="sm" onClick={onCopy}>
          <Copy className="size-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ApiAlter;
