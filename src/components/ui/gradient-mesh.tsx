'use client';

export function GradientMesh() {
  return (
    <div className="fixed inset-0 z-[-1] bg-background overflow-hidden">
      <div className="relative w-full h-full">
        {/* Animated gradient background */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            opacity: 0.15
          }}
        />

        {/* Mesh overlay */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            opacity: 0.1
          }}
        />

        {/* Additional decorative elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full filter blur-3xl animate-pulse delay-2000" />
      </div>
    </div>
  );
}
