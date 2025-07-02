import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SimpleAuthTest() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", { username, email, password });
    
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          firstName: "Test",
          lastName: "User"
        }),
      });
      
      const data = await response.json();
      console.log("Response:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-8">
      <Card className="w-full max-w-md border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-center">Simple Test Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Username</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter username"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter email"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Enter password"
              />
            </div>
            
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Test Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}