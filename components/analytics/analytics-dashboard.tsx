"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  MousePointer,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  FileText,
  Download,
  Calendar,
  Shield,
} from "lucide-react"

interface AnalyticsDashboardProps {
  isAdmin?: boolean
}

export function AnalyticsDashboard({ isAdmin = false }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedForm, setSelectedForm] = useState("all")

  // Mock data - in real implementation, this would come from your analytics API
  const mockData = {
    overview: {
      totalViews: 1247,
      totalStarts: 423,
      totalCompletions: 187,
      conversionRate: 44.2,
      avgCompletionTime: "3m 24s",
      abandonmentRate: 55.8,
    },
    formMetrics: {
      "virtual-office": {
        name: "Virtual Office",
        views: 342,
        starts: 156,
        completions: 89,
        conversionRate: 57.1,
        avgTime: "2m 45s",
      },
      coworking: {
        name: "Coworking",
        views: 298,
        starts: 134,
        completions: 67,
        conversionRate: 50.0,
        avgTime: "3m 12s",
      },
      "meeting-room": {
        name: "Meeting Rooms",
        views: 267,
        starts: 89,
        completions: 23,
        conversionRate: 25.8,
        avgTime: "4m 18s",
      },
      advertising: {
        name: "Advertising",
        views: 198,
        starts: 32,
        completions: 6,
        conversionRate: 18.8,
        avgTime: "5m 02s",
      },
      "special-deals": {
        name: "Special Deals",
        views: 142,
        starts: 12,
        completions: 2,
        conversionRate: 16.7,
        avgTime: "2m 56s",
      },
    },
    fieldAnalytics: [
      { field: "firstName", errorRate: 2.1, avgFocusTime: "12s" },
      { field: "email", errorRate: 8.7, avgFocusTime: "18s" },
      { field: "phone", errorRate: 15.3, avgFocusTime: "24s" },
      { field: "companyName", errorRate: 3.2, avgFocusTime: "16s" },
    ],
    recentSubmissions: [
      {
        id: "sub_001",
        formType: "virtual-office",
        timestamp: "2024-01-15T10:30:00Z",
        status: "completed",
        completionTime: "2m 34s",
      },
      {
        id: "sub_002",
        formType: "coworking",
        timestamp: "2024-01-15T09:45:00Z",
        status: "completed",
        completionTime: "3m 12s",
      },
      {
        id: "sub_003",
        formType: "meeting-room",
        timestamp: "2024-01-15T09:15:00Z",
        status: "abandoned",
        completionTime: "1m 45s",
      },
    ],
  }

  const MetricCard = ({ title, value, change, icon: Icon, description }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground">
            <span className={change > 0 ? "text-green-600" : "text-red-600"}>
              {change > 0 ? "+" : ""}
              {change}%
            </span>{" "}
            from last period
          </p>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Privacy-first form analytics with GDPR compliance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <CheckCircle className="w-3 h-3 text-green-600" />
            <span>GDPR Compliant</span>
          </Badge>
          {isAdmin && (
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          )}
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center space-x-2">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <div className="flex space-x-1">
          {["24h", "7d", "30d", "90d"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Form Views"
          value={mockData.overview.totalViews.toLocaleString()}
          change={12.5}
          icon={Eye}
          description="Unique form page visits"
        />
        <MetricCard
          title="Form Starts"
          value={mockData.overview.totalStarts.toLocaleString()}
          change={8.2}
          icon={MousePointer}
          description="Users who began filling forms"
        />
        <MetricCard
          title="Completions"
          value={mockData.overview.totalCompletions.toLocaleString()}
          change={-2.1}
          icon={CheckCircle}
          description="Successfully submitted forms"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${mockData.overview.conversionRate}%`}
          change={-1.3}
          icon={TrendingUp}
          description="Start to completion rate"
        />
      </div>

      <Tabs defaultValue="forms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="forms">Form Performance</TabsTrigger>
          <TabsTrigger value="fields">Field Analytics</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          {isAdmin && <TabsTrigger value="submissions">Recent Submissions</TabsTrigger>}
        </TabsList>

        <TabsContent value="forms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Performance Comparison</CardTitle>
              <CardDescription>Performance metrics for each form type over the selected time period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(mockData.formMetrics).map(([key, form]: [string, any]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{form.name}</span>
                        <Badge variant="secondary">{form.conversionRate}% conversion</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {form.completions}/{form.starts} completions
                      </div>
                    </div>
                    <Progress value={form.conversionRate} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{form.views} views</span>
                      <span>Avg: {form.avgTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fields" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Field-Level Analytics</CardTitle>
              <CardDescription>Error rates and interaction patterns for form fields</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.fieldAnalytics.map((field, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium capitalize">{field.field.replace(/([A-Z])/g, " $1")}</p>
                        <p className="text-sm text-muted-foreground">Avg focus time: {field.avgFocusTime}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-medium ${field.errorRate > 10 ? "text-red-600" : field.errorRate > 5 ? "text-yellow-600" : "text-green-600"}`}
                      >
                        {field.errorRate}% error rate
                      </div>
                      {field.errorRate > 10 && (
                        <div className="flex items-center text-xs text-red-600 mt-1">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Needs attention
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>User journey from form view to completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-blue-600" />
                      <span>Form Views</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{mockData.overview.totalViews}</div>
                      <div className="text-sm text-muted-foreground">100%</div>
                    </div>
                  </div>
                  <Progress value={100} className="h-3" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MousePointer className="w-4 h-4 text-green-600" />
                      <span>Form Starts</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{mockData.overview.totalStarts}</div>
                      <div className="text-sm text-muted-foreground">
                        {((mockData.overview.totalStarts / mockData.overview.totalViews) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <Progress
                    value={(mockData.overview.totalStarts / mockData.overview.totalViews) * 100}
                    className="h-3"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-teal-600" />
                      <span>Completions</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{mockData.overview.totalCompletions}</div>
                      <div className="text-sm text-muted-foreground">
                        {((mockData.overview.totalCompletions / mockData.overview.totalViews) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <Progress
                    value={(mockData.overview.totalCompletions / mockData.overview.totalViews) * 100}
                    className="h-3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="submissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>Latest form submissions with completion status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.recentSubmissions.map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${submission.status === "completed" ? "bg-green-500" : "bg-red-500"}`}
                        />
                        <div>
                          <p className="font-medium">
                            {submission.formType.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(submission.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={submission.status === "completed" ? "default" : "destructive"}>
                          {submission.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{submission.completionTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Privacy Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Privacy-First Analytics</h4>
              <p className="text-sm text-blue-800 mt-1">
                All data is anonymized and aggregated. No personal information is stored or tracked. IP addresses are
                hashed with salt for privacy protection. Data retention: 90 days maximum.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
