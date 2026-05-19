
import Link from 'next/link';

import Menu from './Menu';
import Image from 'next/image';
import Search from './Search';


function Header() {
  return (
    <header className='w-full border-b'>
        <div className='wrapper flex-between'>
            <div className='flex-start'>
                <Link href='/' className='flex-start space-x-2 ml-5'> 
                      <Image
                          src="/images/logo.svg"
                          className="object-cover object-center"
                          alt="logo"
                          width={50}
                          height={50}
                          priority={true}
                      />
                      <span className='font-bold text-2xl'>UrbanCap</span>
                </Link>
            </div>
            <div className="hidden md:block">
                    <Search />
            </div>
            <div className='space-x-2'>
                <Menu />
            </div>
        </div>
    </header>
  )
}

export default Header;