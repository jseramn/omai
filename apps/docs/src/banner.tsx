import { createRoot } from 'react-dom/client';
import { Badge, Button, CodeBlock, Kbd, OmaiProvider } from '@jseramn/omai';
import '@fontsource-variable/geist';
import '@fontsource-variable/jetbrains-mono';
import '@jseramn/omai-tokens/tokens.css';
import '@jseramn/omai-tokens/themes.css';
import '@jseramn/omai-tokens/base.css';
import '@jseramn/omai/styles.css';
import './banner.css';

function Banner() {
  return (
    <OmaiProvider defaultTheme="catppuccin" storageKey={null}>
      <main className="banner" aria-label="OMAI design system banner">
        <div className="banner__grid" aria-hidden="true" />
        <div className="banner__topline">
          <span className="banner__symbol" aria-hidden="true">▦</span>
          <span>OMAI / DESIGN SYSTEM</span>
          <span className="banner__topline-right">REACT 19&nbsp; · &nbsp;TAILWIND 4&nbsp; · &nbsp;v0.1.0</span>
        </div>

        <section className="banner__copy">
          <div className="banner__eyebrow"><span className="banner__pulse" /> INTERFACE PRIMITIVES FOR AGENTIC TOOLS</div>
          <h1>OMAI<span>.</span></h1>
          <p>Build interfaces with the speed of a terminal and the clarity of a design system.</p>
          <div className="banner__actions">
            <Button variant="primary" size="sm">Explore components <span aria-hidden="true">↗</span></Button>
            <Button variant="outline" size="sm">View themes</Button>
          </div>
          <div className="banner__stats">
            <div><strong>40</strong><span>components</span></div>
            <i aria-hidden="true" />
            <div><strong>16</strong><span>themes</span></div>
            <i aria-hidden="true" />
            <div><strong>0px</strong><span>default radius</span></div>
          </div>
        </section>

        <section className="banner__stage" aria-label="OMAI component preview">
          <div className="banner__back-window" aria-hidden="true">
            <div className="banner__back-bar">THEME TOKENS <span>⌘ T</span></div>
            <div className="banner__swatches"><b /><b /><b /><b /><b /><b /><b /><b /></div>
            <div className="banner__back-lines"><span /><span /><span /></div>
          </div>
          <div className="banner__window">
            <div className="banner__window-bar">
              <span className="banner__window-mark">◆</span>
              <span>WORKSPACE / COMPONENT PREVIEW</span>
              <span className="banner__window-controls">─ &nbsp; □ &nbsp; ×</span>
            </div>
            <div className="banner__window-body">
              <div className="banner__panel-head">
                <div><span className="banner__micro">LIVE PREVIEW</span><h2>Ship the interface.</h2></div>
                <Badge tone="success" variant="soft" size="sm" dot>Ready</Badge>
              </div>
              <div className="banner__panel-columns">
                <div className="banner__component-tile">
                  <span className="banner__micro">ACTIONS</span>
                  <Button variant="primary" size="sm">Run workflow <span aria-hidden="true">↗</span></Button>
                  <div className="banner__tile-bottom"><Badge tone="info" size="sm">React</Badge><Kbd>⌘ K</Kbd></div>
                </div>
                <div className="banner__code-tile">
                  <CodeBlock code={'import { Button } from "@jseramn/omai";\n\n<Button variant="primary">\n  Run workflow\n</Button>'} language="tsx" title="quick-start.tsx" copyable={false} />
                </div>
              </div>
            </div>
          </div>
          <div className="banner__float-card" aria-hidden="true"><span>THEME</span><strong>Catppuccin</strong><div><b /><b /><b /><b /></div></div>
        </section>
        <div className="banner__bottomline"><span>DESIGN TOKENS&nbsp; / &nbsp;COMPONENTS&nbsp; / &nbsp;AGENT UI</span><span>omai.jseramn.tech</span></div>
      </main>
    </OmaiProvider>
  );
}

createRoot(document.getElementById('root')!).render(<Banner />);
