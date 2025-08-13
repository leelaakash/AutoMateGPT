import React from 'react';
import { Bot, ArrowRight, Zap, Shield, Users, Sparkles } from 'lucide-react';

interface HomePageProps {
  onSignInClick: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSignInClick }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
              <button
                onClick={onSignInClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors"
              >
                Sign In
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <Bot className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold text-white">AutoMate-GPT</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Welcome to <span className="text-blue-400">AutoMate-GPT</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Automate your daily tasks with AI-powered workflows and smart templates for maximum productivity.
              </p>
              <button
                onClick={onSignInClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="lg:col-span-2">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                  <Bot className="w-32 h-32 text-blue-400 mx-auto mb-4" />
                  <div className="text-center">
                    <div className="flex justify-center space-x-2 mb-4">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                    </div>
                    <p className="text-gray-300">AI Processing...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-300">Process documents and generate content in seconds</p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
              <p className="text-gray-300">Your data is protected with enterprise-grade security</p>
            </div>
            <div className="text-center">
              <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">AI-Powered</h3>
              <p className="text-gray-300">Advanced AI models for professional results</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">About AutoMateGPT</h2>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              AutoMateGPT is an intelligent workflow assistant that revolutionizes how you handle repetitive tasks. 
              Our platform combines the power of advanced AI with intuitive templates to help you work smarter, not harder.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-2xl font-semibold text-white mb-4 flex items-center">
                  🚀 Core Capabilities
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li><strong>Smart Document Processing:</strong> Automatically summarize PDFs, extract key insights, and process text files</li>
                  <li><strong>Professional Communication:</strong> Generate polished emails, responses, and business correspondence</li>
                  <li><strong>Creative Enhancement:</strong> Expand ideas into detailed concepts and actionable plans</li>
                  <li><strong>Task Management:</strong> Convert goals into structured, actionable task lists</li>
                  <li><strong>Custom Automation:</strong> Create personalized AI workflows for your unique needs</li>
                </ul>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-2xl font-semibold text-white mb-4 flex items-center">
                  💡 Why Choose AutoMateGPT?
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li><strong>Time-Saving:</strong> Reduce hours of manual work to minutes</li>
                  <li><strong>Consistent Quality:</strong> Professional results every time</li>
                  <li><strong>Easy to Use:</strong> No technical expertise required</li>
                  <li><strong>Flexible:</strong> Adapt workflows to your specific requirements</li>
                  <li><strong>Secure:</strong> Your data and privacy are our top priority</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-800/30">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {[
              {
                q: "What is AutoMateGPT and how does it work?",
                a: "AutoMateGPT is an AI-powered workflow assistant that uses advanced language models to automate repetitive tasks. Simply select a template, provide your input, and get professional results instantly."
              },
              {
                q: "Do I need technical knowledge to use AutoMateGPT?",
                a: "Not at all! AutoMateGPT is designed for everyone. Our intuitive interface and pre-built templates make it easy for anyone to create professional content and automate tasks."
              },
              {
                q: "What types of tasks can AutoMateGPT handle?",
                a: "AutoMateGPT excels at document summarization, email generation, content creation, task planning, text translation, and custom prompt processing. New workflows are added regularly."
              },
              {
                q: "Is my data secure and private?",
                a: "Yes, absolutely. We prioritize your privacy and security. Your data is processed securely and we don't store your personal content permanently on our servers."
              },
              {
                q: "Do I need my own API key?",
                a: "No! AutoMateGPT comes with pre-configured AI models including OpenAI and Hugging Face integration, so you can start using it immediately without any setup."
              },
              {
                q: "Can I create custom workflows?",
                a: "Yes! Beyond our pre-built templates, you can create custom prompts and workflows tailored to your specific needs using our flexible custom prompt feature."
              },
              {
                q: "What file formats are supported?",
                a: "AutoMateGPT supports text files (.txt), PDF documents, and direct text input. We're continuously adding support for more file types."
              },
              {
                q: "How much does it cost to use AutoMateGPT?",
                a: "AutoMateGPT is completely free to use! We provide all the AI processing power, so you can focus on your productivity without worrying about costs."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-3">{faq.q}</h3>
                <p className="text-gray-300 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Bot className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white">AutoMate-GPT</span>
          </div>
          <p className="text-gray-400">© 2025 AutoMateGPT. Empowering productivity with AI.</p>
        </div>
      </footer>
    </div>
  );
};