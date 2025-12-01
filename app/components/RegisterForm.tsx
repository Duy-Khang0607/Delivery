'use client'
import { Leaf, Mail, Lock, User, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react';

const RegisterForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }
    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(name, email, password);
    }
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center text-center">
            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{
                    opacity: 1,
                    y: -20,
                }}
                transition={{ duration: 1, delay: 0.3 }}
                className='flex items-center gap-3'
            >
                <h1 className='text-4xl md:text-5xl text-center text-green-700 font-extrabold'>Create Account</h1>
            </motion.div>
            {/* Decsription */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{
                    opacity: 1,
                    y: -10,
                }}
                transition={{ duration: 1, delay: 0.9 }}
                className='flex items-center gap-3'
            >
                <p className='text-gray-700 text-lg md:text-xl max-w-lg mt-2'>Join Delivery today.</p>
                <Leaf className='text-green-600 font-bold h-7 w-7' />
            </motion.div>
            {/* Form */}
            <motion.form
                className='flex flex-col items-center gap-6 w-full max-w-md p-4 bg-white rounded-lg shadow-md'
                onSubmit={handleRegister}
            >
                <div className='relative w-full flex flex-col gap-3'>
                    <User className='w-5 h-5 text-gray-500 absolute top-3.5 left-2.5' />
                    <input type="text" placeholder='Your name' className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 pl-10' value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className='relative w-full flex flex-col gap-3'>
                    <Mail className='w-5 h-5 text-gray-500 absolute top-3.5 left-2.5' />
                    <input type="email" placeholder='Your email' className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 pl-10' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='relative w-full flex flex-col gap-3'>
                    <Lock className='w-5 h-5 text-gray-500 absolute top-3.5 left-2.5' />
                    <input type={showPassword ? "text" : "password"} placeholder='Your password' className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 pl-10' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Eye className='w-5 h-5 text-gray-500 absolute top-3.5 right-2.5' onClick={handleShowPassword} />
                </div>

                {/* Button Register */}
                <motion.button type='submit' className={`${name.length > 0 && email.length > 0 && password.length > 0 ? 'bg-green-600' : 'bg-gray-500'} text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all duration-300 cursor-pointer mt-2`}>
                    Register
                </motion.button>
            </motion.form>

        </div>
    )
}

export default RegisterForm