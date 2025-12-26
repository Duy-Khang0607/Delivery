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
                            initial={{ opacity: 0, x: 40, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 40, scale: 0.95 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className={`px-4 py-3 rounded-xl shadow-lg flex flex-row items-center gap-2 text-white min-w-[260px] 
                ${toast.type === "success" ? "bg-green-600" : ""}
                ${toast.type === "error" ? "bg-red-600" : ""}
                ${toast.type === "info" ? "bg-blue-500" : ""}`}
                        >
                            {toast?.type === "success" ? (
                                <Check className="w-5 h-5 bg-white rounded-full text-center text-green-700" />
                            ) : toast?.type === "error" ? (
                                <CircleX className="w-5 h-5 bg-white rounded-full text-center text-red-700" />
                            ) : (
                                <Info className="w-5 h-5 bg-white rounded-full text-center text-blue-400" />
                            )}

                            <span>{toast.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
