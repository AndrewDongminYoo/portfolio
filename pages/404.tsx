import Layout from '@components/layout';

export default function ErrorPage() {
    return (
        <Layout>
            <video
                className="object-cover w-full mt-4"
                src="/videos/error.mp4"
                preload="metadata"
                playsInline={true}
                muted={true}
                loop={true}
                autoPlay={true}
                data-trim-start-us="0.0"
                data-trim-end-us="5000000.0"
            />
            <h2 className="text-xl tracking-normal text-orange-600">404 Error:: Not Found</h2>
            <h1 className="text-3xl">페이지가 존재하지 않아요!!</h1>
            <p className="text-base leading-5 tracking-normal">
                찾으시는 주소가 정확한지 확인해주세요!!
                <br />
                삭제되었거나 존재하지 않는 페이지입니다.
                <br />
                홈으로 다시 돌아갑니다.
                <br />
            </p>
        </Layout>
    );
}
