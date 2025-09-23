import React, { useState, useEffect } from 'react';
import { Calendar, Users, ArrowRight, Clock, Zap, Mail, Check, AlertCircle } from 'lucide-react';
import { supabase, type WaitlistEntry } from './lib/supabase';

function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0, 
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Waitlist state
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Target launch date: September 21st
  const launchDate = new Date('2025-10-30T00:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance < 0) {
        setIsExpired(true);
        setIsLoading(false);
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
      setIsLoading(false);
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  const handleSocialClick = (platform: string) => {
    const urls = {
      reddit: 'https://www.reddit.com/r/pepAIre/',
      discord: 'https://discord.gg/csWBDZ2F'
    };
    const url = urls[platform as keyof typeof urls];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([
          {
            email: email.toLowerCase().trim(),
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          setErrorMessage('This email is already on the waitlist!');
        } else {
          setErrorMessage('Something went wrong. Please try again.');
        }
        setSubmitStatus('error');
      } else {
        setSubmitStatus('success');
        setEmail('');
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
      }
    } catch (err) {
      setErrorMessage('Network error. Please check your connection.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-700 to-purple-800 flex items-center justify-center">
        <div className="glass-morphism p-8 rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full"></div>
            <span className="text-white text-lg">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-black animated-bg overflow-hidden">
      {/* Background Pattern (subtle, blended) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle radial vignette to blend background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(56,189,248,0.05),transparent_50%)]"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 p-4 md:p-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between nav-glass rounded-2xl px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
              <img 
                src="/prepAIllogo.png" 
                alt="prepAIred logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <span className="text-white text-xl font-bold">prepAIred</span>
          </div>
          
          {/* Navbar buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => {
                const emailSection = document.getElementById('get-resources-section');
                emailSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-2 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 text-white text-sm sm:text-base font-semibold hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap"
            >
              Get Free Resources
            </button>
            {/* Socials: hide on small screens to prevent overflow */}
            <div className="hidden sm:flex items-center gap-2">
              <button 
                onClick={() => handleSocialClick('reddit')}
                className="p-2.5 sm:p-3 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-105 transition-all duration-300 group shadow-lg backdrop-blur-sm border border-white/10"
                aria-label="Join our Reddit community"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:text-orange-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
              </button>
              
              <button 
                onClick={() => handleSocialClick('discord')}
                className="p-2.5 sm:p-3 rounded-xl bg-white/10 hover:bg-white/20 hover:scale-105 transition-all duration-300 group shadow-lg backdrop-blur-sm border border-white/10"
                aria-label="Join our Discord server"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:text-indigo-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 md:px-8 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12 md:mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Learn to{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                supercharge
              </span>
              <br />
              your studies with AI
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-4 max-w-3xl mx-auto leading-relaxed">
              Revolutionary AI-powered learning platform designed by top IIT graduates
            </p>
            <div className="flex items-center justify-center space-x-2 text-white/60 text-sm md:text-base">
              <Users className="w-4 h-4" />
              <span>Crafted By IITians</span>
            </div>
          </div>

          {/* Get Free Resources Section */}
          <div id="get-resources-section" className="mb-12 md:mb-16">
            <div className="glass-morphism p-8 md:p-12 rounded-3xl max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <Mail className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                  Get Free Resources
                </h3>
                <p className="text-lg text-white/80 mb-2">
                  Get exclusive AI study materials and be the first to know when prepAIred launches
                </p>
                <p className="text-sm text-yellow-300/90 font-medium">
                  📧 New users should check their spam folder initially
                </p>
                <p className="text-sm text-orange-300/90 font-medium mt-1">
                  ⚠️ If you use ad blockers or privacy extensions, please disable them before clicking
                  <span className="mx-1 font-semibold">"Get Free Resources"</span>.
                </p>
              </div>

              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                    disabled={isSubmitting}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || submitStatus === 'success'}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"></div>
                      Getting Resources...
                    </div>
                  ) : submitStatus === 'success' ? (
                    <div className="flex items-center justify-center">
                      <Check className="w-5 h-5 mr-2" />
                      Successfully Added!
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Get Free Resources
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  )}
                </button>

                {/* Status Messages */}
                {submitStatus === 'error' && (
                  <div className="text-center mt-3 space-y-1">
                    <div className="flex items-center justify-center text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errorMessage}
                    </div>
                    <p className="text-xs text-white/70">
                      Tip: Disable ad blockers/privacy extensions and try again.
                    </p>
                  </div>
                )}
                
                {submitStatus === 'success' && (
                  <div className="flex items-center justify-center text-green-400 text-sm mt-3">
                    <Check className="w-4 h-4 mr-2" />
                    Success! Check your email for free resources (and spam folder just in case).
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Countdown Timer */}
          {!isExpired ? (
            <div className="mb-12 md:mb-16">
              <div className="glass-morphism p-8 md:p-12 rounded-3xl max-w-4xl mx-auto timer-glow">
                <div className="flex items-center justify-center mb-8">
                  <Clock className="w-8 h-8 text-cyan-400 mr-3" />
                  <h2 className="text-2xl md:text-3xl font-semibold text-white">
                    Launching Soon
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  <div className="timer-unit">
                    <div className="text-4xl md:text-6xl font-bold text-white mb-2 timer-number">
                      {timeLeft.days.toString().padStart(2, '0')}
                    </div>
                    <div className="text-white/60 text-sm md:text-base font-medium uppercase tracking-wider">
                      Days
                    </div>
                  </div>
                  <div className="timer-unit">
                    <div className="text-4xl md:text-6xl font-bold text-white mb-2 timer-number">
                      {timeLeft.hours.toString().padStart(2, '0')}
                    </div>
                    <div className="text-white/60 text-sm md:text-base font-medium uppercase tracking-wider">
                      Hours
                    </div>
                  </div>
                  <div className="timer-unit">
                    <div className="text-4xl md:text-6xl font-bold text-white mb-2 timer-number">
                      {timeLeft.minutes.toString().padStart(2, '0')}
                    </div>
                    <div className="text-white/60 text-sm md:text-base font-medium uppercase tracking-wider">
                      Minutes
                    </div>
                  </div>
                  <div className="timer-unit">
                    <div className="text-4xl md:text-6xl font-bold text-white mb-2 timer-number pulse">
                      {timeLeft.seconds.toString().padStart(2, '0')}
                    </div>
                    <div className="text-white/60 text-sm md:text-base font-medium uppercase tracking-wider">
                      Seconds
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex items-center justify-center text-white/60 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Target Launch: November 30th, 2025</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-12 md:mb-16">
              <div className="glass-morphism p-8 md:p-12 rounded-3xl max-w-2xl mx-auto">
                <div className="text-center">
                  <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    We're Live! 🎉
                  </h2>
                  <p className="text-xl text-white/80 mb-6">
                    The AI Study Platform is now available!
                  </p>
                  <button className="btn-primary">
                    Get Started Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Community Section */}
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6">
              Join Our Community
            </h3>
            <p className="text-lg text-white/80 mb-8">
              Connect with fellow students and get exclusive updates about our launch
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => handleSocialClick('reddit')}
                className="btn-secondary group"
                aria-label="Join our Reddit community"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
                Join Reddit Community
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button 
                onClick={() => handleSocialClick('discord')}
                className="btn-secondary group"
                aria-label="Join our Discord server"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
                </svg>
                Join Discord Server
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 md:p-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-white/60 text-sm">
          <p>&copy; 2025 prepAIred Platform </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
