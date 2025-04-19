"use client";

import { useState, useContext } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CartContext } from "./providers/cartProvider";
import Image from "next/image";
import { useRouter } from "next/navigation";

const noImage =
  "https://fakeimg.pl/96x96/c2c2c2/808080?text=Sin+Imagen&font=bebas";

export default function Cart() {
  const { cart, dispatch } = useContext(CartContext);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const handlePay = async () => {
    router.push(`/pay`);
  };

  return (
    <div className="w-fit p-3">
      <div
        className="flex flex-row-reverse justify-center relative"
        onClick={() => setOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6 hover:opacity-90 transition-all"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 5H19M7 13l-4-8H3"
          />
        </svg>
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {cart.total}
        </span>
      </div>
      <Transition show={open}>
        <Dialog className="relative z-50" onClose={setOpen}>
          <TransitionChild
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <TransitionChild
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-gray-900 shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <DialogTitle className="text-lg font-medium text-gray-100">
                            Carrito
                          </DialogTitle>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative -m-2 p-2 text-gray-400 hover:text-gray-300"
                              onClick={() => setOpen(false)}
                            >
                              <span className="absolute -inset-0.5" />
                              <span className="sr-only">Cerrar Panel</span>
                              <XMarkIcon
                                width={24}
                                height={24}
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>

                        <div className="mt-8">
                          <div className="flow-root">
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-gray-700"
                            >
                              {cart.items.map((product) => (
                                <li key={product._id} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-600">
                                    <Image
                                      quality={85}
                                      width={96}
                                      height={96}
                                      src={product.images[0] ?? noImage}
                                      alt={product.name}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-100">
                                        <h3>{product.name}</h3>
                                        <p className="ml-4">{`$ ${product.price}`}</p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                                        {product.description}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <p className="text-gray-400">
                                        Cantidad: 1
                                      </p>

                                      <div className="flex">
                                        <button
                                          onClick={() => {
                                            dispatch({
                                              type: "REMOVE_PRODUCT",
                                              payload: product,
                                            });
                                          }}
                                          type="button"
                                          className="font-medium text-red-500 hover:text-red-400"
                                        >
                                          Quitar
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-700 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-100">
                          <p>Total</p>
                          <p>
                            ${" "}
                            {cart.items?.reduce(
                              (acc, obj) => acc + obj.price,
                              0
                            )}
                          </p>
                        </div>

                        <div className="mt-6">
                          <button
                            disabled={!cart.items.length}
                            onClick={handlePay}
                            className="flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-slate-400 disabled:bg-opacity-80 disabled:cursor-not-allowed"
                          >
                            Completar Pago
                          </button>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-400">
                          <p>
                            <button
                              type="button"
                              className="font-medium text-blue-500 hover:text-blue-400"
                              onClick={() => setOpen(false)}
                            >
                              Seguir Navegando
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
