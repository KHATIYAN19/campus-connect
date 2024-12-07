import React from 'react';

const themes = [
  { name: 'dark', color: '#1f2937' },
  { name: 'light', color: '#f3f4f6' },
  { name: 'cupcake', color: '#fcd5ce' },
  { name: 'bumblebee', color: '#fef08a' },
  { name: 'emerald', color: '#10b981' },
  { name: 'corporate', color: '#4b5563' },
  { name: 'synthwave', color: '#d946ef' },
  { name: 'retro', color: '#fbbf24' },
  { name: 'cyberpunk', color: '#ec4899' },
  { name: 'valentine', color: '#f43f5e' },
  { name: 'halloween', color: '#f97316' },
  { name: 'garden', color: '#34d399' },
  { name: 'forest', color: '#065f46' },
  { name: 'aqua', color: '#06b6d4' },
  { name: 'lofi', color: '#d1d5db' },
  { name: 'pastel', color: '#fbcfe8' },
  { name: 'fantasy', color: '#c084fc' },
  { name: 'wireframe', color: '#e5e7eb' },
  { name: 'black', color: '#000000' },
  { name: 'luxury', color: '#1c1917' },
  { name: 'dracula', color: '#ff79c6' },
  { name: 'cmyk', color: '#00bcd4' },
  { name: 'autumn', color: '#d97706' },
  { name: 'business', color: '#1c1917' },
  { name: 'acid', color: '#a3e635' },
  { name: 'lemonade', color: '#fcd34d' },
  { name: 'night', color: '#111827' },
  { name: 'coffee', color: '#6b7280' },
  { name: 'winter', color: '#93c5fd' },
  // Add more themes as needed
];

const ThemeOptions = ({ setTheme }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Choose a Theme</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {themes.map((theme) => (
          <div
            key={theme.name}
            className="p-4 rounded-lg cursor-pointer text-center"
            style={{ backgroundColor: theme.color }}
            onClick={() => setTheme(theme.name)}
          >
            <span className="text-white">{theme.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeOptions;