'use client';
import Link from "next/link";
import Image from "next/image";
import {useEffect, useState} from "react";
import {signIn, signOut, getProviders, useSession} from 'next-auth/react';

const Navbar = () => {
    const {data: session} = useSession();
    const [providers, setProviders] = useState(null);
    const [toggleDropdown, setToggleDropdown] = useState(false);
    useEffect(() => {
        const setProvider = async () => {
            const response = await getProviders();
            setProviders(response);
        };
        setProvider();
    }, []);

    return (
        <nav className="flex-between w-full mb-16 pt-3">
            <Link href='/' className="flex gap-2 flex-center">
                <Image src='/assets/images/logo.svg' width={30} height={30} alt="promptopia Logo" className="object-contain" />
            </Link>
            {/* Desktop Navigation */}
            <div className="sm:flex hidden">
                {session?.user ? (
                    <div className="flex gap-3 md:gap-5">
                        <Link href='/create-prompt' className="black_btn">Create Post</Link>
                        <button type="button" onClick={signOut} className="outline_btn">SignOut</button>
                        <Link href='/profile'>
                            <Image src={session?.user.image} width={37} height={37} className="rounded-full" alt='profile' />
                        </Link>
                    </div>
                ) : (
                    <>
                        {
                            providers &&
                            Object.values(providers).map((provider) => (
                                <button
                                    type="button"
                                    className="black_btn"
                                    key={provider.name}
                                    onClick={() => signIn(provider.id)}
                                >Sign In</button>
                            ))
                        }
                    </>
                )}
            </div>
            {/* Mobile Navigation */}
            <div className="sm:hidden flex relative">
                {
                    session?.user
                        ? (
                            <div className="flex">
                                <Image src={session?.user.image}
                                    width={37}
                                    height={37}
                                    className="rounded-full"
                                    alt='profile'
                                    onClick={() => setToggleDropdown((prev) => !prev)}
                                />
                                {toggleDropdown && (
                                    <div className="dropdown text-center">
                                        <Link
                                            href='/profile'
                                            className="dropdown_link w-full"
                                            onClick={() => setToggleDropdown(false)}
                                        >My Profile</Link>
                                        <Link
                                            href='/create-prompt'
                                            className="dropdown_link w-full"
                                            onClick={() => setToggleDropdown(false)}
                                        >Create Prompt</Link>
                                        <button className="mt-5 w-full black_btn" onClick={() => {
                                            setToggleDropdown(false);
                                            signOut();
                                        }}>
                                            SignOut
                                        </button>
                                    </div>
                                )}
                            </div>

                        ) : (
                            <>
                                {
                                    providers &&
                                    Object.values(providers).map((provider) => (
                                        <button
                                            type="button"
                                            className="black_btn"
                                            key={provider.name}
                                            onClick={() => signIn(provider.id)}
                                        >SignIn</button>
                                    ))
                                }
                            </>
                        )
                }
            </div>
        </nav >
    );
};

export default Navbar;