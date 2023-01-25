import { Component, ComponentProps } from 'react';
import { NextRouter, withRouter } from 'next/router';
import { ghProfile, myName } from '@/constants/';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import MenuButton from './menu';
import ProfileBio from './profile';
import StackList from './stacks';
import favicon from '@/public/favicon.ico';
import laundry from '@/public/images/laundry.jpg';
import names from 'classnames';
import portrait from '@/public/images/profile.jpg';

type LayoutProps = ComponentProps<'div'> & {
    router: NextRouter;
};

class Layout extends Component<LayoutProps> {
    render() {
        const router = this.props.router;
        const isHome = router.pathname === '/';
        return (
            <div
                className={names(
                    'lg:max-w-4xl',
                    'bg-white my-0 mx-auto',
                    'transition-all',
                    'max-w-7xl'
                )}>
                <Head>
                    <meta
                        name='og:image'
                        property='og:image'
                        itemProp='image primaryImageOfPage'
                        content={laundry.src}
                    />
                    <meta
                        name='twitter:image'
                        property='og:image'
                        itemProp='image primaryImageOfPage'
                        content={laundry.src}
                    />
                    <link rel='apple-touch-icon' href={favicon.src} />
                </Head>
                <summary
                    className={names(
                        'xl:scrollbar-hide xl:w-120',
                        'text-base overflow-x-hidden',
                        'inline-block text-base p-10 pb-4',
                        'xl:max-h-screen xl:min-h-screen xl:overflow-y-auto',
                        'lg:block',
                        'sm:p-4',
                        'xs:overflow-x-hidden',
                        'xl:pb-16 xl:top-0'
                    )}>
                    <MenuButton />
                    <h1 className='mx-0 my-4 text-2xl leading-normal'>
                        <Link href={isHome ? ghProfile : '/'}>{myName}</Link>
                    </h1>
                    <section className='p-0 mt-0 text-base border-t-0'>
                        <Link href={isHome ? ghProfile : '/'}>
                            <Image
                                src={portrait}
                                alt={myName}
                                width={156}
                                height={156}
                                className='rounded-full print:hidden'
                            />
                        </Link>
                        <ProfileBio />
                        <StackList />
                    </section>
                </summary>
                <main
                    className={names(
                        'xl:scrollbar-hide xl:w-full-30',
                        'text-base overflow-x-hidden',
                        'inline-block text-base p-10',
                        'xl:max-h-screen xl:min-h-screen xl:overflow-y-auto',
                        'lg:block',
                        'sm:p-4',
                        'pt-0'
                    )}>
                    <section>{this.props.children}</section>
                    {!isHome && (
                        <div className='leading-8 font-bolder'>
                            <Link href='/'>🔙 홈으로가기</Link>
                        </div>
                    )}
                </main>
            </div>
        );
    }
}

export default withRouter(Layout);
