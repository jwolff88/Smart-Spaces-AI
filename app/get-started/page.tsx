"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, User, ArrowRight, Building, AlertCircle } from "lucide-react"
import Image from "next/image"

export default function GetStartedPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [userType, setUserType] = useState<"guest" | "host" | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const steps = [
    { id: 1, title: "Choose Your Role", description: "Are you looking to book or host?" },
    { id: 2, title: "Create Account", description: "Set up your Smart Spaces AI account" },
    { id: 3, title: "Welcome!", description: "You're all set to get started" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === 1 && userType) {
      setCurrentStep(2)
    } else if (currentStep === 2) {
      if (validateForm()) {
        setCurrentStep(3)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Smart Spaces AI" width={40} height={40} className="rounded-lg" />
            <span className="text-xl font-bold">Smart Spaces AI</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started with Smart Spaces AI</h1>
            <p className="text-gray-600 mb-6">
              Join the soon thousands of property managers and guests who trust our platform
            </p>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Step {currentStep} of {steps.length}
                </span>
                <span className="text-sm font-medium text-gray-700">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center space-x-8 mb-8">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      currentStep >= step.id
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-gray-300 text-gray-400"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Experience</h2>
                    <p className="text-gray-600">Select how you plan to use Smart Spaces AI</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Guest Option */}
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        userType === "guest" ? "ring-2 ring-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setUserType("guest")}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <User className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">I'm a Guest</h3>
                        <p className="text-gray-600 mb-4">Looking for the perfect place to stay</p>
                        <ul className="text-sm text-gray-500 space-y-1">
                          <li>• AI-powered property recommendations</li>
                          <li>• Smart booking and pricing</li>
                          <li>• Personalized travel experiences</li>
                          <li>• 24/7 customer support</li>
                        </ul>
                        {userType === "guest" && <Badge className="mt-4">Selected</Badge>}
                      </CardContent>
                    </Card>

                    {/* Host Option */}
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        userType === "host" ? "ring-2 ring-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setUserType("host")}
                    >
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Building className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">I'm a Host</h3>
                        <p className="text-gray-600 mb-4">Ready to list and manage properties</p>
                        <ul className="text-sm text-gray-500 space-y-1">
                          <li>• AI-driven pricing optimization</li>
                          <li>• Automated guest communication</li>
                          <li>• Property performance analytics</li>
                          <li>• Revenue maximization tools</li>
                        </ul>
                        {userType === "host" && <Badge className="mt-4">Selected</Badge>}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h2>
                    <p className="text-gray-600">
                      {userType === "guest"
                        ? "Set up your guest account to start finding amazing places to stay"
                        : "Set up your host account to start managing your properties"}
                    </p>
                  </div>

                  <form className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.firstName ? "border-red-500" : "border-gray-300"
                          }`}
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          placeholder="Enter your first name"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.lastName ? "border-red-500" : "border-gray-300"
                          }`}
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          placeholder="Enter your last name"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email address"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.location ? "border-red-500" : "border-gray-300"
                        }`}
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="City, State/Country"
                      />
                      {errors.location && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.location}
                        </p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.password ? "border-red-500" : "border-gray-300"
                          }`}
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          placeholder="Create a password"
                        />
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.password}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.confirmPassword ? "border-red-500" : "border-gray-300"
                          }`}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mt-4">
                      <span className="text-red-500">*</span> Required fields
                    </div>
                  </form>
                </div>
              )}

              {currentStep === 3 && (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Smart Spaces AI! 🎉</h2>
                    <p className="text-gray-600 mb-6">
                      Your account has been created successfully.
                      {userType === "guest"
                        ? " You're ready to discover amazing places to stay!"
                        : " You're ready to start managing your properties with AI!"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
                    <div className="space-y-3 text-left">
                      {userType === "guest" ? (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">1</span>
                            </div>
                            <span className="text-sm">Complete your profile for better recommendations</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">2</span>
                            </div>
                            <span className="text-sm">Browse AI-recommended properties</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">3</span>
                            </div>
                            <span className="text-sm">Book your perfect stay</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-green-600">1</span>
                            </div>
                            <span className="text-sm">Complete your host profile and verification</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-green-600">2</span>
                            </div>
                            <span className="text-sm">List your first property</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-green-600">3</span>
                            </div>
                            <span className="text-sm">Start earning with AI optimization</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <Link href="/complete-profile">
                      <Button size="lg" className="gap-2">
                        Complete Profile
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={userType === "guest" ? "/guest-dashboard" : "/host-dashboard"}>
                      <Button variant="outline" size="lg">
                        Go to Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 3 && (
                <div className="flex justify-between pt-6 border-t">
                  <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={currentStep === 1 && !userType}>
                    {currentStep === 2 ? "Create Account" : "Continue"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help Text */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/signin" className="text-primary hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
