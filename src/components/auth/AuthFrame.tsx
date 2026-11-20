// src/components/auth/AuthFrame.tsx: the frame every auth page shares (DESIGN.md, "Forms and
// account"). An ink slate holds the title in superposition and a readout of the form's state; the
// form sits beside it. The title's ghosts are keyed on the state, so each change (checking, an
// error, done) re-excites them and they collapse again. CSS in styles/forms.css.
import { site } from '@/data/site';

export type AuthState = 'idle' | 'busy' | 'error' | 'done';

const stateLabel: Record<AuthState, string> = {
  idle: 'Waiting for you',
  busy: 'Checking',
  error: 'Needs a fix',
  done: 'Confirmed',
};

export default function AuthFrame({
  kicker,
  title,
  text,
  state = 'idle',
  steps,
  children,
}: {
  kicker: string;
  title: string;
  text: string;
  state?: AuthState;
  steps?: { label: string; current?: boolean }[];
  children: React.ReactNode;
}) {
  return (
    <div className="auth">
      <section className="auth__slate" aria-labelledby="auth-title">
        <p className="auth__kicker">{kicker}</p>
        <div>
          <div className="auth__title">
            {/* Ghost text is generated content (forms.css), so it is not text to assistive tech or audits. */}
            <span key={`q-${state}`} className="auth__ghost auth__ghost--q" data-text={title} aria-hidden="true" />
            <span key={`g-${state}`} className="auth__ghost auth__ghost--g" data-text={title} aria-hidden="true" />
            <h1 id="auth-title">{title}</h1>
          </div>
          <p className="auth__text">{text}</p>
        </div>
        <div style={{ display: 'grid', gap: 'calc(var(--u) * 2.5)' }}>
          {steps && (
            <ol className="auth__steps" aria-label="Steps">
              {steps.map((s) => (
                <li key={s.label} aria-current={s.current ? 'step' : undefined}>{s.label}</li>
              ))}
            </ol>
          )}
          <dl className="auth__facts">
            <div>
              <dt>Status</dt>
              <dd><span className="auth__state" data-state={state} role="status">{stateLabel[state]}</span></dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd>{site.shippingLine}</dd>
            </div>
            <div>
              <dt>Need a hand</dt>
              <dd><a href={site.phone.href}>{site.phone.label}</a></dd>
            </div>
          </dl>
        </div>
      </section>
      <div className="auth__body">
        <div className="auth__panel">{children}</div>
      </div>
    </div>
  );
}
