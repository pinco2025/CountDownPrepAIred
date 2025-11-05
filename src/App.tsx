import React, { useState } from 'react';
import { supabase } from './lib/supabase';
import Contact from './components/Contact';

function App() {
  const [email, setEmail] = useState('');
  const [exam, setExam] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [submittedExam, setSubmittedExam] = useState('');

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!exam) {
      setErrorMessage('Please select an exam');
      setSubmitStatus('error');
      return;
    }

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
            exam: exam,
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
        setSubmittedEmail(email);
        setSubmittedExam(exam);
        setEmail('');
        setExam('');
      }
    } catch (err) {
      setErrorMessage('Network error. Please check your connection.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden p-4" id="page-container">
      <div className="absolute inset-0 z-0 bg-grid"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-background-light via-transparent to-background-light dark:from-background-dark dark:via-transparent dark:to-background-dark"></div>
      <div className="absolute top-0 -left-1/4 w-96 h-96 bg-[#38b6ff]/20 dark:bg-[#004aad]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float z-0"></div>
      <div className="absolute bottom-0 -right-1/4 w-96 h-96 bg-[#0066ff]/20 dark:bg-[#18356b]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float animation-delay-[3s] z-0"></div>
      <header className="absolute top-0 left-0 right-0 p-6 z-30 pointer-events-auto">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img alt="prepAIred logo" className="h-10 w-10" src="/logo.png"/>
            <span className="text-2xl font-bold text-text-light dark:text-text-dark">prep<span className="text-primary">AI</span>red</span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
            <a className="hover:text-primary transition-colors" href="#">Features</a>
            <a className="hover:text-primary transition-colors" href="#">Pricing</a>
            <a
              className="hover:text-primary transition-colors cursor-pointer"
              href="#contact-section"
              role="button"
              tabIndex={0}
              onClick={(e) => { e.preventDefault(); scrollToContact(); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  scrollToContact();
                }
              }}
            >
              Contact
            </a>
          </div>
        </nav>
      </header>
      <section id="waitlist-section" className="min-h-screen flex items-center justify-center z-10 w-full">
        <div className={`text-center max-w-2xl w-full px-4 ${submitStatus === 'success' ? 'form-submitted' : ''}`} id="contentWrapper">
          <div id="waitlistForm">
            <div className="animate-fadeIn">
              <img alt="prepAIred logo large" className="mx-auto h-24 w-24 mb-6" src="/logo-large.png"/>
              <h1 className="text-4xl md:text-5xl font-bold text-text-light dark:text-text-dark leading-tight">
                AI-Powered Prep for <span className="text-primary">JEE & NEET</span>
              </h1>
            </div>
            <p className="mt-4 mb-8 text-lg text-text-secondary-light dark:text-text-secondary-dark animate-fadeIn animate-delay-500">
              Unlock your potential with personalized learning paths, smart analytics, and adaptive practice tests. Be the first to know when we launch.
            </p>
            <form className="w-full max-w-lg mx-auto animate-fadeIn animate-delay-1000" id="emailForm" onSubmit={handleWaitlistSubmit}>
              <div className="flex flex-col items-center gap-3 bg-surface-light dark:bg-surface-dark p-2 rounded-lg shadow-md dark:shadow-2xl dark:shadow-black/20">
                <fieldset className="w-full">
                  <legend className="sr-only">Choose your exam</legend>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input className="sr-only exam-radio" id="jee" name="exam" required type="radio" value="JEE" onChange={(e) => setExam(e.target.value)} />
                      <label data-testid="jee-label" className="flex items-center justify-center w-full p-3 rounded-md border border-gray-200 dark:border-gray-700 cursor-pointer text-text-secondary-light dark:text-text-secondary-dark font-medium transition-colors" htmlFor="jee">
                        JEE
                      </label>
                    </div>
                    <div>
                      <input className="sr-only exam-radio" id="neet" name="exam" required type="radio" value="NEET" onChange={(e) => setExam(e.target.value)} />
                      <label data-testid="neet-label" className="flex items-center justify-center w-full p-3 rounded-md border border-gray-200 dark:border-gray-700 cursor-pointer text-text-secondary-light dark:text-text-secondary-dark font-medium transition-colors" htmlFor="neet">
                        NEET
                      </label>
                    </div>
                  </div>
                </fieldset>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                  <div className="relative w-full">
                    <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">email</span>
                    <input
                      className="w-full pl-10 pr-4 py-3 bg-transparent border-0 focus:ring-2 focus:ring-primary rounded text-text-light dark:text-text-dark placeholder-text-secondary-light dark:placeholder-text-secondary-dark"
                      id="email"
                      name="email"
                      placeholder="Enter your email address"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <button
                    className="w-full sm:w-auto bg-primary text-white font-semibold px-6 py-3 rounded-md hover:opacity-90 transition-opacity whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-surface-light dark:focus:ring-offset-surface-dark"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                  </button>
                </div>
              </div>
              {submitStatus === 'error' && <p className="text-red-500 mt-2">{errorMessage}</p>}
            </form>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-xl shadow-lg animate-fadeIn text-center" id="confirmationMessage">
            <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center bg-green-100 dark:bg-green-900/50 rounded-full">
              <span className="material-icons-outlined text-3xl text-green-500 dark:text-green-400">check_circle</span>
            </div>
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">You're on the list!</h2>
            <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
              Thank you for registering for the {submittedExam} exam. We'll notify you at <strong className="text-primary font-medium" id="submittedEmail">{submittedEmail}</strong> as soon as we're ready.
            </p>
          </div>
        </div>
      </section>
      <section id="contact-section" className="min-h-screen flex items-center justify-center w-full">
        <div className="w-full flex items-center justify-center">
          <Contact />
        </div>
      </section>
      <footer className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="container mx-auto text-center text-xs text-text-secondary-light dark:text-text-secondary-dark">
          © 2025 prepAIred. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
