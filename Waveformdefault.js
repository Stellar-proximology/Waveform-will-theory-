Wave form will theory
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { Play, Pause, Download, Settings, BookOpen, Activity, Brain, Heart } from 'lucide-react';

// Mock Firebase-like functions
const mockFirebaseActions = {
  recordResonance: async (userId, data) => {
    console.log('Recording resonance:', data);
    // Simulate API call
    return new Promise(resolve => setTimeout(resolve, 500));
  },
  fetchUserLogs: async (userId) => {
    // Return mock data
    return [
      { timestamp: '2025-07-09T10:30:00Z', gatePlayed: '59.3', feltEffect: 'Warmth, emotional pull', coherenceScore: 82, fieldActive: 'Mind' },
      { timestamp: '2025-07-09T14:15:00Z', gatePlayed: '19.1', feltEffect: 'Tingling sensation', coherenceScore: 76, fieldActive: 'Heart' },
      { timestamp: '2025-07-09T18:45:00Z', gatePlayed: '6.4', feltEffect: 'Deep calm', coherenceScore: 91, fieldActive: 'Body' },
      { timestamp: '2025-07-10T09:20:00Z', gatePlayed: '49.2', feltEffect: 'Mental clarity', coherenceScore: 88, fieldActive: 'Mind' },
    ];
  }
};

// Enhanced Theory Navigation Component
const TheoryNav = ({ currentPage, onPageChange }) => {
  const pages = [
    { id: 'theory', label: 'Waveform Will Theory', icon: Brain },
    { id: 'proximology', label: 'Stellar Proximology', icon: BookOpen },
    { id: 'fieldlog', label: 'My Field Log', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-purple-500/20 px-4 py-3 sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex space-x-6">
          {pages.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onPageChange(id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                currentPage === id 
                  ? 'bg-purple-600 text-white' 
                  : 'text-purple-300 hover:text-purple-100 hover:bg-purple-600/20'
              }`}
            >
              <Icon size={18} />
              <span className="hidden md:inline">{label}</span>
            </button>
          ))}
        </div>
        <div className="text-purple-300 text-sm">
          🧪 12,041 logs | 189 experiments
        </div>
      </div>
    </nav>
  );
};

// Enhanced Claim Card with Animation
const ClaimCard = ({ title, description, status, studyLink, onStudyClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const statusColors = {
    'In Progress': 'text-yellow-400 bg-yellow-400/10',
    'Not Yet Tested': 'text-gray-400 bg-gray-400/10',
    'Verified': 'text-green-400 bg-green-400/10',
    'Refuted': 'text-red-400 bg-red-400/10'
  };

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-white leading-tight">{title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || statusColors['Not Yet Tested']}`}>
          {status}
        </span>
      </div>
      
      {isExpanded && (
        <div className="mb-4 p-4 bg-gray-900/50 rounded-lg border-l-4 border-purple-500">
          <p className="text-gray-300 leading-relaxed">{description}</p>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
        <button
          onClick={() => onStudyClick(studyLink)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
        >
          <span>View Study</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

// Resonance Tracker Dashboard
const ResonanceTracker = ({ logs }) => {
  const chartData = logs.map((log, index) => ({
    time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    coherenceScore: log.coherenceScore,
    gate: log.gatePlayed
  }));

  const gateFrequency = logs.reduce((acc, log) => {
    acc[log.gatePlayed] = (acc[log.gatePlayed] || 0) + 1;
    return acc;
  }, {});

  const gateData = Object.entries(gateFrequency).map(([gate, count]) => ({
    gate,
    count
  }));

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4">Coherence Score Timeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #6B7280',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="coherenceScore" 
              stroke="#9333EA" 
              strokeWidth={3}
              dot={{ fill: '#9333EA', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4">Gate Activation Frequency</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={gateData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="gate" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #6B7280',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="count" fill="#9333EA" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Gate Player Component
const GatePlayer = ({ gate, onPlay, isPlaying }) => {
  return (
    <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Gate {gate}</h3>
        <button
          onClick={onPlay}
          className={`p-3 rounded-full transition-all duration-200 ${
            isPlaying 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isPlaying ? <Pause className="text-white" size={20} /> : <Play className="text-white" size={20} />}
        </button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-red-400 animate-pulse' : 'bg-gray-600'}`} />
          <span className="text-gray-300">{isPlaying ? 'Playing resonance tone...' : 'Ready to play'}</span>
        </div>
      </div>
    </div>
  );
};

// Study Module Component
const StudyModule = ({ studyTitle, description, onStart }) => {
  return (
    <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
      <h3 className="text-xl font-bold text-white mb-3">{studyTitle}</h3>
      <p className="text-gray-300 mb-4 leading-relaxed">{description}</p>
      <button
        onClick={onStart}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium"
      >
        Start Study Session
      </button>
    </div>
  );
};

// Main App Component
const WaveformWillApp = () => {
  const [currentPage, setCurrentPage] = useState('theory');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playingGate, setPlayingGate] = useState(null);

  const userId = 'ADAYA369'; // Mock user ID

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const userLogs = await mockFirebaseActions.fetchUserLogs(userId);
        setLogs(userLogs);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const claims = [
    {
      title: 'Design Sun Coherence Shifts Field State',
      description: 'Exposure to −88° Design Gate frequency alters HRV, EEG, or memory recall patterns. This should be measurable through biofeedback devices during 10-minute exposure sessions.',
      status: 'In Progress',
      studyLink: 'design-coherence-test'
    },
    {
      title: 'Heart Field = NN × 88 (or SN × 88)',
      description: 'Emotional spikes and dream recall occur near harmonic gates. Users should report increased emotional intensity when exposed to gates that are mathematical multiples of their North/South Node positions.',
      status: 'Not Yet Tested',
      studyLink: 'heart-vector-simulation'
    },
    {
      title: 'Synthesis Events Create Reality Shifts',
      description: 'When Mind × Heart ÷ Body ratios align with specific mathematical relationships, users report subjective time dilation, synchronicities, or enhanced intuitive insights.',
      status: 'Not Yet Tested',
      studyLink: 'synthesis-event-tracker'
    }
  ];

  const handleGatePlay = async (gate) => {
    setPlayingGate(gate);
    // Simulate tone playback
    setTimeout(() => setPlayingGate(null), 3000);
    
    // Record the interaction
    await mockFirebaseActions.recordResonance(userId, {
      gatePlayed: gate,
      fieldActive: 'Mind',
      coherenceScore: Math.floor(Math.random() * 30) + 70, // 70-100 range
      feltEffect: 'Simulated resonance response'
    });
    
    // Refresh logs
    const updatedLogs = await mockFirebaseActions.fetchUserLogs(userId);
    setLogs(updatedLogs);
  };

  const handleStudyClick = (studyLink) => {
    console.log(`Opening study: ${studyLink}`);
    // In a real app, this would navigate to the study page
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'theory':
        return (
          <div className="space-y-8">
            <header className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Waveform Will Theory</h1>
              <p className="text-xl text-purple-300 mb-2">A Resonance-Based Reality Engine</p>
              <p className="text-gray-400">Consciousness as measurable field interference patterns</p>
            </header>
            
            <section className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <h2 className="text-2xl font-bold text-white mb-4">Core Thesis</h2>
              <p className="text-gray-300 leading-relaxed">
                Waveform Will Theory proposes that conscious experience is governed by resonance alignment 
                within a fixed field of standing waveforms, anchored at the Design Sun (−88°). All experience—time, 
                space, will—is a resonance state within this field, measurable through biofeedback and behavioral patterns.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Falsifiable Claims</h2>
              <div className="space-y-4">
                {claims.map((claim, index) => (
                  <ClaimCard key={index} {...claim} onStudyClick={handleStudyClick} />
                ))}
              </div>
            </section>
          </div>
        );

      case 'proximology':
        return (
          <div className="space-y-8">
            <header className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Stellar Proximology</h1>
              <p className="text-xl text-purple-300 mb-2">Field Physics of Conscious Interference</p>
            </header>
            
            <section className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <h2 className="text-2xl font-bold text-white mb-4">What Is Stellar Proximology?</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Stellar Proximology studies how stellar bodies create field interference patterns at the moment 
                before birth, forming the initial conditions of conscious experience (Interference Nodes). It's a 
                precision resonance science focused on measurable field effects rather than symbolic interpretation.
              </p>
              
              <h3 className="text-xl font-bold text-white mb-3">Key Principles:</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Quantum interference patterns from stellar proximity</li>
                <li>• Waveform anchoring at specific celestial coordinates</li>
                <li>• Spacetime geometry effects on consciousness fields</li>
                <li>• Measurable biofeedback responses to calculated frequencies</li>
              </ul>
            </section>
          </div>
        );

      case 'fieldlog':
        return (
          <div className="space-y-8">
            <header className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">My Field Log</h1>
              <p className="text-xl text-purple-300">Track your resonance patterns and field responses</p>
            </header>

            {loading ? (
              <div className="text-center text-gray-400">Loading your resonance data...</div>
            ) : (
              <>
                <ResonanceTracker logs={logs} />
                
                <section>
                  <h2 className="text-2xl font-bold text-white mb-6">Gate Testing</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {['59.3', '19.1', '6.4', '49.2'].map(gate => (
                      <GatePlayer
                        key={gate}
                        gate={gate}
                        isPlaying={playingGate === gate}
                        onPlay={() => handleGatePlay(gate)}
                      />
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-white mb-6">Available Studies</h2>
                  <div className="space-y-4">
                    <StudyModule
                      studyTitle="Design Coherence Test"
                      description="Test your resonance response to your calculated Design Sun gate frequency. Includes biofeedback logging and coherence scoring."
                      onStart={() => handleStudyClick('design-coherence-test')}
                    />
                    <StudyModule
                      studyTitle="Heart Vector Simulation"
                      description="Explore emotional field responses near harmonic gate positions. Track dream patterns and emotional intensity."
                      onStart={() => handleStudyClick('heart-vector-simulation')}
                    />
                  </div>
                </section>
              </>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-8">
            <header className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Data Controls</h1>
              <p className="text-xl text-purple-300">Manage your resonance data and privacy</p>
            </header>
            
            <section className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <h2 className="text-2xl font-bold text-white mb-4">Privacy Settings</h2>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-gray-300">Keep my resonance logs private</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-300">Share anonymous data for research</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-300">Allow AI analysis of my patterns</span>
                </label>
              </div>
            </section>

            <section className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
              <h2 className="text-2xl font-bold text-white mb-4">Data Export</h2>
              <div className="space-y-3">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2">
                  <Download size={20} />
                  <span>Download Resonance Report</span>
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2">
                  <Download size={20} />
                  <span>Download Theory Whitepaper</span>
                </button>
              </div>
            </section>
          </div>
        );

      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <TheoryNav currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default WaveformWillApp; 
