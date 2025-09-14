// src/app/about/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import qgMascot from '../../../public/qg-axolotl.png'

export default function AboutPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-white/80 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium">About</span>
          </nav>

          {/* Hero Section */}
          <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
            <div className="relative z-10 px-8 py-16 lg:px-16 lg:py-24 text-center text-white">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                About Quantum Gameware
              </h1>
              <p className="text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Pioneering the future of gaming accessories with cutting-edge technology and uncompromising quality.
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                At Quantum Gameware, we believe every gamer deserves equipment that matches their passion and skill.
                We&apos;re dedicated to creating premium gaming accessories that don&apos;t just meet expectations—they exceed them.
              </p>
              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                From professional esports athletes to weekend warriors, our gear empowers gamers to perform at their peak,
                pushing the boundaries of what&apos;s possible in competitive gaming.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full font-medium backdrop-blur-sm">
                  Premium Quality
                </div>
                <div className="bg-purple-500/20 border border-purple-400/30 text-purple-300 px-4 py-2 rounded-full font-medium backdrop-blur-sm">
                  Cutting-Edge Tech
                </div>
                <div className="bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-4 py-2 rounded-full font-medium backdrop-blur-sm">
                  Gamer-Focused
                </div>
              </div>
            </div>
            <div className="relative group">
              {/* Enhanced mascot display with multiple visual layers */}
              <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 h-96 flex items-center justify-center overflow-hidden hover:border-white/30 transition-all duration-500">
                {/* Animated background elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10"></div>
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-pulse animation-delay-1000"></div>
                
                {/* Mascot container with enhanced styling */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <div className="relative group-hover:scale-105 transition-transform duration-500 ease-out">
                    {/* Glow effect behind the mascot */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl scale-110 opacity-60 animate-pulse"></div>
                    
                    {/* Main mascot image */}
                    <div className="relative bg-white/20 backdrop-blur-sm rounded-3xl p-6 border border-white/30">
                      <Image
                        src={qgMascot}
                        alt="Quantum Gameware Mascot - Your Gaming Companion"
                        width={240}
                        height={240}
                        className="w-60 h-60 object-contain drop-shadow-2xl"
                        priority
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli2Lm4dCBvvaTVPPqwu2EhJYd6VeCN5CRlc1vMkqy2hMz3Jj3uOfUNLKBANdGJNGbadqD/q6WZ4HWjnhVCCk9C"
                      />
                      
                      {/* Subtle decorative elements */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-80 animate-ping"></div>
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-60 animate-pulse animation-delay-2000"></div>
                    </div>
                  </div>
                </div>

                {/* Floating particles effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-blue-300/60 rounded-full animate-float"></div>
                  <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-300/60 rounded-full animate-float animation-delay-3000"></div>
                  <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-indigo-300/60 rounded-full animate-float animation-delay-1500"></div>
                </div>
              </div>
              
              {/* Additional glow effect outside the container */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl scale-105 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Our Values
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Everything we do is guided by our core principles that shape how we design, build, and deliver our products.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-white/30 hover:bg-white/15 transition-all duration-300">
                <div className="w-16 h-16 bg-blue-500/20 border border-blue-400/30 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Performance First</h3>
                <p className="text-white/80 leading-relaxed">
                  Every product we create is engineered for peak performance, giving gamers the competitive edge they need to dominate.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-white/30 hover:bg-white/15 transition-all duration-300">
                <div className="w-16 h-16 bg-purple-500/20 border border-purple-400/30 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Quality Assurance</h3>
                <p className="text-white/80 leading-relaxed">
                  We never compromise on quality. Each product undergoes rigorous testing to ensure it meets our exacting standards.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-white/30 hover:bg-white/15 transition-all duration-300">
                <div className="w-16 h-16 bg-indigo-500/20 border border-indigo-400/30 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Community Driven</h3>
                <p className="text-white/80 leading-relaxed">
                  Our products are shaped by the gaming community. We listen, learn, and innovate based on real gamer feedback.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-white/30 hover:bg-white/15 transition-all duration-300">
                <div className="w-16 h-16 bg-green-500/20 border border-green-400/30 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Innovation</h3>
                <p className="text-white/80 leading-relaxed">
                  We&apos;re constantly pushing boundaries, exploring new technologies and design concepts to stay ahead of the curve.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-white/30 hover:bg-white/15 transition-all duration-300">
                <div className="w-16 h-16 bg-yellow-500/20 border border-yellow-400/30 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Reliability</h3>
                <p className="text-white/80 leading-relaxed">
                  Gamers depend on their gear. We build products that perform consistently, match after match, year after year.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-white/30 hover:bg-white/15 transition-all duration-300">
                <div className="w-16 h-16 bg-red-500/20 border border-red-400/30 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Passion</h3>
                <p className="text-white/80 leading-relaxed">
                  We&apos;re gamers ourselves. Our passion for gaming drives everything we do, from concept to final product.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl text-white p-8 lg:p-16 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl lg:text-5xl font-bold mb-2">10K+</div>
                <div className="text-white/70">Happy Gamers</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold mb-2">50+</div>
                <div className="text-white/70">Premium Products</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold mb-2">99.9%</div>
                <div className="text-white/70">Satisfaction Rate</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold mb-2">24/7</div>
                <div className="text-white/70">Support Available</div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Meet Our Team
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Our diverse team of gamers, engineers, and designers work together to create exceptional gaming experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Alex Chen",
                  role: "Founder & CEO",
                  bio: "Pro gamer turned entrepreneur with 15 years in esports",
                  avatar: "AC"
                },
                {
                  name: "Sarah Johnson",
                  role: "Head of Design",
                  bio: "Award-winning product designer with a passion for ergonomics",
                  avatar: "SJ"
                },
                {
                  name: "Marcus Rodriguez",
                  role: "Lead Engineer",
                  bio: "Hardware specialist focused on cutting-edge gaming technology",
                  avatar: "MR"
                }
              ].map((member, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center hover:border-white/30 hover:bg-white/15 transition-all duration-300">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                    {member.avatar}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <div className="text-blue-300 font-medium mb-4">{member.role}</div>
                  <p className="text-white/80 leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 lg:p-16 text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Level Up Your Game?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of gamers who trust Quantum Gameware for their competitive edge.
              Explore our premium collection today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Shop Now
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}