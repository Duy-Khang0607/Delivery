import HeroSection from './HeroSection'
import CategorySilder from './CategorySilder'
import GroceryItemCard from './GroceryItemCard'
import { IGrocery } from '../models/grocery.model'

const UserDashboard = async ({ groceryList }: { groceryList: IGrocery[] }) => {

  const JSONGrocery = JSON.parse(JSON.stringify(groceryList))

  return (
    <>
      <HeroSection />
      <CategorySilder />
      {/* Grocery List Items */}
      <div className='w-[90%] md:w-[80%] mt-10 mx-auto'>
        {/* Title */}
        <h1 className='text-green-700 font-extrabold text-3xl tracking-wide text-center'>Popular Grocery Items</h1>
        {/* Grocery Items */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-10 w-full'>
          {JSONGrocery?.map((item: IGrocery) => {
            return <GroceryItemCard key={item?._id.toString()} groceries={item} />
          })}
        </div>
      </div>
    </>
  )
}

export default UserDashboard