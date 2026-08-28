import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Layers,
  Printer,
  X,
  ShieldCheck,
  FileText,
  UserCheck,
  Package,
  Wrench,
  HelpCircle,
  ChevronRight,
  Info
} from 'lucide-react';
import { Service, ServiceStep, Language, Role } from '../types';
import { getDefaultSOPForService } from '../data/defaultSOPs';
import { formatCurrency } from '../i18n';

interface ServiceSOPManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  allServices?: Service[];
  onSelectService?: (service: Service) => void;
  lang?: Language;
  currentRole?: Role;
}

export const ServiceSOPManualModal: React.FC<ServiceSOPManualModalProps> = ({
  isOpen,
  onClose,
  service,
  allServices = [],
  onSelectService,
  lang = 'vi',
  currentRole
}) => {
  if (!isOpen || !service) return null;

  const isAdminOrManager = currentRole === 'owner' || currentRole === 'manager';

  // Active view tab inside modal
  const [activeTab, setActiveTab] = useState<'sop_sheet' | 'live_execution' | 'products'>('sop_sheet');

  // Load SOP data (fallback to default template if service has no custom steps yet)
  const sopFallback = getDefaultSOPForService(service.name, service.category);
  const steps: ServiceStep[] = service.steps && service.steps.length > 0 ? service.steps : sopFallback.steps;
  const prepSteps: string[] = service.preparationSteps && service.preparationSteps.length > 0 ? service.preparationSteps : sopFallback.preparationSteps;
  const targetSkin = service.targetSkinType || sopFallback.targetSkinType;
  const benefits = service.benefitsSummary || service.description || sopFallback.benefitsSummary;
  const contraindications = service.contraindications || sopFallback.contraindications;
  const homeCare = service.homeCareNotes || sopFallback.homeCareNotes;

  // Live technician execution state (Checklist & Timer)
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [activeTimerStepId, setActiveTimerStepId] = useState<string | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Handle live timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Play subtle audio alert if possible
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 880; // A5 pitch
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        // Audio fallback
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  const handleStartTimer = (step: ServiceStep) => {
    const totalSecs = (step.durationMinutes || 5) * 60;
    setActiveTimerStepId(step.id);
    setTimerSecondsLeft(totalSecs);
    setIsTimerRunning(true);
  };

  const handleToggleStepCompleted = (stepId: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const handlePrintSOP = () => {
    window.print();
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-[#141619] w-full max-w-5xl rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-900 via-zinc-900 to-zinc-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-emerald-300 border border-white/10 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-bold uppercase tracking-wider">
                  SOP #{service.code || 'DV'}
                </span>
                <span className="text-xs text-zinc-300 font-medium">
                  {service.category} • {service.durationMinutes} phút
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-white truncate">
                {service.name}
              </h2>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handlePrintSOP}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-white/10 hidden sm:flex"
              title="In quy trình SOP ra giấy A4"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Thẻ SOP</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 pt-3 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between overflow-x-auto shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('sop_sheet')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center space-x-2 border-b-2 ${
                activeTab === 'sop_sheet'
                  ? 'border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-300 bg-white dark:bg-[#141619]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>1. Quy Trình Chuẩn (SOP Sheet)</span>
            </button>

            <button
              onClick={() => setActiveTab('live_execution')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center space-x-2 border-b-2 ${
                activeTab === 'live_execution'
                  ? 'border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-300 bg-white dark:bg-[#141619]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>2. Chế Độ Ca Làm (Kỹ Thuật Viên)</span>
              {completedCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold">
                  {completedCount}/{steps.length}
                </span>
              )}
            </button>
          </div>

          {/* Quick Service Switcher if multiple services passed */}
          {allServices.length > 1 && onSelectService && (
            <div className="hidden md:flex items-center space-x-2 pb-2">
              <span className="text-[11px] text-zinc-400 font-semibold">Chuyển dịch vụ:</span>
              <select
                value={service.id}
                onChange={e => {
                  const s = allServices.find(item => item.id === e.target.value);
                  if (s) onSelectService(s);
                }}
                className="px-3 py-1 rounded-xl text-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold focus:outline-none"
              >
                {allServices.map(s => (
                  <option key={s.id} value={s.id}>
                    [{s.code || 'DV'}] {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: SOP SHEET (PRINTABLE / EDITORIAL VIEW) */}
          {activeTab === 'sop_sheet' && (
            <div className="space-y-6">
              {/* Header Overview Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Mô Tả Công Dụng & Tác Dụng Nổi Bật</span>
                  </span>
                  {isAdminOrManager && (
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Giá trải nghiệm: {formatCurrency(service.price, (lang || 'vi') as Language)}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                  {benefits}
                </p>
                {targetSkin && (
                  <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/50 flex items-center space-x-2 text-xs text-emerald-900 dark:text-emerald-200">
                    <strong className="font-bold">Loại da áp dụng:</strong>
                    <span>{targetSkin}</span>
                  </div>
                )}
              </div>

              {/* Preparation Steps Section */}
              {prepSteps.length > 0 && (
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Các Bước Chuẩn Bị & Sát Khuẩn Trước Trị Liệu</span>
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {prepSteps.map((prep, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-zinc-700 dark:text-zinc-300">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span className="leading-snug">{prep}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Steps Table / Step Timeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Quy Trình {steps.length} Bước Thực Hiện Chi Tiết</span>
                  </h3>
                  <span className="text-xs text-zinc-500">
                    Tổng thời lượng: <strong>{service.durationMinutes} phút</strong>
                  </span>
                </div>

                <div className="space-y-3">
                  {steps.map((step) => (
                    <div
                      key={step.id || step.stepNumber}
                      className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-3">
                          <span className="w-7 h-7 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {step.stepNumber}
                          </span>
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            {step.title}
                          </h4>
                        </div>
                        {step.durationMinutes && (
                          <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium flex items-center space-x-1 shrink-0">
                            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>{step.durationMinutes} phút</span>
                          </span>
                        )}
                      </div>

                      {step.description && (
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed pl-10">
                          {step.description}
                        </p>
                      )}

                      {(step.productsUsed || step.toolsUsed || step.notes) && (
                        <div className="pl-10 grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px]">
                          {step.productsUsed && (
                            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50">
                              <span className="font-bold text-zinc-500 dark:text-zinc-400 block mb-0.5 flex items-center space-x-1">
                                <Package className="w-3 h-3 text-emerald-600" />
                                <span>Mỹ phẩm sử dụng:</span>
                              </span>
                              <span className="text-zinc-800 dark:text-zinc-200 font-medium">{step.productsUsed}</span>
                            </div>
                          )}

                          {step.toolsUsed && (
                            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50">
                              <span className="font-bold text-zinc-500 dark:text-zinc-400 block mb-0.5 flex items-center space-x-1">
                                <Wrench className="w-3 h-3 text-amber-600" />
                                <span>Dụng cụ đi kèm:</span>
                              </span>
                              <span className="text-zinc-800 dark:text-zinc-200 font-medium">{step.toolsUsed}</span>
                            </div>
                          )}

                          {step.notes && (
                            <div className="bg-amber-50/70 dark:bg-amber-950/30 p-2 rounded-xl border border-amber-200/60 dark:border-amber-800/50">
                              <span className="font-bold text-amber-800 dark:text-amber-400 block mb-0.5 flex items-center space-x-1">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                <span>Lưu ý kỹ thuật viên:</span>
                              </span>
                              <span className="text-amber-900 dark:text-amber-300">{step.notes}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Contraindications & Home Care Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {contraindications && (
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 space-y-1.5 text-xs">
                    <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center space-x-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Chống Chỉ Định & Lưu Ý Y Khoa</span>
                    </div>
                    <p className="text-rose-900 dark:text-rose-200 leading-snug">{contraindications}</p>
                  </div>
                )}

                {homeCare && (
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 space-y-1.5 text-xs">
                    <div className="font-bold text-blue-800 dark:text-blue-300 flex items-center space-x-1.5">
                      <Info className="w-4 h-4 text-blue-600" />
                      <span>Hướng Dẫn Dặn Dò Khách Hàng Tại Nhà</span>
                    </div>
                    <p className="text-blue-900 dark:text-blue-200 leading-snug">{homeCare}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: LIVE TECHNICIAN EXECUTION (INTERACTIVE CHECKLIST & TIMER) */}
          {activeTab === 'live_execution' && (
            <div className="space-y-5">
              {/* Progress Bar Header */}
              <div className="p-4 rounded-2xl bg-zinc-900 text-white space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tiến Độ Thực Hiện Ca Làm</span>
                  </span>
                  <span className="font-mono font-bold">
                    {completedCount} / {steps.length} bước hoàn thành ({progressPercent}%)
                  </span>
                </div>

                <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Active Step Timer Card */}
                {activeTimerStepId && (
                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span>Đang đếm giờ bước #{steps.find(s => s.id === activeTimerStepId)?.stepNumber}:</span>
                      <strong className="text-amber-300 font-bold">{steps.find(s => s.id === activeTimerStepId)?.title}</strong>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-base font-black text-amber-400">
                        {Math.floor(timerSecondsLeft / 60)}:{(timerSecondsLeft % 60).toString().padStart(2, '0')}
                      </span>
                      <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-bold flex items-center space-x-1"
                      >
                        {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>{isTimerRunning ? 'Tạm dừng' : 'Tiếp tục'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsTimerRunning(false);
                          setActiveTimerStepId(null);
                        }}
                        className="p-1 rounded-lg text-zinc-400 hover:text-white"
                        title="Tắt đếm giờ"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Step List */}
              <div className="space-y-3">
                {steps.map((step) => {
                  const isDone = Boolean(completedSteps[step.id]);
                  return (
                    <div
                      key={step.id || step.stepNumber}
                      onClick={() => handleToggleStepCompleted(step.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isDone
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 opacity-80'
                          : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-emerald-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start space-x-3.5 min-w-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStepCompleted(step.id);
                            }}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                              isDone
                                ? 'bg-emerald-600 text-white'
                                : 'border-2 border-zinc-300 dark:border-zinc-700 hover:border-emerald-500'
                            }`}
                          >
                            {isDone && <CheckCircle2 className="w-4 h-4" />}
                          </button>
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs font-bold ${isDone ? 'line-through text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                Bước {step.stepNumber}: {step.title}
                              </span>
                              {step.durationMinutes && (
                                <span className="text-[11px] text-zinc-400 font-normal">
                                  ({step.durationMinutes} phút)
                                </span>
                              )}
                            </div>
                            {step.description && (
                              <p className={`text-xs leading-relaxed ${isDone ? 'text-zinc-400 line-through' : 'text-zinc-600 dark:text-zinc-300'}`}>
                                {step.description}
                              </p>
                            )}
                            {step.productsUsed && (
                              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                                💊 Mỹ phẩm: {step.productsUsed}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Timer launch button */}
                        {!isDone && step.durationMinutes && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartTimer(step);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors shrink-0 flex items-center space-x-1"
                          >
                            <Play className="w-3 h-3 fill-amber-600 text-amber-600" />
                            <span>Bấm giờ ({step.durationMinutes}m)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-zinc-500">
            * Quy trình trị liệu chuẩn y khoa nội bộ Spa Master
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold transition-colors"
          >
            Đóng Hướng Dẫn
          </button>
        </div>
      </div>
    </div>
  );
};
