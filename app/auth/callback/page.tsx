import { Suspense } from "react";
import AuthCallbackContent from "./content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Processing Invitation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Loading...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}