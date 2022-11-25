import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/stacks.module.css'
import Link from 'next/link'

export default function StackList() {
    return (
        <section className={styles.stacks}>
            <div className={styles.stacks__primary}>
                <div className={styles.resume_section_title}><span>
                    주요 기술
                </span> <span className={styles.count}>
                        4개
                    </span>
                </div>
                <ul className={styles.list_stack}>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        AWS Lambda
                    </button></li>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        Python
                    </button></li>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        Flutter
                    </button></li>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        TypeScript
                    </button></li>
                </ul>
            </div>
            <div className={styles.stacks__secondary}>
                <div className={styles.resume_section_title}><span>
                    기술 태그
                </span>
                </div>
                <ul className={styles.list_stack}>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        Swagger / OpenAPI
                    </button></li>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        TailwindCSS / styled_components
                    </button></li>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        AWS CloudFront / ElasticBeanstalk
                    </button></li>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        Django / Flask
                    </button></li>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        Firebase
                    </button></li>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        GitHub / Bitbucket
                    </button></li>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        GraphQL / Prisma / Apollo
                    </button></li>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        Java / Spring
                    </button></li>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        Spring Data JPA
                    </button></li>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        MongoDB / DynamoDB
                    </button></li>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        AWS RDS (MySQL / PostgreSQL)
                    </button></li>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        React Native / Expo
                    </button></li>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        ReactJS / RedWoodJS
                    </button></li>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        Selenium / BeautifulSoup
                    </button></li>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        TypeScript / JavaScript
                    </button></li>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        Webpack
                    </button></li>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        WebSocket
                    </button></li>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        Chart.js
                    </button></li>
                    <li className={styles.col_item}><button className={styles.stack_item}>
                        StorybookJS
                    </button></li>
                </ul>
            </div>
        </section>
    )
}