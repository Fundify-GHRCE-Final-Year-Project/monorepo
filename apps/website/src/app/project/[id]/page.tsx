'use client'

// app/project/[id]/page.tsx]

import { useParams } from 'next/navigation'
import { useGetSelectedProject } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft,
  Users,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  Loader2,
  AlertCircle,
  Wallet,
  Milestone
} from 'lucide-react'
import Link from 'next/link'
import { useAtom } from 'jotai'
import { currentUserAtom } from '@/store/global'
import { 
  calculateFundingPercentage, 
  calculateRemainingFunding, 
  formatEthAmount, 
  formatPercentage,
  getProjectStatus,
  calculateDaysRemaining,
  calculateMilestonePercentages
} from '@/lib/calculations'

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const { project, isLoading, error } = useGetSelectedProject(projectId)
  const [currentUser] = useAtom(currentUserAtom)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading project details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-2xl font-semibold">Project Not Found</h2>
          <p className="text-muted-foreground text-center max-w-md">
            {error || 'The project you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <Link href="/projects">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const fundingPercentage = calculateFundingPercentage(project)
  const remainingFunding = calculateRemainingFunding(project)
  const status = getProjectStatus(project)
  const daysRemaining = calculateDaysRemaining(project)
  const milestonePercentages = calculateMilestonePercentages(project.milestones)

  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</Badge>
      case 'funded':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Funded</Badge>
      case 'ended':
        return <Badge variant="destructive">Ended</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4 text-green-600" />
      case 'funded':
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case 'ended':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/projects">
          <Button variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Projects</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2">{project.title}</CardTitle>
                  <CardDescription className="text-lg">
                    {project.description}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {getStatusBadge()}
                  {getStatusIcon()}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Funding Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Funding Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{formatPercentage(fundingPercentage)}</span>
                </div>
                <Progress value={fundingPercentage} className="h-3" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Goal</div>
                    <div className="font-semibold">{formatEthAmount(project.goal)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Funded</div>
                    <div className="font-semibold">{formatEthAmount(project.funded)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Remaining</div>
                    <div className="font-semibold">{formatEthAmount(remainingFunding)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Released</div>
                    <div className="font-semibold">{formatEthAmount(project.released)}</div>
                  </div>
                </div>
              </div>

              {status === 'active' && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{daysRemaining} days left to reach the goal</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Milestone className="h-5 w-5" />
                <span>Milestones</span>
              </CardTitle>
              <CardDescription>
                {project.milestones} milestone{project.milestones !== 1 ? 's' : ''} for fund release
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestonePercentages.map((percentage, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">Milestone {index + 1}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatEthAmount((project.goal * percentage) / 100)} ({percentage}%)
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {project.released >= (project.goal * percentage) / 100 ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Project Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Project Owner</span>
                <div className="flex items-center space-x-1">
                  <Wallet className="h-4 w-4" />
                  <span className="text-sm font-mono">
                    {project.owner.slice(0, 6)}...{project.owner.slice(-4)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Team Members</span>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{project.members.length}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Project Index</span>
                <span className="text-sm font-semibold">#{project.index}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <div className="flex items-center space-x-1">
                  {getStatusIcon()}
                  <span className="text-sm capitalize">{status}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {status === 'active' && (
                <Button className="w-full">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Invest in Project
                </Button>
              )}
              
              {currentUser?.wallet === project.owner && (
                <Button variant="outline" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Manage Project
                </Button>
              )}
              
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                Share Project
              </Button>
            </CardContent>
          </Card>

          {/* Team Members */}
          {project.members.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Team Members</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.members.map((member, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <span className="font-mono">
                        {member.slice(0, 6)}...{member.slice(-4)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 