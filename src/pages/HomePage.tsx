import { Header } from '@/components/layout/Header';
import { StepIndicator } from '@/components/layout/StepIndicator';
import { Step1Activity } from '@/components/wizard/Step1Activity';
import { Step2Projects } from '@/components/wizard/Step2Projects';
import { Step3Materials } from '@/components/wizard/Step3Materials';
import { Step4Review } from '@/components/wizard/Step4Review';
import { ManagerPanel } from '@/components/manager/ManagerPanel';
import { useAppStore } from '@/stores/useAppStore';
import { useEffect } from 'react';

export default function HomePage() {
  const { currentStep, runValidations } = useAppStore();

  useEffect(() => {
    runValidations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 pb-16">
        <StepIndicator />

        <div className="mt-2">
          <ManagerPanel />
        </div>

        <div className="relative mt-4">
          <div
            key={currentStep}
            className="animate-in fade-in duration-300"
          >
            {currentStep === 1 && <Step1Activity />}
            {currentStep === 2 && <Step2Projects />}
            {currentStep === 3 && <Step3Materials />}
            {currentStep === 4 && <Step4Review />}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 bg-white/50 backdrop-blur">
        <div className="mx-auto max-w-[1400px] px-6 py-5 text-center text-xs text-slate-400">
          体测材料核对系统 · 会话模式 · 所有数据仅保存在当前浏览器中
        </div>
      </footer>
    </div>
  );
}
