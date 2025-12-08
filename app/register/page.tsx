'use client'
import RegisterForm from '../components/RegisterForm'
import { useRouter } from 'next/navigation';


const Register = () => {
  const router = useRouter();
  const handleBackStep = () => {
    router.push('/');
  }
  return (
    <>
      <RegisterForm backStep={handleBackStep} />
    </>
  )
}

export default Register