import connectDB from './lib/db';
import { auth } from './auth';
import User from './models/user.model';
import { redirect } from 'next/navigation';
import EditRoleModile from './components/EditRoleModile';
import Nav from './components/Nav';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import DeliveryBoy from './components/DeliveryBoy';

const Home = async () => {
  await connectDB();
  const session = await auth();
  const user = await User?.findById(session?.user?.id);
  console.log({ session })
  if (!user) {
    redirect('/login');
  }

  // parse json
  const JsonUser = JSON.parse(JSON.stringify(user));

  const inComplete = !JsonUser?.mobile || !JsonUser?.role || (!JsonUser?.mobile && JsonUser?.role == 'user')
  if (inComplete) {
    return <EditRoleModile />
  }


  return (
    <>
      <Nav user={JsonUser} />
      {/* {JsonUser?.role === 'user' ? <UserDashboard/> : JsonUser?.role === 'admin' ? <AdminDashboard/> : <DeliveryBoy/>} */}
      <UserDashboard />
    </>
  )
}

export default Home