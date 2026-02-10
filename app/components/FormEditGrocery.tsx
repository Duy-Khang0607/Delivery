'use client'
import React, { ChangeEvent, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgePlus, Edit, Loader2, Upload } from 'lucide-react'
import { useToast } from './Toast'
import axios from 'axios'
import Image from 'next/image'
import PopupImage from '../HOC/PopupImage'
import { IGrocery } from '../models/grocery.model'


interface FormGroceryProps {
    isEdit: boolean,
    title: string,
    description: string,
    setEdit: React.Dispatch<React.SetStateAction<boolean>>,
    editItem: IGrocery | null,
    fetchGrocery: () => void
}


const FormEditGrocery = ({ isEdit, title, description, setEdit, editItem, fetchGrocery }: FormGroceryProps) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingImage, setLoadingImage] = useState<boolean>(false)
    const [backendImage, setBackendImage] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>()
    const disableAdd = editItem?.name.toString() && editItem?.category.toString() && (editItem?.unit?.toString() || '') && editItem?.price.toString();
    const [open, setOpen] = useState(false);
    const { showToast } = useToast();
    const [name, setName] = useState<string>(editItem?.name.toString() || '')
    const [category, setCategory] = useState<string>(editItem?.category.toString() || '')
    const [unit, setUnit] = useState<string>(editItem?.unit?.toString() || '')
    const [price, setPrice] = useState<string>(editItem?.price.toString() || '')


    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setLoadingImage(true)
        try {
            const file = e?.target.files;
            if (!file || file.length == 0) return
            const filterFile = file[0];
            setBackendImage(filterFile)
            setPreview(URL.createObjectURL(filterFile))
            setLoadingImage(false)
        } catch (error) {
            console.error({ error })
            setLoadingImage(false)
        }
    }

    const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('_id', editItem?._id?.toString() || '')
            formData.append('name', name)
            formData.append('category', category)
            formData.append('unit', unit)
            formData.append('price', price)
            if (backendImage) formData.append('image', backendImage)
            const response: any = await axios.put('/api/auth/admin/update-grocery', formData)
            if (response?.data?.success) {
                showToast(response?.data?.message, "success");
                setEdit(false)
                await fetchGrocery()
            } else {
                showToast(response?.data?.message, "error");
                setEdit(false)
            }
            setLoading(false)
        } catch (error) {
            console.error({ error })
            setLoading(false)
            showToast('System error', "error");
            setEdit(false)
        }
    }


    return (
        <div
            className="fixed inset-0 z-999 flex items-center justify-center bg-black/70 "
            onClick={() => setEdit(false)}
        >
            <motion.div
                className="relative max-w-[50vw] max-h-[50vh] cursor-pointer rounded-2xl bg-white shadow-2xl p-5 border border-green-200"
                initial={{ scale: 0.92, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
            >

                {/* Form */}
                <form className='flex flex-col gap-3' >

                    <div className='flex flex-col items-center text-center gap-3 mb-8'>
                        <div className='flex flex-row items-center gap-2 tracking-wide text-xl font-semibold'>
                            {isEdit ? <Edit className='w-5 h-5 text-green-700' /> : <BadgePlus className='w-5 h-5 text-green-700' />}
                            {title}
                        </div>
                        <p className='text-sm max-w-sm md:max-w-xl'>{description}</p>
                    </div>

                    {/* Grocry name */}
                    <div className='relative w-full flex flex-col gap-2'>
                        <label className='text-base font-semibold'>Grocery Name <span className='text-red-500'>*</span></label>
                        <input required type="email" placeholder='Grocery name' className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300' value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    {/* Category - Unit */}
                    <div className='relative w-full flex flex-row gap-3 items-center justify-between'>
                        {/* Category */}
                        <div className='w-full flex flex-col gap-2'>
                            <label className='text-base font-semibold'>Category <span className='text-red-500'>*</span></label>
                            <input required type="text" placeholder='Category' className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300' value={category} onChange={(e) => setCategory(e.target.value)} />

                        </div>
                        {/* Unit */}
                        <div className='w-full flex flex-col gap-2'>
                            <label className='text-base font-semibold'>Unit <span className='text-red-500'>*</span></label>
                            <input required type="text" placeholder='Unit' className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300' value={unit} onChange={(e) => setUnit(e.target.value)} />
                        </div>
                    </div>

                    {/* Price */}
                    <div className='relative w-full flex flex-col gap-2'>
                        <label className='text-base font-semibold'>Price <span className='text-red-500'>*</span></label>
                        <input required type="number" placeholder='$' className='w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300' value={price} onChange={(e) => setPrice(e.target.value)} />
                    </div>

                    {/* Button upload image */}
                    <div className='relative w-full md:max-w-[160px] flex flex-row gap-3 text-green-700 items-center'>
                        <Upload className='w-5 h-5 absolute top-10 left-2.5' />
                        <label
                            htmlFor="file-upload"
                            className="w-[160px] shrink-0 flex-none p-3 h-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 pl-10 transition-all duration-300 cursor-pointer" onClick={(e) => e.stopPropagation()}
                        >
                            Upload image
                        </label>
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleFileChange}
                            accept='image/*'
                        />
                        {editItem?.image?.[0] || preview ? (
                            loadingImage ? (
                                <div className='w-full'>
                                    <Loader2 className='w-20 h-10 animate-spin' />
                                </div>
                            ) : (
                                <Image
                                    onClick={() => setOpen(true)}
                                    src={preview ? preview : editItem?.image?.[0] || ''}
                                    width={100}
                                    height={100}
                                    alt="Image upload"
                                    className="object-cover bg-white border-gray-300 border shadow-2xl rounded-2xl cursor-pointer hover:border-gray-500 transition-all duration-200 w-[100px] h-[100px]"
                                />
                            )
                        ) : null}

                        {/* Popup image */}
                        <AnimatePresence>
                            {open && (editItem?.image?.[0] || preview) && (
                                <PopupImage image={preview ? preview : editItem?.image?.[0] || ''} setOpen={setOpen} />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Button Add grocery */}
                    <motion.button disabled={!disableAdd || loading} onClick={handleUpdate} type="submit" className={`${disableAdd ? 'bg-green-500 hover:bg-green-400' : 'bg-gray-300'} rounded-md mt-5  cursor-pointer transition-all text-center p-2 text-white flex justify-center`}>{loading ? <Loader2 className='w-5 h-5 animate-spin' /> : 'Update Grocery'}</motion.button>

                </form>
            </motion.div>
        </div>
    )
}

export default FormEditGrocery