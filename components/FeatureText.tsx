"use client";

import React, { useEffect } from "react";
import Link from "next/link";

const colors = [
    'var(--color-prisma-a)',
    'var(--color-prisma-b)',
    'var(--color-prisma-c)',
    'var(--color-prisma-d)',
    'var(--color-prisma-e)',
    'var(--color-prisma-f)',
];

interface FeatureTextProps {
    text: string;
    colorSelections?: [number, number];
    className?: string;
    href?: string; // Optional internal route
};

const FeatureText: React.FC<FeatureTextProps> = ({ text, className, href, colorSelections }) => {
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty("--angle", "45deg");

        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX / window.innerWidth - 0.5;
            const y = e.clientY / window.innerHeight - 0.5;
            const angle = Math.atan2(y, x) * (180 / Math.PI);
            root.style.setProperty("--angle", `${angle}deg`);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const indices = (Array.isArray(colorSelections) && colorSelections.length === 2)
        ? colorSelections
        : [0, 1];

    const selectedColors = indices.map((i) => colors[i]);

    const content = (
        <span
            className={`
                font-squid transition-all duration-75 
                text-transparent bg-clip-text
                ${className ?? ""}
            `}
            style={{
                backgroundImage: `linear-gradient(var(--angle), ${selectedColors.join(",")})`,
            }}
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
