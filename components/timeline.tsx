import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/timeline.module.css'
import Link from 'next/link'

export default function GridTimeline() {
    return (
        <section className={styles.timeline}>
            <div className={styles.header}>
                <div className={styles.left}>
                    <h4 className={styles.header_title}>
                        타임라인
                    </h4>
                </div>
                <div className={styles.right}>
                </div>
            </div>
            <div className={styles.body}>
                <div className={styles.card_item}>
                    <div className={styles.timeline_wrap}>
                        <div className={styles.timeline_labels}>
                            <div className={styles.year}>21.03</div>
                            <div className={styles.year}>21.05</div>
                            <div className={styles.year}>21.07</div>
                            <div className={styles.year}>21.09</div>
                            <div className={styles.year}>21.11</div>
                            <div className={styles.year}>22.01</div>
                            <div className={styles.year}>22.03</div>
                            <div className={styles.year}>22.05</div>
                            <div className={styles.year}>22.07</div>
                            <div className={styles.year}>22.09</div>
                            <div className={styles.year}>22.11</div>
                        </div>
                        <div className={styles.grid_timeline}>
                            <div data-original-title="세종사이버대학교 소프트웨어공학과" data-content="
                                        6개월
                                        <h6 class=&quot;text-mute&quot;>2022-02 ~ 08</h6>"
                                data-html="true"
                                data-toggle="popover"
                                data-placement="top"
                                className={styles.event_item}
                                style={{
                                    gridColumn: "49 / 76",
                                    backgroundColor: "#7890a0",
                                }}
                            >
                                세종사이버대학교
                                소프트웨어공학과
                            </div>
                            <div
                                data-original-title="주식회사아이브코리아 백엔드 개발자"
                                data-content="
                                        5개월
                                        <h6 class=&quot;text-mute&quot;>2022-01 ~ 2022-05</h6>"
                                data-html="true"
                                data-toggle="popover"
                                data-placement="top"
                                className={styles.event_item}
                                style={{
                                    gridColumn: "49 / 67",
                                    backgroundColor: "#44576c",
                                }}
                            >
                                주식회사아이브코리아
                                백엔드 개발자
                            </div>
                            <div
                                data-original-title="주식회사비사이드코리아 백엔드/모바일 개발자"
                                data-content="
                                        7개월
                                        <h6 class=&quot;text-mute&quot;>2022-05 ~ 현재</h6>"
                                data-html="true"
                                data-toggle="popover"
                                data-placement="top"
                                className={styles.event_item}
                                style={{
                                    gridColumn: "67 / 88",
                                    backgroundColor: "#44576c",
                                }}
                            >
                                주식회사비사이드코리아
                                백엔드/모바일 개발자
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}