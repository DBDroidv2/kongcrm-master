"use client";

import { useState, useEffect } from 'react';

export default function WipPopup() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  // EKG path segment (width 200 units)
  const ekgSegment = "M0 30 L30 30 L35 10 L45 50 L50 30 L70 30 L75 20 L85 40 L90 30 L110 30 L115 5 L125 55 L130 30 L150 30 L155 15 L165 45 L170 30 L200 30";
  // Create the second segment by shifting X coordinates by 200
  // This is a simplified way to express the shift for the d attribute.
  // A proper SVG transform on a <use> element or group is cleaner but harder with inline styles/JSX style tag.
  // For this example, we'll make the path string directly.
  // This involves taking each command and number pair and adjusting X values.
  // Example: L30 30 becomes L(30+200) 30 = L230 30. M0 30 becomes M200 30.
  const ekgSegmentShifted = "M200 30 L230 30 L235 10 L245 50 L250 30 L270 30 L275 20 L285 40 L290 30 L310 30 L315 5 L325 55 L330 30 L350 30 L355 15 L365 45 L370 30 L400 30";
  const fullEkgPath = `${ekgSegment} ${ekgSegmentShifted}`;


  return (
    // Full-screen overlay for the popup
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* Popup container with 90's window styling */}
      <div className="bg-gray-800 border-4 border-cyan-500 shadow-2xl shadow-cyan-500/50 rounded-lg p-6 md:p-8 max-w-md w-full text-gray-100 relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-fadeInScale">
        <style jsx>{`
          @keyframes fadeInScale {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-fadeInScale {
            animation: fadeInScale 0.5s forwards;
          }
          .cyber-glitch::before, .cyber-glitch::after {
            content: 'WORK IN PROGRESS';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            clip: rect(0, 0, 0, 0);
          }
          .cyber-glitch::before {
            left: 2px;
            text-shadow: -2px 0 #ff00c1; /* Magenta */
            animation: glitch-anim-1 2s infinite linear alternate-reverse;
          }
          .cyber-glitch::after {
            left: -2px;
            text-shadow: -2px 0 #00fff9, 2px 2px #ff00c1; /* Cyan, Magenta */
            animation: glitch-anim-2 3s infinite linear alternate-reverse;
          }
          @keyframes glitch-anim-1 { /* Full keyframes maintained in actual implementation */
            0% { clip: rect(42px, 9999px, 44px, 0); } 5% { clip: rect(12px, 9999px, 60px, 0); } 10% { clip: rect(30px, 9999px, 70px, 0); } 15% { clip: rect(5px, 9999px, 30px, 0); } 20% { clip: rect(55px, 9999px, 80px, 0); } 25% { clip: rect(20px, 9999px, 45px, 0); } 30% { clip: rect(70px, 9999px, 95px, 0); } 35% { clip: rect(35px, 9999px, 60px, 0); } 40% { clip: rect(60px, 9999px, 85px, 0); } 45% { clip: rect(25px, 9999px, 50px, 0); } 50% { clip: rect(75px, 9999px, 100px, 0); } 55% { clip: rect(40px, 9999px, 65px, 0); } 60% { clip: rect(65px, 9999px, 90px, 0); } 65% { clip: rect(30px, 9999px, 55px, 0); } 70% { clip: rect(80px, 9999px, 105px, 0); } 75% { clip: rect(45px, 9999px, 70px, 0); } 80% { clip: rect(70px, 9999px, 95px, 0); } 85% { clip: rect(35px, 9999px, 60px, 0); } 90% { clip: rect(50px, 9999px, 75px, 0); } 95% { clip: rect(20px, 9999px, 45px, 0); } 100% { clip: rect(50px, 9999px, 100px, 0); }
          }
          @keyframes glitch-anim-2 { /* Full keyframes maintained in actual implementation */
            0% { clip: rect(65px, 9999px, 110px, 0); } 5% { clip: rect(25px, 9999px, 70px, 0); } 10% { clip: rect(80px, 9999px, 100px, 0); } 15% { clip: rect(10px, 9999px, 40px, 0); } 20% { clip: rect(70px, 9999px, 90px, 0); } 25% { clip: rect(30px, 9999px, 55px, 0); } 30% { clip: rect(85px, 9999px, 110px, 0); } 35% { clip: rect(45px, 9999px, 70px, 0); } 40% { clip: rect(75px, 9999px, 100px, 0); } 45% { clip: rect(35px, 9999px, 60px, 0); } 50% { clip: rect(90px, 9999px, 115px, 0); } 55% { clip: rect(50px, 9999px, 75px, 0); } 60% { clip: rect(80px, 9999px, 105px, 0); } 65% { clip: rect(40px, 9999px, 65px, 0); } 70% { clip: rect(95px, 9999px, 120px, 0); } 75% { clip: rect(55px, 9999px, 80px, 0); } 80% { clip: rect(85px, 9999px, 110px, 0); } 85% { clip: rect(45px, 9999px, 70px, 0); } 90% { clip: rect(60px, 9999px, 85px, 0); } 95% { clip: rect(25px, 9999px, 50px, 0); } 100% { clip: rect(40px, 9999px, 70px, 0); }
          }
          
          .ekg-line-container {
            width: 100%;
            height: 60px; 
            overflow: hidden; /* This is crucial for the scrolling illusion */
            position: relative;
          }
          .ekg-trace {
            stroke: #ff3b30; /* Bright Red */
            stroke-width: 3;
            fill: transparent;
            animation: scroll-ekg-trace 2s linear infinite;
          }
          @keyframes scroll-ekg-trace {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%); /* Scroll by half the total path width (one segment) */
            }
          }
        `}</style>
        
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-cyan-400 transition-colors border-2 border-gray-600 bg-gray-700 rounded-md p-1 shadow-md active:shadow-inner"
          aria-label="Close popup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 uppercase tracking-wider relative cyber-glitch">
            WORK IN PROGRESS
          </h2>
        </div>
        
        <div className="ekg-line-container my-6">
          <svg width="200%" height="100%" viewBox="0 0 400 60" preserveAspectRatio="none" 
               style={{ marginLeft: '0%' }} className="ekg-trace"> {/* Apply animation here */}
            {/* Path is now twice as wide as the viewBox of the container, containing two segments */}
            <path d={fullEkgPath} />
          </svg>
        </div>

        <p className="text-md text-gray-300 mb-4 leading-relaxed">
          Welcome to <strong className="text-cyan-400">KongCRM</strong>! This application is currently under active development.
          You might encounter unfinished features or experimental designs.
        </p>
        <p className="text-sm text-yellow-400 mb-6">
          Your data is safe, but functionality may change. Thanks for checking it out!
        </p>

        <div className="border-t border-cyan-400/50 pt-4 text-center">
          <button
            onClick={() => setIsVisible(false)}
            className="bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-2 px-6 rounded-sm uppercase tracking-wider transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg shadow-cyan-500/30 border-2 border-cyan-700 active:shadow-inner"
          >
            Proceed to App
          </button>
        </div>
      </div>
    </div>
  );
}
