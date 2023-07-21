"use client"

import React from "react";
import {Copy, Server} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/Alert";
import {Badge, BadgeProps} from "@/components/ui/Badge";
import {Button} from "@/components/ui/Button";
import {onCopy} from "@/lib/utils";

interface ApiAlertProps {
    title: string;
    description: string;
    variant: "public" | "admin"
}

const textMap: Record<ApiAlertProps["variant"], string> = {
    public: "Public",
    admin: "Admin",
}

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
    public: "secondary",
    admin: "destructive",
}

const ApiAlert: React.FC<ApiAlertProps> = ({title, description, variant = "public"}) => {
    return (
        <Alert>
            <div className="flex items-center space-x-2">
                <Server className="h-4 w-4" />
                <AlertTitle className="flex items-center gap-x-2">
                    <span className="text-sm font-semibold">{title}</span>
                    <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
                </AlertTitle>
            </div>
            <AlertDescription className="mt-4 flex items-center justify-between">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">{description}</code>
                <Button variant="outline" size="sm" onClick={() => onCopy(description)}>
                    <Copy className="h-4 w-4"/>
                </Button>
            </AlertDescription>
        </Alert>
    )
};

export default ApiAlert;
