import { CommandLineIcon, IdentificationIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import backgroundImage from '@public/images/bg_space.webp';
import cat from '@public/images/kkori_the_cutest.png';

export default function MenuButton() {
    return (
        <div className="fixed z-50 flex justify-end print:hidden top-14 right-14">
            <Menu>
                {({ open }) => (
                    <>
                        <Menu.Button className="fixed">
                            <div className="relative rounded-full shadow-2xl shadow-slate-700"
                                style={{ backgroundImage: `url('${backgroundImage.src}')` }}
                            >
                                <Image
                                    className="translate-y-2 animate-bounce w-14 h-14"
                                    src={cat}
                                    alt="우리집 가족구성원 고양이 꼬리입니다."
                                />
                                <span
                                    className="animate-ping bottom-0 left-11 absolute w-3.5 h-3.5 bg-sky-400 border-2 border-white dark:border-gray-800 rounded-full"
                                ></span>
                            </div>
                        </Menu.Button>
                        {/* Use the `Transition` component. */}
                        <Transition
                            show={open}
                            className="fixed right-20 top-20"
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            {/* Mark this component as `static` */}
                            <Menu.Items static className="rounded-md shadow-md bg-slate-50">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${active ? 'bg-slate-500 text-white' : 'text-gray-900'
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        >
                                            <PrinterIcon
                                                className="w-5 h-5 mr-2 stroke-2 ui-active:fill-slate-500 fill-slate-100 ui-active:stroke-slate-300 stroke-400"
                                                aria-hidden="true"
                                            />
                                            <Link href="#" onClick={() => window.print()}>프린트하기</Link>
                                        </button>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${active ? 'bg-slate-500 text-white' : 'text-gray-900'
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        >
                                            <CommandLineIcon
                                                className="w-5 h-5 mr-2 stroke-2 ui-active:fill-slate-500 fill-slate-100 ui-active:stroke-slate-300 stroke-400"
                                                aria-hidden="true"
                                            />
                                            <Link href="/repos">포트폴리오</Link>
                                        </button>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${active ? 'bg-slate-500 text-white' : 'text-gray-900'
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        >
                                            <IdentificationIcon
                                                className="w-5 h-5 mr-2 stroke-2 ui-active:fill-slate-500 fill-slate-100 ui-active:stroke-slate-300 stroke-400"
                                                aria-hidden="true"
                                            />
                                            <Link href="https://github.com/AndrewDongminYoo">프로필</Link>
                                        </button>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Transition>
                    </>
                )}
            </Menu>
        </div>
    );
}