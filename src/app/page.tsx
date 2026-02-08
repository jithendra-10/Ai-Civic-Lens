
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, BarChart, CheckCircle, Shield, Bell, CopyCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { WavyTimeline } from '@/components/wavy-timeline';
import HeroAnimation from '@/components/hero-animation';
import { ThemeToggle } from '@/components/theme-toggle';


export default function HomePage() {
  const features = [
    {
      icon: <Bot className="h-10 w-10 text-primary" />,
      title: 'AI-Powered Reporting',
      description:
        'Automatically categorize and assess the severity of civic issues using advanced AI analysis of user-uploaded photos.',
    },
    {
      icon: <CopyCheck className="h-10 w-10 text-primary" />,
      title: 'Duplicate Detection',
      description:
        'Intelligent duplicate detection prevents multiple reports for the same issue, streamlining the process for authorities.',
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: 'Insightful Analytics',
      description:
        'Gain valuable insights into issue patterns with AI-powered summaries to help predict and prevent future problems.',
    },
    {
      icon: <Bell className="h-10 w-10 text-primary" />,
      title: 'Real-Time Notifications',
      description:
        'Keep citizens engaged with automated email notifications about the status of their reports, from submission to resolution.',
    },
  ];

  const stats = [
    {
      icon: <ArrowRight className="h-8 w-8 text-white" />,
      value: '90%',
      label: 'Faster Routing',
    },
    {
      icon: <Shield className="h-8 w-8 text-white" />,
      value: '92%',
      label: 'AI Accuracy',
    },
    {
      icon: <Bell className="h-8 w-8 text-white" />,
      value: '100%',
      label: 'Transparency',
    },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* Navbar: Increased opacity/blur for readability over video */}
      <header className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-white/10 supports-[backdrop-filter]:bg-background/60 text-foreground">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-primary animate-ai-pulse group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            </div>
            <span className="text-2xl font-bold font-headline tracking-tight">Civic<span className="text-primary">Lens</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-6 text-sm font-medium">
              <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
              <Link href="#" className="hover:text-primary transition-colors">Live Map</Link>
              <Link href="#" className="hover:text-primary transition-colors">About</Link>
            </div>
            <div className="h-6 w-px bg-border hidden md:block" />
            <ThemeToggle />
            <Button asChild className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center text-white">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/60 z-10" /> {/* Dark Overlay */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
              poster="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop"
            >
              <source src="https://videos.pexels.com/video-files/3121459/3121459-hd_1920_1080_25fps.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-in fade-in-0 slide-in-from-bottom-8 duration-700">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-md border border-white/20 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-green-300">Live System Active</span>
                <span className="h-4 w-px bg-white/20 mx-2"></span>
                <span>1,204 Issues Resolved Today</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tight mb-6 text-shadow-lg">
                Empowering Citizens.<br />
                {/* Removed blue background box */}
                <span className="text-white px-4">Transforming Cities.</span>
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-lg md:text-xl text-white/90 font-light leading-relaxed">
                The official AI-powered platform for civic reporting. Connect directly with municipal authorities to report potholes, waste, and infrastructure issues in real-time.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="h-14 px-8 text-lg font-semibold bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20 transition-all hover:scale-105" asChild>
                  <Link href="/login">Report an Issue Now</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm" asChild>
                  <Link href="#features">See How It Works</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Trust strip at bottom of hero */}
          <div className="absolute bottom-0 w-full bg-black/40 backdrop-blur-sm border-t border-white/10 py-4">
            <div className="container mx-auto flex justify-center gap-8 md:gap-16 text-white/60 text-sm font-medium uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" /> Official Gov Partner
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> 99.9% Uptime
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" /> Encrypted Data
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold font-headline text-foreground sm:text-4xl">Smart City Technology</h2>
              <p className="mt-4 text-lg text-muted-foreground">Advanced tools designed for modern municipal management</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="group relative overflow-hidden rounded-2xl border bg-background p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary/50">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-bold font-headline text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <WavyTimeline />

        {/* Stats Section */}
        <section className="bg-secondary/50 text-secondary-foreground py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-400">
            <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label}>
                  {stat.icon}
                  <div className="mt-4 text-4xl font-bold">{stat.value}</div>
                  <p className="mt-1 text-lg opacity-80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="py-20 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-500">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold font-headline">
              Ready to transform civic engagement?
            </h2>
            <Button size="lg" className="mt-6" asChild>
              <Link href="/login">Start Reporting Issues</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-8 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-semibold font-headline">CivicLens</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CivicLens. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
