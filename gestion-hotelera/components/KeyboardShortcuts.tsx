"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KeyboardShortcuts() {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;

            // Stop execution if the user is currently typing inside forms
            // so pressing '.' works normally inside text fields.
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT" ||
                target.isContentEditable
            ) {
                return;
            }

            // Check for global combinations
            // 1. Ctrl + K Shortcut
            if (event.ctrlKey && event.key.toLowerCase() === "k") {
                event.preventDefault();
                console.log("Abrir búsqueda..."); // Trigger your search modal logic here
            }

            // 2. "." Shortcut to go to /bd
            if (event.key === ".") {
                event.preventDefault();
                router.push("/bd");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [router]);

    return null; // This component doesn't render anything visual
}