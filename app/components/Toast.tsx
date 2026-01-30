"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleX, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

type Toast = {
    id: string;
    message: string;
    type: ToastType;
};

type ToastContextType = {
    showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType = "info") => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 2500);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast UI */}
            <div className="fixed top-5 right-5 z-999 space-y-3">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ x: 40, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 40, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 40, damping: 14 }}
                            className={`px-2 py-2 rounded-xl shadow-lg flex flex-row items-center gap-2 text-white w-fit shadow-white/50 border-white bg-black/10 backdrop-blur-sm
                ${toast.type === "success" ? "bg-green-500 border-green-700" : ""}
                ${toast.type === "error" ? "bg-red-500 border-red-700" : ""}
                ${toast.type === "info" ? "bg-blue-500 border-blue-700" : ""}`}
                        >
                            {toast?.type === "success" ? (
                                <Check className="w-5 h-5 bg-white rounded-full text-center text-green-700" />
                            ) : toast?.type === "error" ? (
                                <CircleX className="w-5 h-5 bg-white rounded-full text-center text-red-700" />
                            ) : (
                                <Info className="w-5 h-5 bg-white rounded-full text-center text-blue-400" />
                            )}

                            <span className="text-xs md:text-sm w-full">{toast.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
