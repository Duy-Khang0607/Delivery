'use client'
import { motion } from 'framer-motion'
import { Apple, ArrowBigLeft, ArrowBigRight, Beef, Fish, Leaf, Milk, Sandwich, ShoppingCart, Baby, IceCreamBowl, Droplet, Flame, PawPrint, HeartPulse, Home, SprayCan, User, Cookie, CupSoda, GlassWater, Candy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react';



const categories = [
    { id: 1, name: "Fresh Food", icon: Leaf, color: "bg-green-100 text-green-700" },
    { id: 2, name: "Vegetables", icon: Leaf, color: "bg-green-100 text-green-700" },
    { id: 3, name: "Fruits", icon: Apple, color: "bg-red-100 text-red-700" },
    { id: 4, name: "Meat", icon: Beef, color: "bg-rose-100 text-rose-700" },
    { id: 5, name: "Seafood", icon: Fish, color: "bg-blue-100 text-blue-700" },
    { id: 6, name: "Eggs & Dairy", icon: Milk, color: "bg-yellow-100 text-yellow-700" },
    { id: 7, name: "Frozen Food", icon: Sandwich, color: "bg-orange-100 text-orange-700" },
    { id: 8, name: "Rice & Noodles", icon: IceCreamBowl, color: "bg-purple-100 text-purple-700" },
    { id: 9, name: "Cooking Oil & Spices", icon: Flame, color: "bg-purple-100 text-purple-700" },
    { id: 10, name: "Sauces & Condiments", icon: Droplet, color: "bg-purple-100 text-purple-700" },
    { id: 11, name: "Canned Food", icon: SprayCan, color: "bg-purple-100 text-purple-700" },
    { id: 12, name: "Snacks", icon: Candy, color: "bg-purple-100 text-purple-700" },
    { id: 13, name: "Beverages", icon: GlassWater, color: "bg-purple-100 text-purple-700" },
    { id: 14, name: "Coffee & Tea", icon: CupSoda, color: "bg-purple-100 text-purple-700" },
    { id: 15, name: "Bakery", icon: Cookie, color: "bg-purple-100 text-purple-700" },
    { id: 16, name: "Health & Supplements", icon: HeartPulse, color: "bg-purple-100 text-purple-700" },
    { id: 17, name: "Household Supplies", icon: Home, color: "bg-purple-100 text-purple-700" },
    { id: 18, name: "Cleaning Products", icon: SprayCan, color: "bg-purple-100 text-purple-700" },
    { id: 19, name: "Personal Care", icon: User, color: "bg-purple-100 text-purple-700" },
    { id: 20, name: "Baby Products", icon: Baby, color: "bg-purple-100 text-purple-700" },
    { id: 21, name: "Pet Supplies", icon: PawPrint, color: "bg-purple-100 text-purple-700" }
];


const CategorySilder = () => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);
    const animRef = useRef<number | null>(null);



    const easeOutBack = (t: number) => {
        const c1 = 1.25;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };

    const updateButtons = () => {
        const el = scrollRef.current;
        if (!el) return;

        const { scrollLeft, scrollWidth, clientWidth } = el;

        const newShowLeft = scrollLeft > 5;
        const newShowRight = scrollLeft + clientWidth < scrollWidth - 5;

        setShowLeft((prev) => (prev !== newShowLeft ? newShowLeft : prev));
        setShowRight((prev) => (prev !== newShowRight ? newShowRight : prev));
    };

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const smoothScrollTo = (target: number, duration = 700) => {
        const el = scrollRef.current;
        if (!el) return;

        if (animRef.current) cancelAnimationFrame(animRef.current);

        const start = el.scrollLeft;
        const maxScroll = el.scrollWidth - el.clientWidth;

        target = Math.max(0, Math.min(target, maxScroll));

        const distance = target - start;
        const startTime = performance.now();

        const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutBack(progress);

            el.scrollLeft = start + distance * eased;
            updateButtons();

            if (progress < 1) {
                animRef.current = requestAnimationFrame(step);
            } else {
                animRef.current = null;
            }
        };

        animRef.current = requestAnimationFrame(step);
    };

    const scrollByAmount = (direction: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;

        const amount = el.clientWidth * 0.9;
        const target =
            direction === "left"
                ? el.scrollLeft - amount
                : el.scrollLeft + amount;

        smoothScrollTo(target, 720);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        updateButtons();

        let rafId: number | null = null;
        const onScroll = () => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                updateButtons();
                rafId = null;
            });
        };

        el.addEventListener("scroll", onScroll, { passive: true });

        const resizeObserver = new ResizeObserver(() => updateButtons());
        resizeObserver.observe(el);

        return () => {
            el.removeEventListener("scroll", onScroll);
            resizeObserver.disconnect();
            if (rafId) cancelAnimationFrame(rafId);
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, []);


    return (
        <motion.div className='w-[90%] mx-auto md:w-[80%] my-10 relative'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.5 }}
        >
            {/* Title */}
            <div className='flex flex-row items-center justify-center gap-2'>
                <ShoppingCart className='w-10 h-10' />
                <span className='text-2xl md:text-3xl text-green-700 font-extrabold tracking-wide'>Shopping by Category</span>
            </div>

            {/* List cartegory */}
            <div ref={scrollRef} className='flex gap-4 overflow-hidden scroll-smooth mt-10 scrollbar-hide'>
                {categories?.map((item) => {
                    const Icon = item?.icon;
                    return <div key={item?.id} className={`min-w-[150px] p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all rounded-2xl ${item.color} shadow-md hover:shadow-xl`}>
                        <Icon className='w-10 h-10' />
                        <p className='text-center text-sm md:text-base font-semibold text-gray-600'>{item?.name}</p>
                    </div>
                })}
            </div>

            {/* Button left */}
            {showLeft && (
                <div onClick={() => scrollByAmount('left')} className='absolute top-2/3 left-0 bg-white shadow-md shadow-black/20 rounded-2xl transition-all text-center p-2 cursor-pointer hover:shadow-black/50 -translate-y-1/2'>
                    <ArrowBigLeft className='w-5 h-5 text-green-700 hover:text-green-500 transition-all' />
                </div>
            )}

            {/* Button right */}
            {showRight && (
                <div onClick={() => scrollByAmount('right')} className='absolute top-2/3 right-0 -translate-y-1/2 bg-white shadow-md shadow-black/20 rounded-2xl transition-all text-center p-2 cursor-pointer hover:shadow-black/50'>
                    <ArrowBigRight className='w-5 h-5 text-green-700 hover:text-green-500 transition-all' />
                </div>
            )}

        </motion.div>
    )
}

export default CategorySilder