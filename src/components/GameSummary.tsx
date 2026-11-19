import { Award, CheckCircle2, Flame, RotateCcw, XCircle } from 'lucide-react';
import { SENSORS, type GameRound, type SensorId } from '../data/sensors';
import { SensorIllustration } from './SensorIllustration';

export interface RoundHistoryItem {
  round: GameRound;
  selectedSensorId: SensorId;
  isCorrect: boolean;
  pointsEarned: number;
}

interface GameSummaryProps {
  score: number;
  bestStreak: number;
  bestScore: number;
  isNewBest: boolean;
  history: RoundHistoryItem[];
  onPlayAgain: () => void;
  onBackHome: () => void;
}

function getRankTitle(correctCount: number): { title: string; summary: string } {
  if (correctCount === 10) {
    return {
      title: 'Chief IoT Architect',
      summary: 'Perfect 10/10 calibration. Every scenario matched to the right module.',
    };
  }
  if (correctCount >= 8) {
    return {
      title: 'Senior Lab Specialist',
      summary: 'Strong hardware instincts across environmental, motion, and optical sensors.',
    };
  }
  if (correctCount >= 5) {
    return {
      title: 'Circuit Technician',
      summary: 'Solid foundation. Review the missed rounds below to lock in the specs.',
    };
  }
  return {
    title: 'IoT Apprentice',
    summary: 'Great warm-up! Check each sensor fact below and run another 10-round set.',
  };
}

export function GameSummary({
  score,
  bestStreak,
  bestScore,
  isNewBest,
  history,
  onPlayAgain,
  onBackHome,
}: GameSummaryProps) {
  const correctCount = history.filter((item) => item.isCorrect).length;
  const accuracy = history.length > 0 ? Math.round((correctCount / history.length) * 100) : 0;
  const rank = getRankTitle(correctCount);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-8">
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
              <Award className="w-4 h-4" />
              <span>10-Round Challenge Complete</span>
              {isNewBest && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-600">New High Score</span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5 text-balance">
              {rank.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-xl">
              {rank.summary}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onPlayAgain}
              className="min-h-[48px] px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
            <button
              type="button"
              onClick={onBackHome}
              className="min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm inline-flex items-center justify-center transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Home
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4">
            <div className="text-xs font-medium text-slate-500">Final Score</div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono-tabular mt-1">
              {score}
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4">
            <div className="text-xs font-medium text-slate-500">Accuracy</div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-700 font-mono-tabular mt-1">
              {correctCount}/{history.length} · {accuracy}%
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4">
            <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Best Streak</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-600 font-mono-tabular mt-1">
              {bestStreak}
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4">
            <div className="text-xs font-medium text-slate-500">Personal Best</div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-700 font-mono-tabular mt-1">
              {bestScore}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            Round-by-Round Hardware Notes
          </h2>
          <span className="text-xs text-slate-500 font-mono-tabular">
            {correctCount} matched · {history.length - correctCount} missed
          </span>
        </div>

        <div className="divide-y divide-slate-100 mt-1">
          {history.map(({ round, selectedSensorId, isCorrect, pointsEarned }) => {
            const correctSensor = SENSORS[round.scenario.correctSensorId];
            const pickedSensor = SENSORS[selectedSensorId];

            return (
              <div key={round.roundNumber} className="py-4 flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  <SensorIllustration sensorId={correctSensor.id} className="w-9 h-9" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <span className="font-mono-tabular text-slate-500">
                        Round {round.roundNumber}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-600">{round.scenario.context}</span>
                    </div>

                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 font-mono-tabular">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Matched · +{pointsEarned} pts</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700">
                        <XCircle className="w-4 h-4" />
                        <span>Picked {pickedSensor.model}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-slate-900 mt-1">
                    {correctSensor.name}{' '}
                    <span className="font-mono-tabular text-xs font-medium text-slate-500">
                      ({correctSensor.model})
                    </span>
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {round.scenario.fact}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
