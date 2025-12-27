'use client'
import { motion } from 'framer-motion'
import Image from 'next/image';

interface PopupImageProps {
    image: string,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const PopupImage = ({ image, setOpen }: PopupImageProps) => {

    return (
        <div
            className="fixed inset-0 z-999 flex items-center justify-center bg-black/70"
            onClick={() => setOpen(false)}
        >
            <motion.div
                className="relative max-w-[90vw] max-h-[90vh] cursor-pointer"
                initial={{ scale: 0.92, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={image}
                    alt="full"
                    width={1200}
                    height={800}
                    className="max-w-[80vw] max-h-[80vh] object-cover rounded-xl"
                />
            </motion.div>
        </div>
    )
}

export default PopupImage