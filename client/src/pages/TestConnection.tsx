import { useEffect, useState } from "react";
import { api, paymentMethodsApi, transactionsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestConnection() {
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    testServerConnection();
  }, []);

  const testServerConnection = async () => {
    setConnectionStatus("testing");
    setTestResults([]);
    setServerMessage("");

    console.log("==================================================");
    console.log("🔍 Starting server connection test...");
    console.log("==================================================");

    try {
      const isConnected = await api.testConnection();
      
      if (isConnected) {
        setConnectionStatus("success");
        setServerMessage("Server is running and responding correctly!");
        console.log("==================================================");
        console.log("✅ Connection test PASSED");
        console.log("==================================================");
      } else {
        setConnectionStatus("error");
        setServerMessage("Server connection failed. Check if server is running on port 3000.");
        console.log("==================================================");
        console.log("❌ Connection test FAILED");
        console.log("==================================================");
      }
    } catch (error) {
      setConnectionStatus("error");
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setServerMessage("Error: " + errorMsg);
      console.log("==================================================");
      console.error("❌ Connection error:", error);
      console.log("==================================================");
    }
  };

  const testPaymentMethodsAPI = async () => {
    console.log("==================================================");
    console.log("📡 Testing Payment Methods API...");
    console.log("==================================================");
    const results: any[] = [];

    try {
      console.log("→ Testing: GET /api/payments-method");
      const response = await paymentMethodsApi.getAll();
      console.log("✅ Success! Response:", response);
      results.push({
        endpoint: "GET /api/payments-method",
        status: "success",
        data: response,
      });
    } catch (error: any) {
      console.error("❌ Failed:", error.message);
      results.push({
        endpoint: "GET /api/payments-method",
        status: "error",
        error: error.message,
      });
    }

    try {
      console.log("→ Testing: GET /api/payments-method/active");
      const response = await paymentMethodsApi.getActive();
      console.log("✅ Success! Response:", response);
      results.push({
        endpoint: "GET /api/payments-method/active",
        status: "success",
        data: response,
      });
    } catch (error: any) {
      console.error("❌ Failed:", error.message);
      results.push({
        endpoint: "GET /api/payments-method/active",
        status: "error",
        error: error.message,
      });
    }

    console.log("==================================================");
    setTestResults(results);
  };

  const testTransactionsAPI = async () => {
    console.log("==================================================");
    console.log("📡 Testing Transactions API...");
    console.log("==================================================");
    const results: any[] = [];

    try {
      console.log("→ Testing: GET /api/transactions");
      const response = await transactionsApi.getAll();
      console.log("✅ Success! Response:", response);
      results.push({
        endpoint: "GET /api/transactions",
        status: "success",
        data: response,
      });
    } catch (error: any) {
      console.error("❌ Failed:", error.message);
      results.push({
        endpoint: "GET /api/transactions",
        status: "error",
        error: error.message,
      });
    }

    try {
      console.log("→ Testing: GET /api/transactions/status/completed");
      const response = await transactionsApi.getByStatus("completed");
      console.log("✅ Success! Response:", response);
      results.push({
        endpoint: "GET /api/transactions/status/completed",
        status: "success",
        data: response,
      });
    } catch (error: any) {
      console.error("❌ Failed:", error.message);
      results.push({
        endpoint: "GET /api/transactions/status/completed",
        status: "error",
        error: error.message,
      });
    }

    console.log("==================================================");
    setTestResults(results);
  };

  const statusColor = connectionStatus === "testing"
    ? "bg-yellow-500 animate-pulse"
    : connectionStatus === "success"
    ? "bg-green-500"
    : connectionStatus === "error"
    ? "bg-red-500"
    : "bg-gray-300";

  const statusText = connectionStatus === "testing"
    ? "Testing connection..."
    : connectionStatus === "success"
    ? "✅ Connected to server"
    : connectionStatus === "error"
    ? "❌ Connection failed"
    : "Idle";

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">🔗 Server Connection Test</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
          <CardDescription>Testing connection to backend server</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={"w-4 h-4 rounded-full " + statusColor} />
            <span className="font-medium">{statusText}</span>
            <Button onClick={testServerConnection} variant="outline" size="sm">
              Retry
            </Button>
          </div>

          {serverMessage && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="text-sm font-mono">{serverMessage}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Button onClick={testPaymentMethodsAPI} disabled={connectionStatus !== "success"}>
          Test Payment Methods API
        </Button>
        <Button onClick={testTransactionsAPI} disabled={connectionStatus !== "success"}>
          Test Transactions API
        </Button>
      </div>

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>API Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((result, index) => {
                const bgColor = result.status === "success" 
                  ? "bg-green-50 border-green-200" 
                  : "bg-red-50 border-red-200";
                const badgeColor = result.status === "success"
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800";

                return (
                  <div key={index} className={"p-4 rounded-md border " + bgColor}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-medium">{result.endpoint}</span>
                      <span className={"text-xs px-2 py-1 rounded " + badgeColor}>
                        {result.status}
                      </span>
                    </div>
                    {result.error && (
                      <p className="text-sm text-red-600 font-mono">{result.error}</p>
                    )}
                    {result.data && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground mb-1">Response:</p>
                        <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Console Logs</CardTitle>
          <CardDescription>Check browser console (F12) for detailed logs</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Open your browser developer console to see detailed connection logs and API responses.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
