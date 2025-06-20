"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";

export default function UnauthorizedPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-10 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            The page you're trying to access requires special permissions that your account doesn't have.
          </p>
          
          <div className="space-y-2">
            {user ? (
              <Button asChild className="w-full">
                <Link href="/">Go to Homepage</Link>
              </Button>
            ) : (
              <Button asChild className="w-full">
                <Link href="/login">Login to Continue</Link>
              </Button>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground">
            If you believe this is an error, please contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
