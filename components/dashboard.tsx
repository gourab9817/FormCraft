"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useFormBuilderStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Users,
  Eye,
  TrendingUp,
  FileText,
  Plus,
  ArrowRight,
  Download,
  Share2,
  Trash2,
  Edit,
  Sun,
  Moon,
} from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { useTheme } from "@/lib/theme-context"

export function Dashboard() {
  const { savedForms, loadForm } = useFormBuilderStore()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock analytics data
  const analyticsData = {
    totalForms: savedForms.length,
    totalViews: 12543,
    totalSubmissions: 3421,
    conversionRate: 27.3,
    recentActivity: [
      { form: "Contact Form", views: 234, submissions: 45, date: "2024-01-15" },
      { form: "Survey Form", views: 189, submissions: 32, date: "2024-01-14" },
      { form: "Registration", views: 156, submissions: 28, date: "2024-01-13" },
    ],
  }

  const handleDeleteForm = (formId: string) => {
    // Implementation for deleting forms
    toast({
      title: "Form Deleted",
      description: "Form has been permanently deleted.",
    })
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gradient-to-br from-gray-900 to-purple-900" : "bg-gradient-to-br from-gray-50 to-blue-50"
      }`}
    >
      {/* Header */}
      <div
        className={`${
          theme === "dark" ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
        } backdrop-blur-sm border-b shadow-sm`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className={`mt-1 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Manage your forms and view analytics
              </p>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Button variant="ghost" onClick={toggleTheme} size="sm">
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Link href="/builder">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-sm md:text-base">
                  <Plus className="w-4 h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">New Form</span>
                  <span className="sm:hidden">New</span>
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 md:mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="forms">My Forms</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              {[
                {
                  title: "Total Forms",
                  value: analyticsData.totalForms,
                  icon: FileText,
                  color: "text-blue-600",
                  bg: theme === "dark" ? "bg-blue-500/20" : "bg-blue-50",
                },
                {
                  title: "Total Views",
                  value: analyticsData.totalViews.toLocaleString(),
                  icon: Eye,
                  color: "text-green-600",
                  bg: theme === "dark" ? "bg-green-500/20" : "bg-green-50",
                },
                {
                  title: "Submissions",
                  value: analyticsData.totalSubmissions.toLocaleString(),
                  icon: Users,
                  color: "text-purple-600",
                  bg: theme === "dark" ? "bg-purple-500/20" : "bg-purple-50",
                },
                {
                  title: "Conversion Rate",
                  value: `${analyticsData.conversionRate}%`,
                  icon: TrendingUp,
                  color: "text-orange-600",
                  bg: theme === "dark" ? "bg-orange-500/20" : "bg-orange-50",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`hover:shadow-lg transition-shadow ${
                      theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
                    }`}
                  >
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className={`text-xs md:text-sm mb-1 ${
                              theme === "dark" ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {stat.title}
                          </p>
                          <p className="text-lg md:text-2xl font-bold">{stat.value}</p>
                        </div>
                        <div className={`p-2 md:p-3 rounded-lg ${stat.bg}`}>
                          <stat.icon className={`w-4 md:w-6 h-4 md:h-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <Card className={theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 ${
                        theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
                      } rounded-lg`}
                    >
                      <div>
                        <h4 className="font-medium">{activity.form}</h4>
                        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          {activity.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{activity.views}</div>
                          <div className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Views</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{activity.submissions}</div>
                          <div className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Submissions</div>
                        </div>
                        <Badge variant="secondary">
                          {Math.round((activity.submissions / activity.views) * 100)}% CVR
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {savedForms.map((form, index) => (
                <motion.div
                  key={form.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`hover:shadow-lg transition-all duration-300 group ${
                      theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
                    }`}
                  >
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{form.title}</h3>
                          {form.description && (
                            <p
                              className={`text-sm mb-3 line-clamp-2 ${
                                theme === "dark" ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {form.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {form.fields.length} fields
                        </Badge>
                        {form.isMultiStep && (
                          <Badge variant="secondary" className="text-xs">
                            {form.steps.length} steps
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {new Date(form.updatedAt).toLocaleDateString()}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href="/builder">
                          <Button size="sm" onClick={() => loadForm(form.id)} className="flex-1">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteForm(form.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {savedForms.length === 0 && (
                <div className="col-span-full">
                  <Card className={theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}>
                    <CardContent className="pt-6">
                      <div className="text-center py-8 md:py-12">
                        <FileText
                          className={`w-12 md:w-16 h-12 md:h-16 mx-auto mb-4 ${
                            theme === "dark" ? "text-gray-600" : "text-gray-300"
                          }`}
                        />
                        <h3 className="text-lg font-semibold mb-2">No forms yet</h3>
                        <p className={`mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          Create your first form to get started
                        </p>
                        <Link href="/builder">
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Form
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card className={theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}>
                <CardHeader>
                  <CardTitle>Form Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3
                        className={`w-12 md:w-16 h-12 md:h-16 mx-auto mb-4 ${
                          theme === "dark" ? "text-gray-600" : "text-gray-300"
                        }`}
                      />
                      <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
                        Analytics charts would be displayed here
                      </p>
                      <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                        Integration with analytics service required
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card className={theme === "dark" ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Notifications</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">New form submissions</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">Weekly analytics reports</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Data Export</label>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export All Data
                      </Button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Theme</label>
                      <Button variant="outline" onClick={toggleTheme}>
                        {theme === "dark" ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                        Switch to {theme === "dark" ? "Light" : "Dark"} Mode
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
