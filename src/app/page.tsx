"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, MessageSquare, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-400" />
          <span className="text-xl font-bold text-white">Astro Talk AI</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:text-purple-300">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Chat with AI that
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}Understands You
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Experience intelligent conversations powered by advanced AI. 
            Get instant, accurate responses to your questions.
          </p>
          
          <div className="flex gap-4 justify-center mb-20">
            <Link href="/register">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8">
                Start Chatting
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-purple-400 text-purple-300 hover:bg-purple-900/50 text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <MessageSquare className="h-10 w-10 text-purple-400 mb-4" />
                <CardTitle className="text-white">Smart Conversations</CardTitle>
                <CardDescription className="text-slate-400">
                  Natural language understanding for seamless interactions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <Zap className="h-10 w-10 text-purple-400 mb-4" />
                <CardTitle className="text-white">Lightning Fast</CardTitle>
                <CardDescription className="text-slate-400">
                  Get instant responses with minimal latency
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <Shield className="h-10 w-10 text-purple-400 mb-4" />
                <CardTitle className="text-white">Secure & Private</CardTitle>
                <CardDescription className="text-slate-400">
                  Your conversations are protected and confidential
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
