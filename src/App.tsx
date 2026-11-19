import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Flame,
  Play,
  RotateCcw,
  Trophy,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { FieldGuideModal } from './components/FieldGuideModal';
import { GameSummary, type RoundHistoryItem } from './components/GameSummary';
import { SensorIllustration } from './components/SensorIllustration';
import {
  SENSORS,
  TOTAL_ROUNDS,
  buildGameDeck,
  type GameRound,
  type SensorId,
  type SensorSpec,
} from './data/sensors';
import { soundEngine } from './utils/sound';

type GameState = 'TITLE_MENU' | 'PLAYING' | 'GAME_OVER';

const BEST_SCORE_STORAGE_KEY = 'sensor_match_best_score_v1';

const PREVIEW_SENSOR_IDS: SensorId[] = [
  'ultrasonic',
  'dht22',
  'pir',
  'mq2',
  'rfid',
  'mpu6050',
];

function readStoredBestScore(): number {
  try {
    const raw = window.localStorage.getItem(BEST_SCORE_STORAGE_KEY);
    const parsed = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

function writeStoredBestScore(score: number): void {
  try {
    window.localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(score));
  } catch {
    // Ignore storage quota or private browsing errors
  }
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [deck, setDeck] = useState<GameRound[]>(() => buildGameDeck());
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedSensorId, setSelectedSensorId] = useState<SensorId | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);
  const [history, setHistory] = useState<RoundHistoryItem[]>([]);
  const [bestScore, setBestScore] = useState<number>(() => readStoredBestScore());
  const [isNewBest, setIsNewBest] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [inspectedPreviewId, setInspectedPreviewId] = useState<SensorId>('ultrasonic');

  const feedbackRef = useRef<HTMLDivElement | null>(null);

  const currentRound = deck[roundIndex];
  const isAnswered = selectedSensorId !== null;
  const isCurrentCorrect =
    isAnswered && selectedSensorId === currentRound?.scenario.correctSensorId;

  const startNewGame = useCallback(() => {
    if (!isMuted) {
      soundEngine.playTap();
    }
    setDeck(buildGameDeck());
    setRoundIndex(0);
    setSelectedSensorId(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setLastPointsEarned(0);
    setHistory([]);
    setIsNewBest(false);
    setGameState('PLAYING');
  }, [isMuted]);

  const handleSelectSensor = useCallback(
    (sensorId: SensorId) => {
      if (gameState !== 'PLAYING' || selectedSensorId !== null || !currentRound) {
        return;
      }

      const correct = sensorId === currentRound.scenario.correctSensorId;
      setSelectedSensorId(sensorId);

      if (correct) {
        const nextStreak = streak + 1;
        const streakBonus = Math.min(nextStreak - 1, 4) * 25;
        const earned = 100 + streakBonus;
        const nextScore = score + earned;

        setStreak(nextStreak);
        setBestStreak((prev) => Math.max(prev, nextStreak));
        setScore(nextScore);
        setLastPointsEarned(earned);

        if (nextScore > bestScore) {
          setBestScore(nextScore);
          setIsNewBest(true);
          writeStoredBestScore(nextScore);
        }

        setHistory((prev) => [
          ...prev,
          {
            round: currentRound,
            selectedSensorId: sensorId,
            isCorrect: true,
            pointsEarned: earned,
          },
        ]);

        if (!isMuted) {
          soundEngine.playCorrect(nextStreak);
        }
      } else {
        setStreak(0);
        setLastPointsEarned(0);
        setHistory((prev) => [
          ...prev,
          {
            round: currentRound,
            selectedSensorId: sensorId,
            isCorrect: false,
            pointsEarned: 0,
          },
        ]);

        if (!isMuted) {
          soundEngine.playWrong();
        }
      }
    },
    [bestScore, currentRound, gameState, isMuted, score, selectedSensorId, streak]
  );

  const handleNextRound = useCallback(() => {
    if (gameState !== 'PLAYING' || selectedSensorId === null) {
      return;
    }

    if (roundIndex + 1 >= deck.length) {
      if (!isMuted) {
        soundEngine.playVictory();
      }
      setGameState('GAME_OVER');
      return;
    }

    if (!isMuted) {
      soundEngine.playTap();
    }
    setRoundIndex((prev) => prev + 1);
    setSelectedSensorId(null);
    setLastPointsEarned(0);
  }, [deck.length, gameState, isMuted, roundIndex, selectedSensorId]);

  useEffect(() => {
    if (isAnswered && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isAnswered]);

  useEffect(() => {
    if (gameState !== 'PLAYING' || isGuideOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (!isAnswered && currentRound) {
        const keyIndex = ['1', '2', '3', '4'].indexOf(e.key);
        if (keyIndex !== -1 && currentRound.options[keyIndex]) {
          e.preventDefault();
          handleSelectSensor(currentRound.options[keyIndex].id);
        }
      } else if (isAnswered && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleNextRound();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentRound, gameState, handleNextRound, handleSelectSensor, isAnswered, isGuideOpen]);

  const inspectedSensor: SensorSpec = SENSORS[inspectedPreviewId];

  return (
    <div className="min-h-dvh flex flex-col lab-grid-bg text-slate-900">
      {/* Compact Sticky Top Bar (<15% mobile height) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setGameState('TITLE_MENU')}
            className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded-md"
          >
            Sensor Match
          </button>

          {gameState === 'PLAYING' ? (
            <div className="flex items-center gap-3 sm:gap-5 shrink-0">
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-mono-tabular">
                <div className="text-slate-600">
                  <span className="hidden sm:inline">Round </span>
                  <span className="font-bold text-slate-900">{roundIndex + 1}</span>
                  <span>/{TOTAL_ROUNDS}</span>
                </div>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <div className="font-bold text-blue-700">
                  {score} <span className="font-medium text-slate-500">pts</span>
                </div>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <div
                  className={`inline-flex items-center gap-1 font-bold ${
                    streak >= 2 ? 'text-amber-600' : 'text-slate-600'
                  }`}
                >
                  <Flame className={`w-4 h-4 ${streak >= 2 ? 'text-amber-500' : 'text-slate-400'}`} />
                  <span>{streak}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMuted((m) => !m)}
                aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsGuideOpen(true)}
                className="min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Field Guide</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMuted((m) => !m)}
                aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8 flex flex-col">
        {gameState === 'TITLE_MENU' && (
          <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Hero Left */}
            <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="text-xs sm:text-sm font-semibold text-blue-700">
                  ITE IoT Hardware Challenge · 10 Rounds
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mt-2 text-balance leading-[1.12]">
                  Pick the right sensor!
                </h1>

                <p className="text-base text-slate-600 mt-4 max-w-xl leading-relaxed">
                  Read a practical IoT scenario from campus labs, smart homes, or robotics projects,
                  then tap the hardware module built for the job. Chain consecutive matches to build
                  your streak bonus and unlock quick engineering facts after every round.
                </p>

                <dl className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
                  <div>
                    <dt className="text-xs font-medium text-slate-500">Rounds</dt>
                    <dd className="text-lg sm:text-xl font-bold text-slate-900 font-mono-tabular mt-0.5">
                      10
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-slate-500">Streak Bonus</dt>
                    <dd className="text-lg sm:text-xl font-bold text-amber-600 font-mono-tabular mt-0.5">
                      +25/step
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-blue-600" />
                      <span>Best Score</span>
                    </dt>
                    <dd className="text-lg sm:text-xl font-bold text-blue-700 font-mono-tabular mt-0.5">
                      {bestScore > 0 ? bestScore : '—'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={startNewGame}
                  className="min-h-[52px] px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-base inline-flex items-center justify-center gap-2.5 shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Game</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsGuideOpen(true)}
                  className="min-h-[52px] px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Browse 14 Sensors</span>
                </button>
              </div>
            </section>

            {/* Interactive Hardware Preview Right */}
            <section className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-bold text-slate-900">Kit Preview</h2>
                  <span className="text-xs text-slate-500">Tap a module to inspect</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 mt-4">
                  {PREVIEW_SENSOR_IDS.map((id) => {
                    const s = SENSORS[id];
                    const active = inspectedPreviewId === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setInspectedPreviewId(id)}
                        className={`min-h-[88px] p-2.5 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                          active
                            ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                            : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/70'
                        }`}
                      >
                        <SensorIllustration sensorId={id} className="w-10 h-10" />
                        <span className="text-[11px] font-bold text-slate-800 font-mono-tabular leading-tight truncate max-w-full">
                          {s.model.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  <SensorIllustration sensorId={inspectedSensor.id} className="w-9 h-9" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900">
                    {inspectedSensor.name}
                  </div>
                  <div className="text-xs text-slate-500 font-mono-tabular mt-0.5">
                    {inspectedSensor.model} · {inspectedSensor.signal}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {inspectedSensor.shortRole}
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {gameState === 'PLAYING' && currentRound && (
          <div className="flex-1 flex flex-col gap-4 sm:gap-5">
            {/* 10-Segment Round Progress Strip */}
            <div
              className="grid grid-cols-10 gap-1.5"
              aria-label={`Progress: Round ${roundIndex + 1} of ${TOTAL_ROUNDS}`}
            >
              {deck.map((r, idx) => {
                const record = history[idx];
                let barClass = 'bg-slate-200';
                if (record) {
                  barClass = record.isCorrect ? 'bg-emerald-500' : 'bg-rose-500';
                } else if (idx === roundIndex) {
                  barClass = 'bg-blue-600';
                }
                return (
                  <div
                    key={r.roundNumber}
                    className={`h-2 rounded-full transition-colors ${barClass}`}
                  />
                );
              })}
            </div>

            {/* Responsive Game Stage: Mobile stacked (Situation -> 4 Cards -> Fact/Next), Desktop 2-col */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
              {/* Situation Card */}
              <section className="lg:col-span-5 lg:col-start-1 lg:row-start-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-500">
                  <span className="text-blue-700">{currentRound.scenario.context}</span>
                  <span className="font-mono-tabular">
                    Round {roundIndex + 1} of {TOTAL_ROUNDS}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-2.5 leading-snug text-balance">
                  {currentRound.scenario.situation}
                </h2>

                {!isAnswered && (
                  <p className="text-xs sm:text-sm text-slate-500 mt-3">
                    Tap the sensor module that solves this situation.
                  </p>
                )}
              </section>

              {/* 4 Sensor Cards (2x2 grid on both mobile & desktop) */}
              <section
                aria-label="Sensor choices"
                className="lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:row-span-2 grid grid-cols-2 gap-3 sm:gap-4"
              >
                {currentRound.options.map((sensor, idx) => {
                  const isCorrectOption =
                    sensor.id === currentRound.scenario.correctSensorId;
                  const isSelected = selectedSensorId === sensor.id;

                  let cardStyle =
                    'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 active:scale-[0.98] shadow-sm';
                  let statusLabel: { text: string; icon: 'check' | 'x'; tone: string } | null =
                    null;

                  if (isAnswered) {
                    if (isCorrectOption) {
                      cardStyle =
                        'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm';
                      statusLabel = {
                        text: isSelected ? `Correct · +${lastPointsEarned}` : 'Right sensor',
                        icon: 'check',
                        tone: 'text-emerald-700',
                      };
                    } else if (isSelected) {
                      cardStyle =
                        'bg-rose-50/70 border-rose-500 ring-2 ring-rose-500/20 shadow-sm';
                      statusLabel = {
                        text: 'Your pick',
                        icon: 'x',
                        tone: 'text-rose-700',
                      };
                    } else {
                      cardStyle = 'bg-white/75 border-slate-200 opacity-55';
                    }
                  }

                  return (
                    <button
                      key={sensor.id}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectSensor(sensor.id)}
                      className={`relative min-h-[152px] sm:min-h-[184px] p-3.5 sm:p-5 rounded-2xl border-2 text-left flex flex-col justify-between transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                        isAnswered ? 'cursor-default' : 'cursor-pointer'
                      } ${cardStyle}`}
                    >
                      <div className="flex items-start justify-between gap-2 w-full">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0">
                          <SensorIllustration
                            sensorId={sensor.id}
                            className="w-11 h-11 sm:w-13 sm:h-13"
                          />
                        </div>

                        <span className="hidden sm:inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-[11px] font-bold text-slate-500 font-mono-tabular shrink-0">
                          {idx + 1}
                        </span>
                      </div>

                      <div className="mt-3">
                        <div className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                          {sensor.name}
                        </div>
                        <div className="text-xs text-slate-500 font-mono-tabular mt-1 truncate">
                          {sensor.model}
                        </div>

                        {statusLabel && (
                          <div
                            className={`mt-2 inline-flex items-center gap-1 text-xs font-bold font-mono-tabular ${statusLabel.tone}`}
                          >
                            {statusLabel.icon === 'check' ? (
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 shrink-0" />
                            )}
                            <span>{statusLabel.text}</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </section>

              {/* Short Fact + Next Round Card (Thumb zone on mobile, left-bottom on desktop) */}
              <div
                ref={feedbackRef}
                className="lg:col-span-5 lg:col-start-1 lg:row-start-2"
              >
                <AnimatePresence mode="wait">
                  {isAnswered ? (
                    <motion.section
                      key={`fact-${currentRound.roundNumber}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                      className={`rounded-2xl border-2 p-5 sm:p-6 shadow-sm ${
                        isCurrentCorrect
                          ? 'bg-emerald-50 border-emerald-300'
                          : 'bg-rose-50 border-rose-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {isCurrentCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-700 shrink-0" />
                          )}
                          <h3
                            className={`text-base font-extrabold ${
                              isCurrentCorrect ? 'text-emerald-900' : 'text-rose-900'
                            }`}
                          >
                            {isCurrentCorrect
                              ? streak >= 2
                                ? `Spot on! ${streak} in a row`
                                : 'Spot on!'
                              : `Use ${SENSORS[currentRound.scenario.correctSensorId].model}`}
                          </h3>
                        </div>

                        {isCurrentCorrect && (
                          <span className="text-sm font-bold font-mono-tabular text-emerald-800 whitespace-nowrap shrink-0">
                            +{lastPointsEarned} pts
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-slate-800 mt-2.5 leading-relaxed">
                        {currentRound.scenario.fact}
                      </p>

                      <div className="text-xs text-slate-600 font-mono-tabular mt-2.5">
                        Interface: {SENSORS[currentRound.scenario.correctSensorId].signal}
                      </div>

                      <button
                        type="button"
                        onClick={handleNextRound}
                        className="mt-4 w-full min-h-[48px] px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-sm inline-flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                      >
                        <span>
                          {roundIndex + 1 >= TOTAL_ROUNDS ? 'See Final Score' : 'Next Round'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.section>
                  ) : (
                    <div className="hidden lg:flex items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-white/60 px-5 py-4 text-xs text-slate-500">
                      <span>Keyboard tip: Press keys 1–4 to pick a sensor</span>
                      <button
                        type="button"
                        onClick={startNewGame}
                        className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-slate-900 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restart</span>
                      </button>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {gameState === 'GAME_OVER' && (
          <GameSummary
            score={score}
            bestStreak={bestStreak}
            bestScore={bestScore}
            isNewBest={isNewBest}
            history={history}
            onPlayAgain={startNewGame}
            onBackHome={() => setGameState('TITLE_MENU')}
          />
        )}
      </main>

      <FieldGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
