"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { navigation } from "@/lib/constants";

interface QuizHeaderProps {
  onExit?: () => void;
  showExitConfirm?: boolean;
}

export function QuizHeader({
  onExit,
  showExitConfirm = true,
}: QuizHeaderProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleExitClick = () => {
    if (showExitConfirm) {
      setShowConfirm(true);
    } else {
      onExit?.();
    }
  };

  const handleConfirmExit = () => {
    setShowConfirm(false);
    onExit?.();
  };

  const handleCancelExit = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 h-[4.5rem] border-b border-slate-200/50 bg-[#fffdf6]/95 backdrop-blur-sm">
        <nav className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900 transition-colors hover:text-slate-700"
          >
            <Image
              src="/logos/icon.png"
              alt="First Date Labs logo"
              width={28}
              height={28}
              className="h-7 w-7"
            />
            <span className="leading-tight">{navigation.logoText}</span>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleExitClick}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="mr-1 h-4 w-4" />
            Exit
          </Button>
        </nav>
      </header>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">
              Exit Quiz?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Your progress will be saved. You can resume the quiz later.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleCancelExit}
              >
                Continue Quiz
              </Button>
              <Button
                variant="ghost"
                className="flex-1 text-slate-600"
                onClick={handleConfirmExit}
              >
                Exit
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
