import Image from 'next/image';
import Link from 'next/link';

import { APP_NAME } from '@/lib/constants';
import Menu from './Menu';


function Header() {
  return (
    <header className='w-full border-b'>
        <div className='wrapper flex-between'>
            <div className='flex-start'>
                <Link href='/' className='flex-start'> 
                      <span className='hidden lg:block font-bold text-2xl ml-3'>Urban Cap</span>
                </Link>
            </div>
            <div className='space-x-2'>
                <Menu />
            </div>
        </div>
    </header>
  )
}

export default Header