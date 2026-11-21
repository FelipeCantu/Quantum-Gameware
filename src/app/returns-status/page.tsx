// File: src/app/returns-status/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import Link from 'next/link';
import PageHead from '@/components/ui/PageHead';
import AccountNav from '@/components/ui/AccountNav';
import { LinePlate } from '@/components/commerce/Shop';
import { ReturnService, ReturnRequest } from '@/services/returnService';

function ReturnsStatusContent() {
  const { user } = useAuth();
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load returns from localStorage
    const loadReturns = () => {
      const allReturns = ReturnService.getReturns();
      setReturns(allReturns);
      setLoading(false);
    };

    loadReturns();
  }, []);

  const getStatusProgress = (status: string): number => {
    const progressMap: Record<string, number> = {
      'requested': 20,
      'approved': 40,
      'received': 60,
      'inspecting': 80,
      'completed': 100,
      'rejected': 100,
      'cancelled': 100
    };
    return progressMap[status] || 0;
  };

  const head = (
    <>
      <div className="acct-head">
        <PageHead
          still
          title="Returns"
          text="Every return you started, where it is, and what comes back to you."
          meta={user ? `Signed in as ${user.email}` : undefined}
          crumbs={[{ label: 'Home', href: '/' }, { label: 'Account', href: '/account' }, { label: 'Returns' }]}
        />
      </div>
      <AccountNav />
    </>
  );

  if (loading) {
    return (
      <>
        {head}
        <div className="dash"><p className="field__hint" aria-busy="true">Loading your returns…</p></div>
      </>
    );
  }

  const STAGES = ['Requested', 'Approved', 'Received', 'Inspecting', 'Refunded'];
  const ended = (s: string) => s === 'rejected' || s === 'cancelled';

  return (
    <>
      {head}
      <div className="dash">
        {returns.length === 0 ? (
          <div className="dash-empty">
            <p>No returns yet. To send something back, open the order and choose Request a return.</p>
            <div className="dash-sec__actions">
              <Link href="/orders" className="btn btn--solid">
                <span className="btn__fill" aria-hidden="true" />
                <span className="btn__label">Your orders</span>
              </Link>
              <Link href="/returns" className="btn btn--line">
                <span className="btn__fill" aria-hidden="true" />
                <span className="btn__label">Return policy</span>
              </Link>
            </div>
          </div>
        ) : (
          <ul className="order-cards">
            {returns.map((returnReq) => {
              const progress = getStatusProgress(returnReq.status);
              const stage = Math.round(progress / 20); // 1..5
              return (
                <li key={returnReq.id} className="order-card">
                  <div className="order-card__head">
                    <div>
                      <h2 className="order-card__no mono">{returnReq.id}</h2>
                      <p className="order-card__date">
                        Order <span className="mono">{returnReq.orderNumber}</span> · requested {new Date(returnReq.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <span className={`status ${ended(returnReq.status) ? 'status--cancelled' : returnReq.status === 'completed' ? 'status--delivered' : 'status--processing'}`}>
                      {ReturnService.getStatusLabel(returnReq.status)}
                    </span>
                    <p className="order-card__total mono">{`$${returnReq.refundAmount.toFixed(2)}`}</p>
                  </div>

                  {!ended(returnReq.status) && (
                    <ol className="steps-strip ret-stages" aria-label="Return progress">
                      {STAGES.map((label, i) => (
                        <li key={label} aria-current={i + 1 === stage ? 'step' : undefined} data-done={i + 1 < stage || (stage === 5 && i === 4) ? '' : undefined}>{label}</li>
                      ))}
                    </ol>
                  )}

                  <dl className="stats">
                    <div className="stats__cell">
                      <dt className="stats__k">Reason</dt>
                      <dd className="stats__note" style={{ color: 'var(--c-fg)', fontSize: 'var(--t-body)' }}>{ReturnService.getReturnReasonLabel(returnReq.reason)}</dd>
                      {returnReq.reasonDetails && <dd className="stats__note">{returnReq.reasonDetails}</dd>}
                    </div>
                    <div className="stats__cell">
                      <dt className="stats__k">Refund</dt>
                      <dd className="stats__v mono" style={{ fontSize: 'var(--t-m)' }}>{`$${returnReq.refundAmount.toFixed(2)}`}</dd>
                      <dd className="stats__note">To your original payment method</dd>
                    </div>
                    {returnReq.trackingNumber && (
                      <div className="stats__cell">
                        <dt className="stats__k">Return tracking</dt>
                        <dd className="stats__v mono" style={{ fontSize: 'var(--t-s)', overflowWrap: 'anywhere' }}>{returnReq.trackingNumber}</dd>
                      </div>
                    )}
                  </dl>

                  <div className="order-card__detail">
                    <div>
                      <h3 className="field__label" style={{ marginBottom: '0.5rem' }}>Items coming back</h3>
                      <ul className="lines">
                        {returnReq.items.map((item, index) => (
                          <li key={index} className="line line--compact">
                            <LinePlate image={item.image} name={item.name} />
                            <div>
                              <p className="line__name">{item.name}</p>
                              <p className="line__meta"><span className="mono">{item.returnQuantity}</span> × <span className="mono">{`$${item.price.toFixed(2)}`}</span></p>
                            </div>
                            <p className="line__total">{`$${(item.price * item.returnQuantity).toFixed(2)}`}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="field__label" style={{ marginBottom: '0.5rem' }}>History</h3>
                      <ol className="timeline">
                        {returnReq.statusHistory.map((history, index) => (
                          <li key={index} className="timeline__item">
                            <p className="timeline__what">{ReturnService.getStatusLabel(history.status)}</p>
                            <p className="timeline__when mono">{new Date(history.timestamp).toLocaleString()}</p>
                            {history.note && <p className="timeline__note">{history.note}</p>}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="dash-sec">
          <div className="dash-sec__head"><h2 className="dash-sec__title">Help with a return</h2></div>
          <ul className="rows">
            {[
              { t: 'Return policy', href: '/returns' },
              { t: 'Write to us about a return', href: '/contact' },
            ].map((r) => (
              <li key={r.href}>
                <Link href={r.href}>
                  <span className="rows__t" style={{ fontSize: 'var(--t-body)' }}>{r.t}</span>
                  <span className="rows__go" aria-hidden="true">{r.href}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default function ReturnsStatusPage() {
  return (
    <AuthGuard requireAuth={true}>
      <ReturnsStatusContent />
    </AuthGuard>
  );
}
