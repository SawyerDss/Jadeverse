"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import GlowingButton from "@/components/glowing-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle } from 'lucide-react'

export default function AuthPage() {
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState("login")
  const [error, setError] = useState("")

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      // Simple validation
      if (!loginData.email || !loginData.password) {
        setError("Please fill in all fields")
        return
      }

      await signIn(loginData.email, loginData.password)
      router.push("/")
    } catch (err) {
      setError("Invalid email or password")
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Simple validation
    if (!registerData.username || !registerData.email || !registerData.password) {
      setError("Please fill in all fields")
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      await signUp(registerData.username, registerData.email, registerData.password)
      router.push("/")
    } catch (err) {
      setError("Registration failed")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-16">
      <Card className="w-full max-w-md glass border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            <span className="text-gradient">s0lara</span>
          </CardTitle>
          <CardDescription>Enter the ultimate gaming platform</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-black/50">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary/20">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-primary/20">
                Sign Up
              </TabsTrigger>
            </TabsList>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-md p-3 mt-4 flex items-center text-white">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}

            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="bg-black/50 border-primary/30 focus:border-primary"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="bg-black/50 border-primary/30 focus:border-primary"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="pt-4">
                  <GlowingButton className="w-full" type="submit">
                    Sign In
                  </GlowingButton>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegisterSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={registerData.username}
                    onChange={handleRegisterChange}
                    className="bg-black/50 border-primary/30 focus:border-primary"
                    placeholder="Choose a username"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    className="bg-black/50 border-primary/30 focus:border-primary"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className="bg-black/50 border-primary/30 focus:border-primary"
                    placeholder="Create a password"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    className="bg-black/50 border-primary/30 focus:border-primary"
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                <div className="pt-4">
                  <GlowingButton className="w-full" type="submit">
                    Sign Up
                  </GlowingButton>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-center text-sm text-white/70">
          {activeTab === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => setActiveTab("register")}
                className="text-primary hover:text-primary/80 hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setActiveTab("login")}
                className="text-primary hover:text-primary/80 hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
