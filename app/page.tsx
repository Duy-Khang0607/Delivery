import connectDB from './lib/db';
import { auth } from './auth';
import User from './models/user.model';
import { redirect } from 'next/navigation';
import EditRoleModile from './components/EditRoleModile';
import Nav from './components/Nav';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import DeliveryBoy from './components/DeliveryBoy';
import GeoUpdater from './components/GeoUpdater';
import Grocery, { IGrocery } from './models/grocery.model';

const Home = async (props: { searchParams: Promise<{ q: string }> }) => {
  const { q } = await props.searchParams;
  await connectDB();
  const session = await auth();
  const user = await User?.findById(session?.user?.id);

  if (!user) {
    redirect('/login');
  }

  const JsonUser = JSON.parse(JSON.stringify(user));

  const inComplete = !JsonUser?.mobile || !JsonUser?.role || (!JsonUser?.mobile && JsonUser?.role == 'user')

  if (inComplete) {
    return <EditRoleModile />
  }

  let groceryList: IGrocery[] = [];

  if (user?.role === 'user') {
    if (q) {
      groceryList = await Grocery?.find(
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { category: { $regex: q, $options: 'i' } }
          ]
        }
      )
    } else {
      groceryList = await Grocery?.find({});
    }
  }


  return (
    <>
      <Nav user={JsonUser} />
      <GeoUpdater userId={JsonUser?._id} />
      {JsonUser?.role === 'user' ? <UserDashboard groceryList={groceryList} /> : JsonUser?.role === 'admin' ? <AdminDashboard /> : <DeliveryBoy />}
    </>
  )
}

export default Home