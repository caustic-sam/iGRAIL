interface PageHeroProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHero({ title, subtitle, children }: PageHeroProps) {
  return (
    <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] border-b border-blue-900/20">
      <div className="max-w-7xl mx-auto px-6 py-8 min-h-[140px] flex items-center">
        {children || (
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
            {subtitle && (
              <p className="text-xl text-blue-100">{subtitle}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
