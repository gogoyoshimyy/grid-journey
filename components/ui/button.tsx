
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const variants = {
            primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md',
            secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
            outline: 'border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-900',
            danger: 'bg-red-500 text-white hover:bg-red-600',
        };

        const sizes = {
            sm: 'h-9 px-4 text-sm',
            md: 'h-11 px-6 text-base', // 44px minimum touch target
            lg: 'h-14 px-8 text-lg',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:pointer-events-none active:scale-95',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
