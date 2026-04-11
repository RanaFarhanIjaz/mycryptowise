// src/app/education/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  GraduationCap,
  ChevronLeft,
  BookOpen,
  TrendingUp,
  Shield,
  Zap,
  Award,
  Star,
  ExternalLink,
  Video,
  Code,
  Users,
  Clock,
  CheckCircle,
  Wallet,
  BarChart3,
  Globe,
  Smartphone,
  Target,
  Briefcase,
  FileText,
  Layers,
  Youtube,
  PlayCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'

// Resource Categories
const categories = [
  { id: 'all', label: 'All Resources', icon: <Layers className="h-4 w-4" /> },
  { id: 'video', label: 'Video Courses', icon: <Youtube className="h-4 w-4" /> },
  { id: 'book', label: 'Books & Guides', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'tool', label: 'Tools & Simulators', icon: <Wallet className="h-4 w-4" /> },
  { id: 'dev', label: 'Developer', icon: <Code className="h-4 w-4" /> },
]

// Video data with working links
const videoCourses = [
  {
    id: 'v1',
    title: 'Blockchain and Money',
    author: 'MIT OpenCourseWare (Prof. Gary Gensler)',
    description: 'Complete MIT course on blockchain technology and cryptocurrencies. 23 video lectures from one of the most respected institutions.',
    type: 'video',
    level: 'Intermediate',
    duration: '23 hours',
    url: 'https://www.youtube.com/playlist?list=PLUl4u3cNGP63UUkfL0onkxF6MYgVa04Fn',
    playlistId: 'PLUl4u3cNGP63UUkfL0onkxF6MYgVa04Fn',
    thumbnail: 'https://img.youtube.com/vi/EH6vE97qIP4/0.jpg',
    tags: ['Academic', 'MIT', 'Comprehensive'],
    featured: true,
    videoCount: 23
  },
  {
    id: 'v2',
    title: 'But how does bitcoin actually work?',
    author: '3Blue1Brown',
    description: 'The most clear, animated explanation of how Bitcoin works. Perfect visual understanding of blockchain technology.',
    type: 'video',
    level: 'Beginner',
    duration: '26 minutes',
    url: 'https://www.youtube.com/watch?v=bBC-nXj3Ng4',
    videoId: 'bBC-nXj3Ng4',
    thumbnail: 'https://img.youtube.com/vi/bBC-nXj3Ng4/0.jpg',
    tags: ['Animation', 'Bitcoin', 'Visual Learning'],
    featured: true
  },
  {
    id: 'v3',
    title: 'Cryptocurrency Full Course',
    author: 'freeCodeCamp',
    description: '8-hour comprehensive course covering blockchain, Bitcoin, Ethereum, smart contracts, and DeFi. Includes practical demonstrations.',
    type: 'video',
    level: 'Beginner to Intermediate',
    duration: '8 hours',
    url: 'https://www.youtube.com/watch?v=1YyAzVmP9xQ',
    videoId: '1YyAzVmP9xQ',
    thumbnail: 'https://img.youtube.com/vi/1YyAzVmP9xQ/0.jpg',
    tags: ['Complete Course', 'FreeCodeCamp', 'Hands-on'],
    featured: true
  },
  {
    id: 'v4',
    title: 'Solidity, Blockchain, and Smart Contract Course',
    author: 'freeCodeCamp (Patrick Collins)',
    description: '32-hour comprehensive course to become a blockchain developer. Industry-standard training with real projects.',
    type: 'video',
    level: 'Intermediate to Advanced',
    duration: '32 hours',
    url: 'https://www.youtube.com/watch?v=gyMwXuJrbJQ',
    videoId: 'gyMwXuJrbJQ',
    thumbnail: 'https://img.youtube.com/vi/gyMwXuJrbJQ/0.jpg',
    tags: ['Development', 'Solidity', 'Smart Contracts'],
    featured: false
  },
  {
    id: 'v5',
    title: 'Whiteboard Crypto - Complete Playlist',
    author: 'Whiteboard Crypto',
    description: 'Animated explainers for every crypto concept. Easy to understand with visual illustrations.',
    type: 'video',
    level: 'Beginner',
    duration: '5+ hours',
    url: 'https://www.youtube.com/@WhiteboardCrypto',
    tags: ['Animation', 'Visual', 'Beginner Friendly'],
    featured: false
  }
]

// Books data
const books = [
  {
    id: 'b1',
    title: "Proving Nothing: A Layered Guide to Zero-Knowledge Proof Systems",
    author: "Charles Hoskinson (Input Output Global)",
    description: "A 357-page technical book that breaks down ZK-proofs into seven understandable layers.",
    type: "book",
    level: "Advanced",
    duration: "4+ hours",
    url: "https://github.com/CharlesHoskinson/sevenlayer",
    tags: ["Zero-Knowledge", "Privacy", "Cryptography"],
    featured: true
  },
  {
    id: 'b2',
    title: "Mastering Ethereum",
    author: "Andreas M. Antonopoulos",
    description: "A complete guide for developers exploring smart contracts and dApps on Ethereum.",
    type: "book",
    level: "Intermediate",
    duration: "12 hours",
    url: "https://github.com/ethereumbook/ethereumbook",
    tags: ["Ethereum", "Smart Contracts", "Development"],
    featured: true
  },
  {
    id: 'b3',
    title: "Bitcoin Supercycle",
    author: "Michael Terpin",
    description: "Understanding Bitcoin's market cycles and long-term investment strategies.",
    type: "book",
    level: "Intermediate",
    duration: "6 hours",
    url: "http://theacemanagement.com/free-full-book-pdf-bitcoin-supercycle-by-michael-terpin/",
    tags: ["Bitcoin", "Market Cycles", "Investment"],
    featured: false
  }
]

// Tools & Simulators
const tools = [
  {
    id: 't1',
    title: "Roostoo - Mock Crypto Trading",
    author: "Roostoo Labs",
    description: "Practice trading 66+ assets with $50k mock USD. Compete with AI agents and real users.",
    type: "tool",
    level: "All Levels",
    url: "https://apps.apple.com/app/roostoo-mock-crypto-trading/id1483561353",
    tags: ["Simulator", "Trading Practice", "Free"],
    featured: true
  },
  {
    id: 't2',
    title: "Gocrypto Trading Simulator",
    author: "MOBILE EDTECH SOLUTIONS",
    description: "Real-time market simulation with challenges and competitions.",
    type: "tool",
    level: "Beginner",
    url: "https://apps.apple.com/ng/app/gocrypto-crypto-trading/id6751225067",
    tags: ["Simulator", "Gamified"],
    featured: false
  }
]

// Developer Resources
const devResources = [
  {
    id: 'd1',
    title: "Cyfrin Updraft",
    author: "Cyfrin (Patrick Collins)",
    description: "100+ hours of free blockchain development courses with certifications.",
    type: "dev",
    level: "Beginner to Expert",
    duration: "100+ hours",
    url: "https://updraft.cyfrin.io",
    tags: ["Development", "Solidity", "Certification"],
    featured: true
  },
  {
    id: 'd2',
    title: "Ethereum.org Developer Portal",
    author: "Ethereum Foundation",
    description: "Official docs, tutorials, and community platforms for Ethereum builders.",
    type: "dev",
    level: "All Levels",
    url: "https://ethereum.org/developers",
    tags: ["Documentation", "Community"],
    featured: true
  }
]

// Combine all resources
const allResources = [...videoCourses, ...books, ...tools, ...devResources]

// Stats
const stats = [
  { label: "Video Hours", value: "100+", icon: <Youtube className="h-5 w-5" /> },
  { label: "Free Books", value: "3+", icon: <BookOpen className="h-5 w-5" /> },
  { label: "Interactive Tools", value: "2", icon: <Wallet className="h-5 w-5" /> },
  { label: "Developer Courses", value: "5+", icon: <Code className="h-5 w-5" /> },
]

// Helper for category colors
const getCategoryColor = (type: string) => {
  switch(type) {
    case 'video': return 'from-red-500 to-rose-500'
    case 'book': return 'from-blue-500 to-cyan-500'
    case 'tool': return 'from-purple-500 to-pink-500'
    case 'dev': return 'from-orange-500 to-red-500'
    default: return 'from-gray-500 to-gray-600'
  }
}

// Video Card Component
function VideoCard({ video, onSave, isSaved }: { video: any; onSave: () => void; isSaved: boolean }) {
  return (
    <Card className="h-full hover:shadow-xl transition-all group overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-900 cursor-pointer" onClick={() => window.open(video.url, '_blank')}>
        {video.thumbnail ? (
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500 to-rose-600">
            <PlayCircle className="h-16 w-16 text-white opacity-80" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <PlayCircle className="h-16 w-16 text-white" />
        </div>
        {video.duration && (
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </span>
        )}
      </div>

      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(video.type)}`}>
              <Youtube className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="capitalize">
              Video Course
            </Badge>
          </div>
          <button 
            onClick={onSave}
            className="text-gray-400 hover:text-yellow-500 transition"
          >
            <Star className={`h-4 w-4 ${isSaved ? 'fill-yellow-500 text-yellow-500' : ''}`} />
          </button>
        </div>
        <CardTitle className="text-xl line-clamp-2">{video.title}</CardTitle>
        <CardDescription className="text-sm">
          By {video.author}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {video.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            {video.level}
          </Badge>
          {video.videoCount && (
            <Badge variant="outline" className="text-xs">
              <PlayCircle className="h-3 w-3 mr-1" />
              {video.videoCount} videos
            </Badge>
          )}
          {video.tags.slice(0, 2).map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <Button 
          className="w-full group"
          onClick={() => window.open(video.url, '_blank')}
        >
          Watch Now
          <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
        </Button>
      </CardContent>
    </Card>
  )
}

// Resource Card for non-video items
function ResourceCard({ resource, onSave, isSaved }: { resource: any; onSave: () => void; isSaved: boolean }) {
  const getIcon = () => {
    switch(resource.type) {
      case 'book': return <BookOpen className="h-4 w-4 text-white" />
      case 'tool': return <Wallet className="h-4 w-4 text-white" />
      case 'dev': return <Code className="h-4 w-4 text-white" />
      default: return <BookOpen className="h-4 w-4 text-white" />
    }
  }

  return (
    <Card className="h-full hover:shadow-md transition">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(resource.type)}`}>
              {getIcon()}
            </div>
            <Badge variant="outline" className="capitalize">
              {resource.type === 'dev' ? 'Developer' : resource.type}
            </Badge>
          </div>
          <button 
            onClick={onSave}
            className="text-gray-400 hover:text-yellow-500 transition"
          >
            <Star className={`h-4 w-4 ${isSaved ? 'fill-yellow-500 text-yellow-500' : ''}`} />
          </button>
        </div>
        
        <h3 className="text-lg font-bold mb-1">{resource.title}</h3>
        <p className="text-sm text-gray-500 mb-2">By {resource.author}</p>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {resource.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            {resource.level}
          </Badge>
          {resource.tags?.slice(0, 2).map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          className="w-full"
          onClick={() => window.open(resource.url, '_blank')}
        >
          <ExternalLink className="h-3 w-3 mr-2" />
          Access Resource
        </Button>
      </CardContent>
    </Card>
  )
}

export default function EducationPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [savedResources, setSavedResources] = useState<string[]>([])

  const toggleSave = (id: string) => {
    setSavedResources(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const getFilteredResources = () => {
    if (activeCategory === 'all') return allResources
    return allResources.filter(r => r.type === activeCategory)
  }

  const featuredVideos = videoCourses.filter(v => v.featured)
  const featuredResources = allResources.filter(r => r.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Crypto Learning Hub
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Curated video courses, books, and tools to master cryptocurrency—all completely free
          </p>
        </motion.div>

        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="p-4 text-center">
                <div className="flex justify-center mb-2 text-primary">
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Featured Video Courses Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Youtube className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-bold">Featured Video Courses</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVideos.map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <VideoCard 
                  video={video} 
                  onSave={() => toggleSave(video.id)}
                  isSaved={savedResources.includes(video.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveCategory}>
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent">
            {categories.map(cat => (
              <TabsTrigger 
                key={cat.id} 
                value={cat.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {cat.icon}
                <span className="ml-2">{cat.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {getFilteredResources().map((resource) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {resource.type === 'video' ? (
                    <VideoCard 
                      video={resource} 
                      onSave={() => toggleSave(resource.id)}
                      isSaved={savedResources.includes(resource.id)}
                    />
                  ) : (
                    <ResourceCard 
                      resource={resource} 
                      onSave={() => toggleSave(resource.id)}
                      isSaved={savedResources.includes(resource.id)}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Learning Path */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-bold">Suggested Learning Path</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <p className="font-semibold">Start with Videos</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Watch <strong>MIT Blockchain Course</strong> or <strong>3Blue1Brown</strong> for fundamentals</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <p className="font-semibold">Read & Understand</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Read <strong>Mastering Ethereum</strong> for deep technical knowledge</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <p className="font-semibold">Practice & Build</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Take <strong>Cyfrin Updraft</strong> and practice with <strong>Roostoo</strong> simulator</p>
              </div>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-xs text-gray-400 mt-8">
          All resources are free as of April 2026. Video thumbnails link directly to YouTube playlists.
        </p>
      </div>
    </div>
  )
}

