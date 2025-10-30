// firebase.js - Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "waveform-will-theory.firebaseapp.com",
  projectId: "waveform-will-theory",
  storageBucket: "waveform-will-theory.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// utils/recordResonance.js - Enhanced Data Logging Functions
import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

export class FieldResonanceLogger {
  static async recordResonance(userId, resonanceData) {
    try {
      const logEntry = {
        ...resonanceData,
        timestamp: new Date().toISOString(),
        userId: userId,
        sessionId: this.generateSessionId(),
        deviceInfo: this.getDeviceInfo()
      };

      await addDoc(collection(db, 'resonanceLogs'), logEntry);
      
      // Also add to user's personal log
      await addDoc(collection(db, `users/${userId}/personalLogs`), logEntry);
      
      return logEntry;
    } catch (error) {
      console.error('Error recording resonance:', error);
      throw error;
    }
  }

  static async recordExperimentResult(userId, experimentId, results) {
    try {
      const experimentData = {
        userId,
        experimentId,
        results,
        timestamp: new Date().toISOString(),
        sessionDuration: results.sessionDuration || 0,
        biofeedbackAttached: results.biofeedbackAttached || false
      };

      await addDoc(collection(db, 'experimentResults'), experimentData);
      
      // Update user's experiment history
      const userDocRef = doc(db, `users/${userId}`);
      await updateDoc(userDocRef, {
        [`experiments.${experimentId}.lastAttempt`]: new Date().toISOString(),
        [`experiments.${experimentId}.totalAttempts`]: results.attemptNumber || 1
      });

      return experimentData;
    } catch (error) {
      console.error('Error recording experiment result:', error);
      throw error;
    }
  }

  static async fetchUserLogs(userId, limitCount = 50) {
    try {
      const q = query(
        collection(db, `users/${userId}/personalLogs`),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching user logs:', error);
      return [];
    }
  }

  static async fetchGlobalStats() {
    try {
      const logsSnapshot = await getDocs(collection(db, 'resonanceLogs'));
      const experimentsSnapshot = await getDocs(collection(db, 'experimentResults'));
      
      return {
        totalLogs: logsSnapshot.size,
        totalExperiments: experimentsSnapshot.size,
        activeUsers: new Set(logsSnapshot.docs.map(doc => doc.data().userId)).size
      };
    } catch (error) {
      console.error('Error fetching global stats:', error);
      return { totalLogs: 0, totalExperiments: 0, activeUsers: 0 };
    }
  }

  static generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }
}

// utils/gateCalculations.js - Gate Mathematics and Frequency Generation
export class GateCalculations {
  static calculateDesignSun(birthData) {
    // Simplified calculation - in reality this would involve complex ephemeris data
    const { birthDate, birthTime, latitude, longitude } = birthData;
    
    // Mock calculation for demonstration
    const basePosition = this.calculateSolarPosition(birthDate, birthTime, latitude, longitude);
    const designPosition = basePosition - 88; // -88 degrees for Design Sun
    
    return this.normalizePosition(designPosition);
  }

  static calculateSolarPosition(date, time, lat, lng) {
    // Simplified solar position calculation
    // In production, use a proper astronomical library like astronomia.js
    const dayOfYear = this.getDayOfYear(new Date(date));
    const timeDecimal = this.timeToDecimal(time);
    
    // Basic solar declination and hour angle calculation
    const declination = 23.45 * Math.sin(Math.PI * (284 + dayOfYear) / 365);
    const hourAngle = 15 * (timeDecimal - 12) + lng;
    
    return (declination + hourAngle) % 360;
  }

  static normalizePosition(position) {
    while (position < 0) position += 360;
    while (position >= 360) position -= 360;
    return position;
  }

  static positionToGate(position) {
    // Convert 360-degree position to 64 gates (I-Ching hexagrams)
    const gateNumber = Math.floor((position / 360) * 64) + 1;
    const lineNumber = Math.floor(((position % (360/64)) / (360/64)) * 6) + 1;
    
    return `${gateNumber}.${lineNumber}`;
  }

  static gateToFrequency(gate) {
    // Convert gate number to frequency for tone generation
    const [gateNum, line] = gate.split('.').map(Number);
    
    // Base frequency derived from gate number
    const baseFreq = 220 * Math.pow(2, (gateNum - 1) / 12); // Musical scale mapping
    const lineMultiplier = 1 + (line - 1) * 0.05; // Slight variation per line
    
    return baseFreq * lineMultiplier;
  }

  static calculateHarmonics(primaryGate, nodes) {
    // Calculate harmonic gates based on North/South Node positions
    const [primaryNum] = primaryGate.split('.').map(Number);
    const { north, south } = nodes;
    
    const northHarmonic = (primaryNum * parseFloat(north)) % 64 || 64;
    const southHarmonic = (primaryNum * parseFloat(south)) % 64 || 64;
    
    return {
      north: `${Math.floor(northHarmonic)}.${Math.floor((northHarmonic % 1) * 6) + 1}`,
      south: `${Math.floor(southHarmonic)}.${Math.floor((southHarmonic % 1) * 6) + 1}`
    };
  }

  static getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  static timeToDecimal(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours + minutes / 60;
  }
}

// utils/toneGenerator.js - Web Audio API for Gate Frequencies
export class ToneGenerator {
  constructor() {
    this.audioContext = null;
    this.oscillator = null;
    this.gainNode = null;
    this.isPlaying = false;
  }

  async initialize() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async playGateTone(gate, duration = 3000) {
    await this.initialize();
    
    if (this.isPlaying) {
      this.stopTone();
    }

    const frequency = GateCalculations.gateToFrequency(gate);
    
    // Create oscillator and gain nodes
    this.oscillator = this.audioContext.createOscillator();
    this.gainNode = this.audioContext.createGain();
    
    // Configure oscillator
    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    // Configure gain (volume) with smooth envelope
    this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
    this.gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + duration / 1000 - 0.1);
    this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration / 1000);
    
    // Connect nodes
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
