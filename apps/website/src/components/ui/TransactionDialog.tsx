"use client";

import React, { useState, createContext, useContext } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Context for dialog state management
type CustomAlertDialogState = {
  isOpen?: boolean;
  title: string;
  description: string;
  onConfirm: (confirmed?: boolean) => void;
  onCancel: (confirmed?: boolean) => void;
};

type LoadingDialogState = {
  isOpen: boolean;
  title: string;
  description: string;
};

type TransactionDialog = {
  consentState: CustomAlertDialogState;
  loadingState: LoadingDialogState;
  showCustomAlertDialog: (config: CustomAlertDialogState) => void;
  hideCustomAlertDialog: () => void;
  showLoadingDialog: (config: LoadingDialogState) => void;
  hideLoadingDialog: () => void;
};

const TransactionDialogContext = createContext<TransactionDialog>({
  consentState: {
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
    onCancel: () => {},
  },
  loadingState: {
    isOpen: false,
    title: "Processing...",
    description: "Please wait while we process your request.",
  },
  showCustomAlertDialog: () => {},
  hideCustomAlertDialog: () => {},
  showLoadingDialog: () => {},
  hideLoadingDialog: () => {},
});

// Dialog Provider Component
export const TransactionDialogProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [consentState, setConsentState] = useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const [loadingState, setLoadingState] = useState({
    isOpen: false,
    title: "Processing...",
    description: "Please wait while we process your request.",
  });

  const showCustomAlertDialog = (config: CustomAlertDialogState) => {
    setConsentState({
      ...config,
      isOpen: true,
    });
  };

  const hideCustomAlertDialog = () => {
    setConsentState((prev) => ({ ...prev, isOpen: false }));
  };

  const showLoadingDialog = (config: LoadingDialogState) => {
    setLoadingState({
      ...config,
      isOpen: true,
    });
  };

  const hideLoadingDialog = () => {
    setLoadingState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <TransactionDialogContext.Provider
      value={{
        consentState,
        loadingState,
        showCustomAlertDialog,
        hideCustomAlertDialog,
        showLoadingDialog,
        hideLoadingDialog,
      }}
    >
      {children}
      <CustomAlertDialog />
      <LoadingDialog />
    </TransactionDialogContext.Provider>
  );
};

// Hook to use dialog context
export const useDialog = () => {
  const context = useContext(TransactionDialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};

// Consent Dialog Component using shadcn/ui AlertDialog
const CustomAlertDialog = () => {
  const { consentState, hideCustomAlertDialog } = useDialog();

  const handleConfirm = () => {
    consentState.onConfirm(true);
    hideCustomAlertDialog();
  };

  const handleCancel = () => {
    consentState.onCancel(false);
    hideCustomAlertDialog();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCancel();
    }
  };

  return (
    <AlertDialog open={consentState.isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="border border-black bg-white text-black">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="">
              <AlertTriangle className="w-8 h-8 text-black" />
            </div>
            <AlertDialogTitle className="scroll-m-20 text-xl font-semibold tracking-tight">
              {consentState.title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className={`font-semibold pt-2`}>
            {consentState.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={handleCancel}
            className="text-black cursor-pointer"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="cursor-pointer text-whote bg-black hover:bg-white hover:text-black"
          >
            Proceed
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Loading Dialog Component using shadcn/ui Card
const LoadingDialog = () => {
  const { loadingState } = useDialog();

  if (!loadingState.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Dialog using Card */}
      <Card
        className="border border-black bg-white text-black
      relative w-80 mx-4 animate-in fade-in-0 zoom-in-95 duration-300"
      >
        <CardHeader className="text-center pb-4">
          {/* Animated Loading Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-black" />
            </div>
          </div>
          <CardTitle className="text-xl">{loadingState.title}</CardTitle>
          <CardDescription>{loadingState.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Progress dots animation */}
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-black rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
