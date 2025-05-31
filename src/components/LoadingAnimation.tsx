"use client";

export default function LoadingAnimation({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-[100] text-cyan-400">
      <style jsx>{`
        .loader {
          width: 80px;
          height: 80px;
          border: 4px solid transparent;
          border-top-color: #00fff9; /* Cyan */
          border-right-color: #00fff9;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          position: relative;
        }
        .loader::before, .loader::after {
          content: "";
          position: absolute;
          border-radius: 50%;
        }
        .loader::before {
          top: 5px; left: 5px; right: 5px; bottom: 5px;
          border: 4px solid transparent;
          border-top-color: #ff00c1; /* Magenta */
          border-left-color: #ff00c1;
          animation: spin 1.5s linear infinite reverse;
        }
        .loader::after {
          top: 15px; left: 15px; right: 15px; bottom: 15px;
          border: 4px solid transparent;
          border-bottom-color: #faff00; /* Yellow */
          border-right-color: #faff00;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .loading-text {
          margin-top: 20px;
          font-size: 1.5em;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          animation: flicker 1.5s infinite alternate;
        }
        @keyframes flicker {
          0%, 18%, 22%, 25%, 53%, 57%, 100% {
            text-shadow:
              0 0 4px #00fff9,
              0 0 11px #00fff9,
              0 0 19px #00fff9,
              0 0 40px #ff00c1,
              0 0 80px #ff00c1,
              0 0 90px #ff00c1,
              0 0 100px #ff00c1,
              0 0 150px #ff00c1;
            opacity: 1;
          }
          20%, 24%, 55% { opacity: 0.8; text-shadow: none; }
        }
      `}</style>
      <div className="loader"></div>
      <p className="loading-text">Loading Interface...</p>
    </div>
  );
}
