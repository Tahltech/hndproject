import "./bootstrap";

import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import "../css/app.css";

createInertiaApp({
    title: (title) => (title ? `${title} - TahlFIN` : "TahlFIN"),

    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),

    setup({ el, App, props }) {
        // app.jsx
        const darkMode =
            localStorage.getItem("darkMode") === "true" ||
            props.initialPage.props?.authUser?.preferences?.darkMode;

        if (darkMode) {
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }

        createRoot(el).render(<App {...props} />);
    },

    progress: {
        color: "#3B82F6",
        showSpinner: true,
    },
});
