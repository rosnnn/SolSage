export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Buffering Animation */}
        <svg
          className="h-8 w-8 text-white animate-[spin_1.5s_linear_infinite]"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="4"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            d="M12 2a10 10 0 0 1 7 3"
            className="animate-[pulse_1.5s_ease-in-out_infinite]"
          />
        </svg>
        {/* Pulsing Dots */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-1">
          <div className="h-2 w-2 bg-white rounded-full animate-[bounce_0.6s_infinite_0s]"></div>
          <div className="h-2 w-2 bg-white rounded-full animate-[bounce_0.6s_infinite_0.2s]"></div>
          <div className="h-2 w-2 bg-white rounded-full animate-[bounce_0.6s_infinite_0.4s]"></div>
        </div>
      </div>
      <span className="ml-3 text-white font-semibold">Buffering...</span>
    </div>
  );
};