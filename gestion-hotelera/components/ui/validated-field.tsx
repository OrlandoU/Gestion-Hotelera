"use client";

type CommonFieldProps = {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    onFocus?: () => void;
    error?: string;
    touched?: boolean;
    placeholder?: string;
    icon?: string;
    className?: string;
    containerClassName?: string;
    autoComplete?: string;
    required?: boolean;
    type?: string;
    id?: string;
    multiline?: boolean;
    rows?: number;
};

export function ValidatedInput({
    label,
    value,
    onChange,
    onBlur,
    onFocus,
    error,
    touched,
    placeholder,
    icon,
    className = "",
    containerClassName = "",
    autoComplete,
    required = false,
    type = "text",
    id,
    multiline = false,
    rows = 4,
}: CommonFieldProps) {
    const normalizedValue = typeof value === "string" ? value : String(value ?? "");
    const hasSuccess = Boolean(touched && normalizedValue.trim() && !error);
    const baseClasses = "w-full rounded-lg border bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:outline-none";
    const stateClasses = error
        ? "border-red-400 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-400/20"
        : hasSuccess
            ? "border-sky-400/80 bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            : "border-slate-300 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20";

    return (
        <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
            {label ? (
                <label className="text-sm font-semibold text-slate-700">
                    {label}
                    {required ? " *" : ""}
                </label>
            ) : null}
            <div className="relative">
                {icon ? (
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {icon}
                    </span>
                ) : null}
                {multiline ? (
                    <textarea
                        id={id}
                        value={normalizedValue}
                        onChange={(event) => onChange(event.target.value)}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        placeholder={placeholder}
                        rows={rows}
                        className={`${baseClasses} min-h-30 resize-y ${stateClasses} ${hasSuccess ? "pr-10" : "pr-3"} ${className}`}
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? `${id ?? label}-error` : undefined}
                    />
                ) : (
                    <input
                        id={id}
                        type={type}
                        value={normalizedValue}
                        onChange={(event) => onChange(event.target.value)}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        className={`${baseClasses} ${stateClasses} ${icon ? "pl-10" : ""} ${hasSuccess ? "pr-10" : "pr-3"} ${className}`}
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? `${id ?? label}-error` : undefined}
                    />
                )}
                {hasSuccess ? (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-500 material-symbols-outlined text-[18px] animate-in fade-in">
                        check
                    </span>
                ) : null}
            </div>
            {error ? (
                <p id={`${id ?? label}-error`} className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            ) : null}
        </div>
    );
}

type SelectFieldProps = CommonFieldProps & {
    options: Array<{ label: string; value: string }>;
};

export function ValidatedSelect({
    label,
    value,
    onChange,
    onBlur,
    onFocus,
    error,
    touched,
    placeholder,
    className = "",
    containerClassName = "",
    required = false,
    id,
    options,
}: SelectFieldProps) {
    const hasSuccess = Boolean(touched && value && !error);
    const baseClasses = "w-full rounded-lg border bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition-all duration-200 focus:outline-none";
    const stateClasses = error
        ? "border-red-400 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-400/20"
        : hasSuccess
            ? "border-sky-400/80 bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            : "border-slate-300 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20";

    return (
        <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
            {label ? (
                <label className="text-sm font-semibold text-slate-700">
                    {label}
                    {required ? " *" : ""}
                </label>
            ) : null}
            <select
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onBlur={onBlur}
                onFocus={onFocus}
                className={`${baseClasses} ${stateClasses} ${className}`}
                aria-invalid={Boolean(error)}
            >
                {placeholder ? <option value="">{placeholder}</option> : null}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error ? (
                <p className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1">{error}</p>
            ) : null}
        </div>
    );
}
