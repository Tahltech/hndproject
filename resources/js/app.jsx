import './bootstrap';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

// Optional: import a default layout if you want for some pages
import PublicLayout  from './Pages/Layout/PublicLayout';

createInertiaApp({
  title: title => title ? `${title} - TahlFIN` : 'TahlFIN',

  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
    const page = pages[`./Pages/${name}.jsx`];

    // Only assign Layout if the page explicitly defines layout or you want a default
    if (page.default.layout === undefined) {
      // Do nothing – page will render without layout
    }

    return page;
  },

  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },

  progress: {
    color: '#3B82F6',
    showSpinner: true,
  },
});
