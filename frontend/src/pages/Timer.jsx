import React, { useState, useEffect, useRef } from 'react';
import { FiPlay, FiPause, FiRotateCcw, FiClock } from 'react-icons/fi';

const Timer = () => {
  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);

  // Countdown state
  const [countdownTime, setCountdownTime] = useState(0);
  const [countdownInput, setCountdownInput] = useState({ hours: 0, minutes: 25, seconds: 0 });
  const [countdownRunning, setCountdownRunning] = useState(false);
  const [countdownComplete, setCountdownComplete] = useState(false);

  // Refs
  const stopwatchInterval = useRef(null);
  const countdownInterval = useRef(null);
  const audioRef = useRef(null);

  // Motivational quotes
  const quotes = [
    "The secret of getting ahead is getting started. - Mark Twain",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "Focus on being productive instead of busy. - Tim Ferriss",
    "Time is what we want most, but what we use worst. - William Penn",
    "The key is not to prioritize what's on your schedule, but to schedule your priorities. - Stephen Covey",
    "You may delay, but time will not. - Benjamin Franklin",
    "Lost time is never found again. - Benjamin Franklin",
    "Time flies over us, but leaves its shadow behind. - Nathaniel Hawthorne",
  ];

  const [currentQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  // Stopwatch effects
  useEffect(() => {
    if (stopwatchRunning) {
      stopwatchInterval.current = setInterval(() => {
        setStopwatchTime((prev) => prev + 10);
      }, 10);
    } else {
      clearInterval(stopwatchInterval.current);
    }

    return () => clearInterval(stopwatchInterval.current);
  }, [stopwatchRunning]);

  // Countdown effects
  useEffect(() => {
    if (countdownRunning && countdownTime > 0) {
      countdownInterval.current = setInterval(() => {
        setCountdownTime((prev) => {
          if (prev <= 1000) {
            setCountdownRunning(false);
            setCountdownComplete(true);
            playAlert();
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    } else {
      clearInterval(countdownInterval.current);
    }

    return () => clearInterval(countdownInterval.current);
  }, [countdownRunning, countdownTime]);

  // Format time functions
  const formatStopwatch = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const formatCountdown = (time) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Stopwatch controls
  const toggleStopwatch = () => {
    setStopwatchRunning(!stopwatchRunning);
  };

  const resetStopwatch = () => {
    setStopwatchRunning(false);
    setStopwatchTime(0);
  };

  // Countdown controls
  const startCountdown = () => {
    const totalMs =
      (parseInt(countdownInput.hours) || 0) * 3600000 +
      (parseInt(countdownInput.minutes) || 0) * 60000 +
      (parseInt(countdownInput.seconds) || 0) * 1000;

    if (totalMs > 0) {
      setCountdownTime(totalMs);
      setCountdownRunning(true);
      setCountdownComplete(false);
    }
  };

  const toggleCountdown = () => {
    setCountdownRunning(!countdownRunning);
  };

  const resetCountdown = () => {
    setCountdownRunning(false);
    setCountdownTime(0);
    setCountdownComplete(false);
  };

  const playAlert = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const presetTimes = [
    { label: '5 min', minutes: 5 },
    { label: '15 min', minutes: 15 },
    { label: '25 min', minutes: 25 },
    { label: '45 min', minutes: 45 },
    { label: '1 hour', minutes: 60 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Timer</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your time with stopwatch and countdown timer
        </p>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <FiClock className="w-8 h-8 flex-shrink-0 mt-1" />
          <div>
            <p className="text-lg font-medium italic">"{currentQuote}"</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stopwatch */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Stopwatch
            </h2>

            <div className="mb-8">
              <div className="text-6xl font-mono font-bold text-gray-900 dark:text-white mb-2">
                {formatStopwatch(stopwatchTime)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">MM:SS.MS</p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={toggleStopwatch}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  stopwatchRunning
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {stopwatchRunning ? (
                  <>
                    <FiPause className="w-5 h-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <FiPlay className="w-5 h-5" />
                    Start
                  </>
                )}
              </button>

              <button
                onClick={resetStopwatch}
                className="flex items-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                <FiRotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Countdown Timer
            </h2>

            {countdownComplete && (
              <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg">
                <p className="text-green-700 dark:text-green-400 font-medium">
                  ⏰ Time's up!
                </p>
              </div>
            )}

            <div className="mb-8">
              <div className="text-6xl font-mono font-bold text-gray-900 dark:text-white mb-2">
                {formatCountdown(countdownTime)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">HH:MM:SS</p>
            </div>

            {countdownTime === 0 && !countdownRunning && (
              <>
                {/* Preset Buttons */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick Set:</p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {presetTimes.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() =>
                          setCountdownInput({ hours: 0, minutes: preset.minutes, seconds: 0 })
                        }
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Input */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Hours
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={countdownInput.hours}
                      onChange={(e) =>
                        setCountdownInput({ ...countdownInput, hours: e.target.value })
                      }
                      className="w-full px-3 py-2 text-center border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Minutes
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={countdownInput.minutes}
                      onChange={(e) =>
                        setCountdownInput({ ...countdownInput, minutes: e.target.value })
                      }
                      className="w-full px-3 py-2 text-center border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Seconds
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={countdownInput.seconds}
                      onChange={(e) =>
                        setCountdownInput({ ...countdownInput, seconds: e.target.value })
                      }
                      className="w-full px-3 py-2 text-center border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={startCountdown}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors mx-auto"
                >
                  <FiPlay className="w-5 h-5" />
                  Start Countdown
                </button>
              </>
            )}

            {countdownTime > 0 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={toggleCountdown}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    countdownRunning
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {countdownRunning ? (
                    <>
                      <FiPause className="w-5 h-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <FiPlay className="w-5 h-5" />
                      Resume
                    </>
                  )}
                </button>

                <button
                  onClick={resetCountdown}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  <FiRotateCcw className="w-5 h-5" />
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Productivity Tips */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          ⚡ Productivity Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
              Pomodoro Technique
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Work for 25 minutes, then take a 5-minute break
            </p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-medium text-green-900 dark:text-green-300 mb-2">
              Time Blocking
            </h4>
            <p className="text-sm text-green-700 dark:text-green-400">
              Schedule specific time blocks for different tasks
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-2">
              Deep Work
            </h4>
            <p className="text-sm text-purple-700 dark:text-purple-400">
              Focus on one task without distractions for 60-90 minutes
            </p>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h4 className="font-medium text-yellow-900 dark:text-yellow-300 mb-2">
              Regular Breaks
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Take short breaks every hour to maintain productivity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
