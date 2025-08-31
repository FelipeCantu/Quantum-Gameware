// src/components/Cart.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Cart() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal 
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeCart}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Your Shopping Cart</h3>
              <button onClick={closeCart} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-2">
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Your cart is empty</p>
                  <button
                    onClick={closeCart}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="flow-root">
                  <ul className="-my-6 divide-y divide-gray-200">
                    {items.map((item) => (
                      <li key={item._id} className="py-6 flex">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="h-full w-full object-cover object-center"
                          />
                        </div>

                        <div className="ml-4 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>
                                <Link href={`/products/${item.slug}`} onClick={closeCart}>
                                  {item.name}
                                </Link>
                              </h3>
                              <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">${item.price} each</p>
                          </div>
                          <div className="flex-1 flex items-end justify-between text-sm">
                            <div className="flex items-center">
                              <button 
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                className="px-2 py-1 border rounded-l-md"
                              >
                                -
                              </button>
                              <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="px-2 py-1 border rounded-r-md"
                              >
                                +
                              </button>
                            </div>

                            <button 
                              onClick={() => removeFromCart(item._id)}
                              className="font-medium text-red-600 hover:text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {items.length > 0 && (
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <div className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-medium text-gray-900">Total: ${getCartTotal().toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={closeCart}
                    className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                  >
                    Continue Shopping
                  </button>
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-center"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}