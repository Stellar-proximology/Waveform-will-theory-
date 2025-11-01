import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Heart, Brain, Activity, Download, AlertCircle } from 'lucide-react';

// Design Coherence Test Component
const DesignCoherenceTest = ({ userId, userChart }) => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [currentPhase, setCurrentPhase] = useState('setup'); // setup, baseline, exposure, recovery
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [biofeedbackConnected, setBiofeedbackConnected] = useState(false);
  const [coherenceScore, setCoherenceScore] = useState(0);
  const [subjective, setSubjective] = useState('');
  
  const sessionRef = useRef(null);
  const biofeedbackRef = useRef(null);

  const designGate = userChart?.designSun ? 
    `${Math.floor((userChart.designSun / 360) * 64) + 1}.${Math.floor(((userChart.designSun % (360/64)) / (360/64)) * 6) + 1}` :
    '59.3'; // Default for demo

  const phaseConfig = {
    setup: { duration: 0, label: 'Setup', color: 'gray' },
    baseline: { duration: 120, label: 'Baseline Recording', color: 'blue' },
    exposure: { duration: 600, label: 'Gate Exposure', color: 'purple' },
    recovery: { duration: 120, label: 'Recovery Period', color: 'green' }
  };

  useEffect(() => {
    if (isSessionActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isSessionActive && timeRemaining === 0) {
      handlePhaseComplete();
    }
  }, [isSessionActive, timeRemaining]);

  const handlePhaseComplete = () => {
    const phases = ['setup', 'baseline', 'exposure', 'recovery'];
    const currentIndex = phases.indexOf(currentPhase);
    
    if (currentIndex < phases.length - 1) {
      const nextPhase = phases[currentIndex + 1];
      setCurrentPhase(nextPhase);
      setTimeRemaining(phaseConfig[nextPhase].duration);
      
      if (nextPhase === 'exposure') {
        startGateExposure();
      }
    } else {
      completeSession();
    }
  };

  const startSession = async () => {
    setIsSessionActive(true);
    setCurrentPhase('baseline');
    setTimeRemaining(phaseConfig.baseline.duration);
    
    // Initialize session data
    const newSession = {
      sessionId: `session_${Date.now()}`,
      userId,
      designGate,
      startTime: new Date().toISOString(),
      phases: {},
      biofeedbackData: []
    };
    
    setSessionData(newSession);
    
    // Start biofeedback collection if available
    if (biofeedbackConnected) {
      startBiofeedbackCollection(newSession.sessionId);
    }
  };

  const startGateExposure = () => {
    // This would trigger the tone generator
    console.log(`Starting gate exposure for ${designGate}`);
    // playGateTone(designGate, phaseConfig.exposure.duration * 1000);
  };

  const startBiofeedbackCollection = (sessionId) => {
    // Mock biofeedback data generation
    biofeedbackRef.current = setInterval(() => {
      const mockData = {
        timestamp: Date.now(),
        heartRate: 60 + Math.random() * 40,
        hrv: 20 + Math.random() * 60,
        coherence: Math.random() * 100
      };
      
      setCoherenceScore(Math.round(mockData.coherence));
      
      if (sessionData) {
        setSessionData(prev => ({
          ...prev,
          biofeedbackData: [...prev.biofeedbackData, mockData]
        }));
      }
    }, 1000);
  };

  const completeSession = () => {
    setIsSessionActive(false);
    
    if (biofeedbackRef.current) {
      clearInterval(biofeedbackRef.current);
    }
    
    // Process and save session data
    const completedSession = {
      ...sessionData,
      endTime: new Date().toISOString(),
      subjectiveReport: subjective,
      finalCoherenceScore: coherenceScore,
      completed: true
    };
    
    console.log('Session completed:', completedSession);
    // This would save to Firebase
  };

  const stopSession = () => {
    setIsSessionActive(false);
    setCurrentPhase('setup');
    setTimeRemaining(0);
    
    if (biofeedbackRef.current) {
      clearInterval(biofeedbackRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Design Coherence Test</h1>
          <p className="text-purple-300">Testing resonance response to Design Gate {designGate}</p>
        </div>

        {/* Session Status */}
        <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Session Status</h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              phaseConfig[currentPhase].color === 'gray' ? 'bg-gray-600 text-gray-200' :
              phaseConfig[currentPhase].color === 'blue' ? 'bg-blue-600 text-blue-200' :
              phaseConfig[currentPhase].color === 'purple' ? 'bg-purple-600 text-purple-200' :
              'bg-green-600 text-green-200'
            }`}>
              {phaseConfig[currentPhase].label}
            </div>
          </div>
          
          {isSessionActive && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-mono text-white mb-2">
                  {formatTime(timeRemaining)}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      currentPhase === 'baseline' ? 'bg-blue-500' :
                      currentPhase === 'exposure' ? 'bg-purple-500' :
                      'bg-green-500'
                    }`}
                    style={{
                      width: `${((phaseConfig[currentPhase].duration - timeRemaining) / phaseConfig[currentPhase].duration) * 100}%`
                    }}
                  />
                </div>
              </div>
              
              {biofeedbackConnected && (
                <div className="flex items-center justify-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{Math.round(Math.random() * 20 + 70)}</div>
                    <div className="text-sm text-gray-400">Heart Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{coherenceScore}</div>
                    <div className="text-sm text-gray-400">Coherence</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Biofeedback Status */}
        <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Biofeedback Device</h3>
            <div className={`flex items-center space-x-2 ${biofeedbackConnected ? 'text-green-400' : 'text-gray-400'}`}>
              <div className={`w-3 h-3 rounded-full ${biofeedbackConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              <span>{biofeedbackConnected ? 'Connected' : 'Not Connected'}</span>
            </div>
          </div>
          
          {!biofeedbackConnected && (
            <div className="flex items-center space-x-2 text-yellow-400 mb-4">
              <AlertCircle size={16} />
              <span className="text-sm">For best results, connect an HRV device before starting</span>
            </div>
          )}
          
          <button
            onClick={() => setBiofeedbackConnected(!biofeedbackConnected)}
            className={`px-4 py-2 rounded-lg transition-all ${
              biofeedbackConnected 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {biofeedbackConnected ? 'Disconnect Device' : 'Connect HRV Device'}
          </button>
        </div>

        {/* Session Controls */}
        <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
          <h3 className="text-lg font-bold text-white mb-4">Session Controls</h3>
          
          {!isSessionActive ? (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Pre-session notes (optional):</label>
                <textarea
                  value={subjective}
                  onChange={(e) => setSubjective(e.target.value)}
                  placeholder="How are you feeling? Any expectations or current state to note..."
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                  rows={3}
                />
              </div>
              
              <button
                onClick={startSession}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all font-medium flex items-center space-x-2"
              >
                <Play size={20} />
                <span>Start 15-Minute Session</span>
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <button
                onClick={stopSession}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all font-medium flex items-center space-x-2"
              >
                <Square size={20} />
                <span>Stop Session</span>
              </button>
            </div>
          )}
        </div>

        {/* Protocol Information */}
        <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
          <h3 className="text-lg font-bold text-white mb-4">Test Protocol</h3>
          <div className="space-y-3 text-gray-300">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <span><strong>Baseline (2 min):</strong> Relaxed state, normal breathing</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <span><strong>Exposure (10 min):</strong> Listen to your Design Gate frequency ({designGate})</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <span><strong>Recovery (2 min):</strong> Return to baseline state</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Heart Vector Simulation Component
const HeartVectorSimulation = ({ userId, userChart }) => {
  const [activeGate, setActiveGate] = useState(null);
  const [emotionalState, setEmotionalState] = useState(5);
  const [dreamRecall, setDreamRecall] = useState('');
  const [syncEvents, setSyncEvents] = useState([]);
  const [isLogging, setIsLogging] = useState(false);

  const northNode = userChart?.nodes?.north || '19.1';
  const southNode = userChart?.nodes?.south || '49.2';
  
  // Calculate harmonic gates
  const calculateHarmonics = (node, multiplier) => {
    const nodeNum = parseFloat(node);
    const harmonic = (nodeNum * multiplier) % 64 || 64;
    return `${Math.floor(harmonic)}.${Math.floor((harmonic % 1) * 6) + 1}`;
  };

  const harmonicGates = [
    { gate: calculateHarmonics(northNode, 88), type: 'North × 88', color: 'blue' },
    { gate: calculateHarmonics(southNode, 88), type: 'South × 88', color: 'red' },
    { gate: calculateHarmonics(northNode, 176), type: 'North × 176', color: 'purple' },
    { gate: calculateHarmonics(southNode, 176), type: 'South × 176', color: 'orange' }
  ];

  const handleGateActivation = async (gate, type) => {
    setActiveGate(gate);
    setIsLogging(true);
    
    // Simulate gate exposure
    setTimeout(() => {
      setActiveGate(null);
      setIsLogging(false);
      
      // Log the experience
      const logEntry = {
        timestamp: new Date().toISOString(),
        gate,
        type,
        emotionalState,
        dreamRecall,
        userId
      };
      
      console.log('Heart vector log:', logEntry);
      // This would save to Firebase
    }, 5000);
  };

  const addSyncEvent = () => {
    const newEvent = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      description: '',
      intensity: 5,
      activeGate
    };
    
    setSyncEvents([...syncEvents, newEvent]);
  };

  const updateSyncEvent = (id, field, value) => {
    setSyncEvents(events => 
      events.map(event => 
        event.id === id ? { ...event, [field]: value } : event
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Heart Vector Simulation</h1>
          <p className="text-red-300">Exploring emotional field harmonics</p>
        </div>

        {/* Node Information */}
        <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
          <h2 className="text-xl font-bold text-white mb-4">Your Nodes</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{northNode}</div>
              <div className="text-sm text-gray-400">North Node</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{southNode}</div>
              <div className="text-sm text-gray-400">South Node</div>
            </div>
          </div>
        </div>

        {/* Harmonic Gates */}
        <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
          <h3 className="text-lg font-bold text-white mb-4">Harmonic Gates</h3>
          <div className="grid grid-cols-2 gap-4">
            {harmonicGates.map(({ gate, type, color }) => (
              <button
                key={gate}
                onClick={() => handleGateActivation(gate, type)}
                disabled={isLogging}
                className={`p-4 rounded-lg border-2 transition-all ${
                  activeGate === gate 
                    ? `border-${color}-500 bg-${color}-500/20` 
                    : `border-${color}-500/30 hover:border-${color}-500/60`
                } ${isLogging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className={`text-xl font-bold text-${color}-400`}>{gate}</div>
                <div className="text-sm text-gray-400">{type}</div>
                {activeGate === gate && (
                  <div className="mt-2 flex items-center justify-center">
                    <div className="animate-pulse">
                      <Heart className={`text-${color}-400`} size={20} />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Emotional State Tracker */}
        <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
          <h3 className="text-lg font-bold text-white mb-4">Current Emotional State</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Intensity (1-10):</label>
              <input
                type="range"
                min="1"
                max="10"
                value={emotionalState}
                onChange={(e) => setEmotionalState(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-white font-bold text-xl mt-2">
                {emotionalState}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Recent Dream or Emotional Event:</label>
              <textarea
                value={dreamRecall}
                onChange={(e) => setDreamRecall(e.target.value)}
                placeholder="Describe any recent dreams, emotional shifts, or synchronistic events..."
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Synchronicity Logger */}
        <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Synchronicity Events</h3>
            <button
              onClick={addSyncEvent}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all text-sm"
            >
              Log Event
            </button>
          </div>
          
          <div className="space-y-3">
            {syncEvents.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No synchronicity events logged yet</p>
            ) : (
              syncEvents.map(event => (
                <div key={event.id} className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                    {event.activeGate && (
                      <span className="text-purple-400 text-sm">
                        During Gate {event.activeGate}
                      </span>
                    )}
                  </div>
                  <textarea
                    value={event.description}
                    onChange={(e) => updateSyncEvent(event.id, 'description', e.target.value)}
                    placeholder="Describe the synchronistic event..."
                    className="w-full p-2 bg-gray-600 text-white rounded border border-gray-500 focus:border-purple-500 focus:outline-none"
                    rows={2}
                  />
                  <div className="mt-2">
                    <label className="text-xs text-gray-400">Intensity:</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={event.intensity}
                      onChange={(e) => updateSyncEvent(event.id, 'intensity', parseInt(e.target.value))}
                      className="w-full mt-1"
                    />
                    <div className="text-center text-sm text-white">{event.intensity}/10</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50
