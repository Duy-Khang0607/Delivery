import connectDB from '@/app/lib/db'
import Grocery, { IGrocery } from '@/app/models/grocery.model'
import GroceryItemCard from '@/app/components/GroceryItemCard'

const ViewGrocery = async () => {

  // Connect tới DB
  await connectDB()

  // Từ DB lấy ra danh sách "groceries"
  const groceries = await Grocery?.find({}).lean()
  const JSONGrocery = JSON.parse(JSON.stringify(groceries))

  return (
    <>
      {/* Grocery List Items */}
      <div className='w-[90%] md:w-[80%] mt-10 mx-auto'>
        {/* Title */}
        <h1 className='text-green-700 font-extrabold text-3xl tracking-wide text-center'>All Grocery Items</h1>
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

export default ViewGrocery