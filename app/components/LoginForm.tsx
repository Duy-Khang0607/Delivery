'use client'
import { Leaf, Lock, User, Eye, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react';
import Image from 'next/image';
import googleImage from '@/app/assets/google.jpg'
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { data, status } = useSession();

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await signIn('credentials', { email, password, redirect: false });
            router.push('/');

        } catch (error: any) {
            console.error({ error: error.response.data });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center text-center relative">

            {/* Title */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                }}
                transition={{ duration: 1, delay: 0.3 }}
                className='flex items-center gap-3'
            >
                <h1 className='text-4xl md:text-5xl text-center text-green-700 font-extrabold'>Login</h1>
            </motion.div>
            {/* Decsription */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                }}
                transition={{ duration: 1, delay: 0.3 }}
                className='flex items-center gap-2'
            >
                <p className='text-gray-700 text-lg md:text-md max-w-lg mt-2'>Login to your account.</p>
                <Leaf className='text-green-600 font-bold h-7 w-7 lg:h-5 lg:w-5' />
            </motion.div>
            {/* Form */}
            <motion.form
                className='flex flex-col items-center gap-6 w-full max-w-md p-4 rounded-lg'
                onSubmit={handleLogin}
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                }}
                transition={{ duration: 1, delay: 0.3 }}
            >
                <div className='relative w-full flex flex-col gap-3'>
                    <User className='w-5 h-5 text-gray-500 absolute top-3.5 left-2.5' />
                    <input type="email" placeholder='Your email' className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 transition-all duration-300' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='relative w-full flex flex-col gap-3'>
                    <Lock className='w-5 h-5 text-gray-500 absolute top-3.5 left-2.5' />
                    <input type={showPassword ? "text" : "password"} placeholder='Your password' className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 transition-all duration-300' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Eye className='w-5 h-5 text-gray-500 absolute top-3.5 right-2.5' onClick={handleShowPassword} />
                </div>

                {/* Button Login */}
                <motion.button type='submit' className={`${email.length > 0 && password.length > 0 ? 'bg-green-600' : 'bg-gray-500'} text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all duration-300 cursor-pointer mt-2 w-full flex items-center justify-center`}>
                    {loading ? <Loader2 className='w-5 h-5 text-white animate-spin' /> : 'Login'}
                </motion.button>
                {/* OR */}
                <div className='flex items-center gap-1 text-gray-400 w-full'>
                    <span className='flex-1 h-px bg-gray-300'></span>
                    OR
                    <span className='flex-1 h-px bg-gray-300'></span>
                </div>
                {/* Google */}
                <motion.button type='button' className={`bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition-all duration-300 cursor-pointer mt-2 w-full flex items-center gap-2 justify-center`} onClick={(e) => { e.preventDefault(); signIn('google', { callbackUrl: '/' }); }}>
                    <Image src={googleImage} alt='Google' width={20} height={20} />
                    <span className='text-gray-700 font-bold text-sm md:text-base'>Continue with Google</span>
                </motion.button>
                {/* Don't have an account? */}
                <div className='flex items-center gap-1 text-gray-400 w-full justify-center'>
                    <span className='text-black text-sm md:text-[14px]'>Don't have an account ?</span>
                    <Link href='/register' className='text-green-600 font-bold text-sm md:text-[14px] hover:text-green-700 transition-all duration-300'>Register</Link>
                </div>
            </motion.form>
        </div>
    );
};

export default LoginForm;