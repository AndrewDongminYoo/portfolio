import Layout from '@components/layout';

export default function ErrorPage() {
    return (
        <Layout>
            <video
                src="/medias/error.mp4"
                preload="metadata"
                playsInline={true}
                muted={true}
                loop={true}
                autoPlay={true}
                data-trim-start-us="0.0"
                data-trim-end-us="5000000.0"
            />
            <div>
                <h2 className="error">404 Error:: Not Found</h2>
                <h1 className="error">페이지가 존재하지 않아요!!</h1>
                <p className="error">
                    찾으시는 주소가 정확한지 확인해주세요!!
                    <br />
                    삭제되었거나 존재하지 않는 페이지입니다.
                    <br />
                    홈으로 다시 돌아갑니다.
                    <br />
                </p>
            </div>
        </Layout>
    );
}
