// src/app/membership/page.tsx: the rewards program (DESIGN.md, "Forms and account"). Tiers, rates and
// redemption values come from the previous version of this page. Fixed: it rendered a second <main>
// and a second footer inside the layout's; the unverified "thousands of gamers" line is gone.
'use client';

import Link from 'next/link';
import PageHead from '@/components/ui/PageHead';
import AccountNav from '@/components/ui/AccountNav';

const tiers = [
  { name: 'Bronze', requirement: 'Join for free', rate: '1', benefits: ['Birthday rewards', 'Member-only sales', 'Early access to new products'] },
  { name: 'Silver', requirement: '$500+ a year', rate: '1.5', benefits: ['All Bronze benefits', 'Free standard shipping', 'Priority customer support', '5% off all purchases'] },
  { name: 'Gold', requirement: '$1,500+ a year', rate: '2', benefits: ['All Silver benefits', 'Free express shipping', 'Dedicated VIP support', '10% off all purchases', 'Gold member gifts'] },
  { name: 'Platinum', requirement: '$3,000+ a year', rate: '3', benefits: ['All Gold benefits', 'Free overnight shipping', 'Personal gaming consultant', '15% off all purchases', 'Platinum events and previews', 'Personalized recommendations'] },
];

const redeem = [
  { points: '100', value: '$5' },
  { points: '500', value: '$25' },
  { points: '1,000', value: '$50' },
  { points: '2,000', value: '$100' },
];

const faq = [
  { q: 'How do I join the rewards program?', a: "Create an account and you're enrolled as a Bronze member. You start earning points with your first purchase." },
  { q: 'How do I level up to higher tiers?', a: "Tiers follow your spending over a rolling 12 months. Once you pass a threshold, you're upgraded automatically." },
  { q: 'Do my points expire?', a: 'No. Points never expire as long as your account remains active.' },
  { q: 'Can I combine tier discounts with reward points?', a: 'Yes. You can use reward points together with your tier discount on the same order.' },
];

export default function MembershipPage() {
  return (
    <>
      <div className="acct-head">
        <PageHead
          title="Membership"
          text="Earn points on every order. 100 points take $5 off the next one."
          crumbs={[{ label: 'Home', href: '/' }, { label: 'Account', href: '/account' }, { label: 'Membership' }]}
        />
      </div>
      <AccountNav />

      <section className="band band--split" aria-labelledby="mem-how">
        <div className="band__head">
          <h2 id="mem-how" className="band__title">How it works</h2>
        </div>
        <ol className="steps">
          <li>
            <span className="steps__t">Shop and earn</span>
            <span className="steps__d">Earn points on every purchase. Higher tiers earn more points per dollar.</span>
          </li>
          <li>
            <span className="steps__t">Redeem</span>
            <span className="steps__d">Use points for discounts. 100 points take $5 off your next order.</span>
          </li>
          <li>
            <span className="steps__t">Level up</span>
            <span className="steps__d">Spend more over a year to unlock higher tiers with better benefits.</span>
          </li>
        </ol>
      </section>

      <section className="band" aria-labelledby="mem-tiers">
        <div className="band__head">
          <h2 id="mem-tiers" className="band__title">Tiers</h2>
        </div>
        <div className="tiers">
          {tiers.map((t, i) => (
            <article key={t.name} className="tier" style={{ ['--i' as string]: i }}>
              <header className="tier__head">
                <h3 className="tier__name">{t.name}</h3>
                <p className="tier__req">{t.requirement}</p>
              </header>
              <p className="tier__rate"><span className="mono">{t.rate}</span> <span>point{t.rate === '1' ? '' : 's'} per $1</span></p>
              <ul className="ticks">
                {t.benefits.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="band band--split" aria-labelledby="mem-redeem">
        <div className="band__head">
          <h2 id="mem-redeem" className="band__title">What points are worth</h2>
          <p className="band__text">Points never expire while your account is active.</p>
        </div>
        <div className="table-wrap">
          <table className="table" style={{ minWidth: 0 }}>
            <thead><tr><th scope="col">Points</th><th scope="col">Off your order</th></tr></thead>
            <tbody>
              {redeem.map((r) => (
                <tr key={r.points}><td className="num">{r.points}</td><td className="num">{r.value}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="band band--split" aria-labelledby="mem-faq">
        <div className="band__head">
          <h2 id="mem-faq" className="band__title">Membership questions</h2>
          <div className="closer__links" style={{ marginTop: '0.5rem' }}>
            <Link href="/auth/signup" className="btn btn--solid">
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">Join free</span>
            </Link>
            <Link href="/account" className="btn btn--line">
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">See my points</span>
            </Link>
          </div>
        </div>
        <div className="qa">
          {faq.map((f) => (
            <details key={f.q} className="qa__item">
              <summary className="qa__q">{f.q}</summary>
              <p className="qa__a">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
