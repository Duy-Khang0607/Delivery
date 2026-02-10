'use client'
import { ArrowRight, Loader2, Truck, User, UserCog } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const EditRoleModile = () => {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [mobile, setMobile] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { update } = useSession();
    const [roles, setRoles] = useState([
        {
            id: 'admin',
            name: 'Admin',
            icon: <UserCog className='w-7 h-7 md:w-10 md:h-10 font-bold' />
        },
        {
            id: 'user',
            name: 'User',
            icon: <User className='w-7 h-7 md:w-10 md:h-10 font-bold' />
        },
        {
            id: 'deliveryBoy',
            name: 'Delivery Boy',
            icon: <Truck className='w-7 h-7 md:w-10 md:h-10 font-bold' />
        }
    ])


    const handleSubmit = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/auth/user/edit-role-mobile', {
                role: selectedRole,
                mobile
            });
            await update({ role: selectedRole });
            router.push('/');
        } catch (error) {
            console.error({ error });
        } finally {
            setLoading(false);
        }
    }

    const checkForAdmin = async () => {
        try {
            const response = await axios.get('/api/check-for-admin');
            if (response.data.adminExists) {
                setRoles(prev => prev.filter(role => role.id !== 'admin'));
                // setSelectedRole('admin');
            }
        } catch (error) {
            console.error({ error });
        }
    }

    useEffect(() => {
        checkForAdmin();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{
                opacity: 1,
            }}
            transition={{ duration: 1, delay: 0.3 }}
            className='w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-6'
        >
            {/* Title */}
            <div className='w-full max-w-md p-4 rounded-lg text-center w-full'>
                <h1 className='text-4xl font-extrabold text-green-700 md:text-3xl'>Select Your Role</h1>
            </div>

            {/* Role List */}
            <div className='flex flex-col md:flex-row items-center justify-center gap-4 mt-4 md:gap-8 w-full h-full md:h-auto'>
                {roles?.map((role) => (
                    <div key={role.id} className={`flex flex-col items-center justify-center gap-2 shadow-md rounded-lg w-full h-full md:max-w-100 md:max-h-100 p-10 cursor-pointer hover:bg-green-50 hover:text-green-500 transition-all duration-300 border-1 border-gray-200 ${selectedRole === role.id ? 'bg-green-50 border-green-500 text-green-500' : 'bg-white'}`} onClick={() => setSelectedRole(role.id)}>
                        {role.icon}
                        <p className='font-bold'>{role.name}</p>
                    </div>
                ))}
            </div>

            {/*Enter mobile number*/}
            <div className='mt-6 w-full md:max-w-100'>
                <label htmlFor="mobile" className='text-md ml-1 md:text-center'>Enter your mobile number</label>
                <input type="number" id="mobile" placeholder='0999.....' className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500  transition-all duration-300 mt-2' value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </div>

            {/* Button go to home */}
            <div className='mt-6'>
                <motion.button onClick={handleSubmit} disabled={!mobile || mobile.toString().length < 0 || !selectedRole || loading} type='button' className={`text-white px-4 py-2 rounded-md transition-all duration-300 cursor-pointer mt-2 w-full flex items-center justify-center ${mobile && mobile.toString().length > 0 && selectedRole ? 'bg-green-700' : 'bg-gray-500'}`}><ArrowRight className='w-5 h-5 text-white mr-2' />Go to Home</motion.button>
                {loading && <Loader2 className='w-5 h-5 text-white mr-2 animate-spin' />}
            </div>
        </motion.div>
    )
}

export default EditRoleModile