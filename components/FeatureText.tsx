"use client";

import React, { useEffect } from "react";
import Link from "next/link";

interface FeatureTextProps {
    text: string;
    className?: string;
    href?: string; // Optional internal route
}

const FeatureText: React.FC<FeatureTextProps> = ({ text, className, href }) => {
    useEffect(() => {
        const root = document.documentElement;

        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX / window.innerWidth - 0.5;
            const y = e.clientY / window.innerHeight - 0.5;
            const angle = Math.atan2(y, x) * (180 / Math.PI);
            root.style.setProperty("--angle", `${angle}deg`);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const content = (
        <span
            className={`
                font-squid transition-all duration-75 
                text-transparent bg-clip-text
                bg-[linear-gradient(var(--angle),var(--color-prisma-a),var(--color-prisma-b))]
                ${className ?? ""}
            `}
        >
            {text}
        </span>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return content;
};

export default FeatureText;
