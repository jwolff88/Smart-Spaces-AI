"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Camera,
  MapPin,
  Phone,
  Mail,
  Shield,
  Home,
  Star,
  Upload,
  CheckCircle,
  AlertCircle,
  Globe,
} from "lucide-react"

export default function CompleteProfilePage() {
  const [profileCompletion, setProfileCompletion] = useState(35)
  const [uploadedPhoto, setUploadedPhoto] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "verified" | "none">("none")

  const handlePhotoUpload = () => {
    setUploadedPhoto(true)
    setProfileCompletion((prev) => Math.min(prev + 15, 100))
  }

  const handleVerification = () => {
    setVerificationStatus("pending")
    setProfileCompletion((prev) => Math.min(prev + 20, 100))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center gap-2 mb-6">
            <img src="/logo.png" alt="Smart Spaces AI" className="h-10 w-10 rounded" />
            <span className="text-2xl font-bold">Smart Spaces AI</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Complete Your Profile</h1>
          <p className="mt-2 text-gray-600">Help us personalize your Smart Spaces AI experience</p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Profile Completion</h3>
              <span className="text-sm font-medium text-primary">{profileCompletion}%</span>
            </div>
            <Progress value={profileCompletion} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              Complete your profile to unlock all Smart Spaces AI features and get better recommendations
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Photo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Profile Photo
                </CardTitle>
                <CardDescription>Add a profile photo to help others recognize you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {uploadedPhoto ? (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                        <User className="w-12 h-12 text-white" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    {uploadedPhoto && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Button onClick={handlePhotoUpload} variant={uploadedPhoto ? "outline" : "default"}>
                      <Upload className="w-4 h-4 mr-2" />
                      {uploadedPhoto ? "Change Photo" : "Upload Photo"}
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">
                      JPG, PNG or GIF. Max size 5MB. Square images work best.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input id="displayName" placeholder="How you'd like to be called" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your interests, and what you're looking for..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input id="occupation" placeholder="Your job title or profession" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="languages">Languages Spoken</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select languages" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="it">Italian</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location & Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location & Contact
                </CardTitle>
                <CardDescription>Help us provide location-based recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Your current city" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="cst">Central Time (CST)</SelectItem>
                      <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input id="emergencyContact" placeholder="Name and phone number" />
                </div>
              </CardContent>
            </Card>

            {/* Travel Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Travel & Property Preferences
                </CardTitle>
                <CardDescription>Help our AI provide better recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Property Types You Prefer</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {["Apartment", "House", "Condo", "Villa", "Studio", "Loft"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox id={type.toLowerCase()} />
                          <Label htmlFor={type.toLowerCase()} className="text-sm">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Important Amenities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {["WiFi", "Kitchen", "Parking", "Pool", "Gym", "Pet-friendly"].map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox id={amenity.toLowerCase().replace("-", "")} />
                          <Label htmlFor={amenity.toLowerCase().replace("-", "")} className="text-sm">
                            {amenity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budgetRange">Typical Budget Range</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="budget">$50-100/night</SelectItem>
                          <SelectItem value="mid">$100-200/night</SelectItem>
                          <SelectItem value="luxury">$200-500/night</SelectItem>
                          <SelectItem value="premium">$500+/night</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="travelFrequency">Travel Frequency</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="How often do you travel?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Few times a year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Verification
                </CardTitle>
                <CardDescription>Verify your identity to build trust</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Email</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Verified
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Phone</span>
                    </div>
                    <Badge variant="outline">Not Verified</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Identity</span>
                    </div>
                    {verificationStatus === "pending" ? (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                        Pending
                      </Badge>
                    ) : verificationStatus === "verified" ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not Verified</Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <Button
                  onClick={handleVerification}
                  className="w-full"
                  variant={verificationStatus === "none" ? "default" : "outline"}
                  disabled={verificationStatus === "pending"}
                >
                  {verificationStatus === "pending" ? (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Verification Pending
                    </>
                  ) : verificationStatus === "verified" ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verified
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Verify Identity
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Strength</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Basic Info</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Profile Photo</span>
                    {uploadedPhoto ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Verification</span>
                    {verificationStatus === "verified" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Preferences</span>
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                  </div>
                </div>

                <Separator />

                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profileCompletion}%</div>
                  <p className="text-sm text-gray-600">Complete</p>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Star className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Better Recommendations</p>
                    <p className="text-xs text-gray-600">AI learns your preferences</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Increased Trust</p>
                    <p className="text-xs text-gray-600">Verified profiles get more bookings</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Home className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Priority Support</p>
                    <p className="text-xs text-gray-600">Faster response times</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button className="flex-1" size="lg">
            Save Profile
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" size="lg" asChild>
            <Link href="/dashboard">Skip for Now</Link>
          </Button>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-6">
          <Link href="/dashboard" className="text-sm text-primary hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
