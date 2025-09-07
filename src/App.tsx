import React, { useState, useEffect } from 'react';
import { Calendar, Users, ArrowRight, Clock, Zap } from 'lucide-react';

function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0, 
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Target launch date: September 21st
  const launchDate = new Date('2025-09-21T00:00:00');

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
      reddit: 'https://reddit.com/r/studytips',
      discord: 'https://discord.gg/Dc9YApun'
    };
    // In a real implementation, these would be actual URLs
    console.log(`Navigating to ${platform}: ${urls[platform as keyof typeof urls]}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 animated-bg overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 md:p-8">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
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
                  <span>Target Launch: September 21st, 2025</span>
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

          {/* Call to Action */}
          <div className="max-w-2xl mx-auto">
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
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
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
          <p>&copy; 2025 prepAIred Platform. Crafted with ❤️.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
