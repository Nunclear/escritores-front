import React, { useState } from 'react';

export function Tabs({ tabs = [], defaultTab = 0, onChange }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    onChange?.(index);
  };

  return (
    <div className="flex flex-col">
      {/* Tab list */}
      <div className="flex border-b border-sand">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabChange(index)}
            className={`px-4 py-3 font-sans font-medium text-sm transition-colors relative ${
              activeTab === index
                ? 'text-coffee'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
            {activeTab === index && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-coffee" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-4">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
}

export function TabPanel({ label, children }) {
  return { label, content: children };
}
