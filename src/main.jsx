import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/* Self-hosted fonts for Curatorial Host Shell (@fontsource v5.3 exports ./* -> ./*.css) */
import '@fontsource/instrument-serif/400';
import '@fontsource/instrument-serif/400-italic';
import '@fontsource/ibm-plex-sans/400';
import '@fontsource/ibm-plex-sans/500';
import '@fontsource/ibm-plex-sans/600';
import '@fontsource/ibm-plex-sans/700';
import '@fontsource/ibm-plex-mono/400';
import '@fontsource/ibm-plex-mono/500';
import '@fontsource/ibm-plex-mono/600';

/* Self-hosted fonts for all 5 Scoped Project Worlds */
import '@fontsource/eb-garamond/400';
import '@fontsource/eb-garamond/600';
import '@fontsource/noto-sans/400';
import '@fontsource/noto-sans/600';
import '@fontsource/schibsted-grotesk/500';
import '@fontsource/schibsted-grotesk/700';
import '@fontsource/archivo/600';
import '@fontsource/archivo/700';
import '@fontsource/jetbrains-mono/400';
import '@fontsource/jetbrains-mono/600';
import '@fontsource/montserrat/700';
import '@fontsource/montserrat/800';
import '@fontsource/big-shoulders-display/800';
import '@fontsource/big-shoulders-display/900';

import './styles/tokens.css';
import './styles/global.css';
import './styles/HubSections.css';
import './styles/CaseStudy.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
