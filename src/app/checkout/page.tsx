// src/app/checkout/page.tsx: an old, unlinked copy of checkout whose success step pointed at a page
// that does not exist (/checkout/success). The real flow is /cart -> /cart/checkout -> success, so this
// route now sends anyone who lands here (old bookmarks, typed URLs) to it.
import { redirect } from 'next/navigation';

export default function CheckoutRedirect() {
  redirect('/cart/checkout');
}
