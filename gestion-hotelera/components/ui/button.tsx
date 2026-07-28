"use client";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    className?: string;
};

const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-slate-900 text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70",
    secondary: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
};

export default function Button({
    variant = "primary",
    className = "",
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/30 ${variantStyles[variant]} ${className}`}
            {...props}
        />
    );
}
