'use client'

import Wellcome from './components/Wellcome'
import RegisterForm from './components/RegisterForm';
import { useState } from 'react';

const Page = () => {
  const [step, setStep] = useState('welcome');

  return (
    <>
      {step === 'welcome' ? <Wellcome nextStep={setStep} /> : <RegisterForm />}
    </>
  )
}

export default Page