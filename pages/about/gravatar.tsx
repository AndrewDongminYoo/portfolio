import { blog, calendly, github, homepage, instagram, stackoverflow } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import _calendly from '@/public/svg/icons/calendly.svg';
import _github from '@/public/svg/icons/github.svg';
import _instagram from '@/public/svg/icons/instagram.svg';
import _link from '@/public/svg/icons/link.svg';
import _mail from '@/public/svg/icons/mail.svg';
import _stack from '@/public/svg/icons/stackoverflow.svg';
import laundry from '@/public/images/laundry.jpg';
import profile from '@/public/images/profile.jpg';
import verified from '@/public/svg/icons/verified.svg';

export default function Gravatar() {
  return (
    <>
      <link rel='canonical' href='https://gravatar.com/donminzzi' />
      <meta httpEquiv='Content-type' content='text/html; charset=utf-8' />
      <meta httpEquiv='Content-Language' content='en' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <link rel='profile' href='https://microformats.org/profile/hcard' />
      <link
        rel='alternate'
        type='text/directory'
        title='vCard'
        href='https://gravatar.com/donminzzi.vcf'
      />
      <link
        rel='alternate'
        type='text/javascript'
        title='vCard'
        href='https://gravatar.com/donminzzi.json'
      />
      <link rel='alternate' type='text/xml' title='XML' href='https://gravatar.com/donminzzi.xml' />
      <link
        rel='alternate'
        type='text/php'
        title='Serialized PHP'
        href='https://gravatar.com/donminzzi.php'
      />
      <link
        rel='alternate'
        type='image/png'
        title='QR Code'
        href='https://gravatar.com/donminzzi.qr'
      />
      <link rel='alternate' hrefLang='x-default' href='https://gravatar.com/site/translations/' />
      <link
        rel='stylesheet'
        id='gravatar-core-css'
        href='https://s.gravatar.com/dist/css/style.min.css?ver=217'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='gravatar-noticons-css'
        href='//s0.wp.com/i/noticons/noticons.css?ver=217'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='gravatar-profile-css'
        href='https://s.gravatar.com/dist/css/profile.min.css?ver=217'
        media='all'
      />
      <style
        id='gravatar-automatticon-inline-css'
        nonce='4e3e35a382ed'
        dangerouslySetInnerHTML={{
          __html:
            "\n    @font-face {\n      font-family: 'Automatticons';\n      src: url('https://s.gravatar.com/fonts/automatticons-regular-webfont.eot');\n      src: url('https://s.gravatar.com/fonts/automatticons-regular-webfont.eot?#iefix') format('embedded-opentype'), url('https://s.gravatar.com/fonts/automatticons-regular-webfont.woff') format('woff'), url('https://s.gravatar.com/fonts/automatticons-regular-webfont.ttf') format('truetype'), url('https://s.gravatar.com/fonts/automatticons-regular-webfont.svg#automatticonsregular') format('svg');\n      font-weight: normal;\n      font-style: normal;\n      -webkit-font-smoothing: antialiased;\n    }\n  ",
        }}
      />
      <link
        rel='stylesheet'
        id='gravatar-mobile-modal-css'
        href='https://s.gravatar.com/dist/css/mobile-modal.min.css?ver=217'
        media='all'
      />
      <link
        rel='stylesheet'
        id='gravatar-services-css'
        href='https://s.gravatar.com/dist/css/services.css?ver=217'
        media='all'
      />
      <style
        id='custom-background-inline-css'
        nonce='4e3e35a382ed'
        dangerouslySetInnerHTML={{
          __html:
            "\n    body {\n      background-color: white;\n    }\n\n    #main {\n      margin-top: 0 !important;\n      background: url('https://1.gravatar.com/bg/190886560/76eeffdcf0c92273727cdefe791d1ceb') #0969da center;\n      background-attachment: fixed;\n      -webkit-background-size: cover;\n      -moz-background-size: cover;\n      -o-background-size: cover;\n      background-size: cover;\n    }\n\n    #footer {\n      background-color: #222;\n      background-color: rgba(0, 0, 0, 0.8);\n    }\n  ",
        }}
      />
      <div id='wrap' className='profile'>
        <div id='main'>
          <div className='middle'>
            <div className='box'>
              <div id='content' className='profile'>
                <div className='grofile' id='profile'>
                  <Image className='profile-image' src={profile} alt='Profile image' />
                  <div className='profile-card profile-description'>
                    <h2>Dongmin Yu</h2>
                    <div className='profile-details'>
                      <span title='dɔŋ min, ju'>dɔŋ min, ju</span>
                      <span title='Seoul'>Seoul</span>
                    </div>
                    <p id='bio' className='description'>
                      Dongmin,Yu
                      <br />
                      <br />
                      셰프 출신 크로스플랫폼 앱 개발자입니다.
                      <br />
                      <br />
                      ydm2790@gmail.com <br />
                      {homepage}
                      <br />
                      {blog}
                    </p>
                    <div className='profile-mobile-buttons'>
                      <button
                        className='profile-button profile-button--outline'
                        data-mobile-modal-open='share-profile'>
                        Share Profile
                      </button>
                    </div>
                    <div className='profile-misc'>
                      <ul className='dev-endpoints'>
                        <li>
                          <a href='https://gravatar.com/donminzzi.vcf'>연락처 vCard</a>
                        </li>
                        <li>
                          <a href='https://gravatar.com/donminzzi.qr'>프로필 QR코드</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className='profile-card'>
                    <h3>Photo Gallery</h3>
                    <div className='gallery-grid' role='list'>
                      <style
                        type='text/css'
                        nonce='4e3e35a382ed'
                        dangerouslySetInnerHTML={{
                          __html:
                            '\n                  .bgimage-0 {\n                    background-image: url("https://2.gravatar.com/userimage/190886560/724b620393b1000c603b4c92c44ec378?size=256");\n                  }\n                ',
                        }}
                      />
                      <Link
                        data-id={0}
                        content='https://2.gravatar.com/userimage/190886560/724b620393b1000c603b4c92c44ec378'
                        className='gallery-image bgimage-0'
                        href='https://2.gravatar.com/userimage/190886560/724b620393b1000c603b4c92c44ec378?size=original'
                        aria-label='Photo gallery image'></Link>
                      <style
                        type='text/css'
                        nonce='4e3e35a382ed'
                        dangerouslySetInnerHTML={{
                          __html:
                            '\n                  .bgimage-1 {\n                    background-image: url("https://0.gravatar.com/userimage/190886560/97f7cefc0e63677aa4169bbdbfaac50e?size=256");\n                  }\n                ',
                        }}
                      />
                      <Link
                        data-id={1}
                        content='https://0.gravatar.com/userimage/190886560/97f7cefc0e63677aa4169bbdbfaac50e'
                        className='gallery-image bgimage-1'
                        href='https://0.gravatar.com/userimage/190886560/97f7cefc0e63677aa4169bbdbfaac50e?size=original'
                        aria-label='Photo gallery image'></Link>
                      <style
                        type='text/css'
                        nonce='4e3e35a382ed'
                        dangerouslySetInnerHTML={{
                          __html:
                            '\n                  .bgimage-2 {\n                    background-image: url("https://2.gravatar.com/userimage/190886560/a813ea77b64cde4f8cc8bf5057063473?size=256");\n                  }\n                ',
                        }}
                      />
                      <Link
                        data-id={2}
                        content='https://2.gravatar.com/userimage/190886560/a813ea77b64cde4f8cc8bf5057063473'
                        className='gallery-image bgimage-2'
                        href='https://2.gravatar.com/userimage/190886560/a813ea77b64cde4f8cc8bf5057063473?size=original'
                        aria-label='Photo gallery image'></Link>
                    </div>
                  </div>
                  <div className='profile-card'>
                    <h3>Verified Accounts</h3>
                    <div>
                      {<VerifiedLink icon={_instagram} title='Instagram' link={instagram} />}
                      {<VerifiedLink icon={_github} title='GitHub' link={github} />}
                      {<VerifiedLink icon={_stack} title='Stack Overflow' link={stackoverflow} />}
                      {<VerifiedLink icon={_calendly} title='Calendly' link={calendly} />}
                    </div>
                  </div>
                  <div className='profile-card'>
                    <h3>Links</h3>
                    <div>
                      <div className='link-item'>
                        <Image className='link-item__icon' src={_link} alt='Career profile' />
                        <div className='link-item__info'>
                          <div className='link-label'>
                            <span className='link-label__text'>Career profile </span>
                          </div>
                          <a
                            className='profile-link'
                            href={homepage}
                            title={homepage}
                            target='_blank'
                            rel='me nofollow noreferrer'>
                            andrewdongminyoo.vercel.app/
                          </a>
                        </div>
                      </div>
                      <div className='link-item'>
                        <Image className='link-item__icon' src={_link} alt='Tech Blog' />
                        <div className='link-item__info'>
                          <div className='link-label'>
                            <span className='link-label__text'>Tech Blog </span>
                          </div>
                          <a
                            className='profile-link'
                            href={blog}
                            title={blog}
                            target='_blank'
                            rel='me nofollow noreferrer'>
                            cat-minzzi.tistory.com/
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='profile-card'>
                    <h3>Contact Me</h3>
                    <div>
                      <div className='link-item'>
                        <Image className='link-item__icon' src={_mail} alt='Email' />
                        <div className='link-item__info'>
                          <div className='link-label'>
                            <span className='link-label__text'>Email</span>
                          </div>
                          <a
                            className='profile-link'
                            title='ydm2790@gmail.com'
                            href='mailto:ydm2790@gmail.com'>
                            ydm2790@gmail.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='profile-misc is-mobile'>
                    <ul className='dev-endpoints'>
                      <li>
                        <a href='https://gravatar.com/donminzzi.vcf'>연락처 vCard</a>
                      </li>
                      <li>
                        <a href='https://gravatar.com/donminzzi.qr'>프로필 QR코드</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  className='g-mobile-modal'
                  data-mobile-modal-id='send-money'
                  role='dialog'
                  aria-hidden='true'>
                  <div className='g-mobile-modal__overlay'></div>
                  <div className='g-mobile-modal__card'>
                    <div>
                      <button className='g-mobile-modal__close-button'>
                        <svg
                          width={14}
                          height={14}
                          viewBox='0 0 14 14'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'>
                          <path
                            d='M1.34676 1L13 13M1 13L12.6532 1'
                            stroke='black'
                            strokeWidth='1.5'
                          />
                        </svg>
                      </button>
                    </div>
                    <div className='g-mobile-modal__content-wrapper'>
                      <div className='profile-card is-mobile'>
                        <h3>Payments</h3>
                        <div></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className='g-mobile-modal'
                  data-mobile-modal-id='share-profile'
                  role='dialog'
                  aria-hidden='true'>
                  <div className='g-mobile-modal__overlay'></div>
                  <div className='g-mobile-modal__card'>
                    <div>
                      <button className='g-mobile-modal__close-button'>
                        <svg
                          width={14}
                          height={14}
                          viewBox='0 0 14 14'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'>
                          <path
                            d='M1.34676 1L13 13M1 13L12.6532 1'
                            stroke='black'
                            strokeWidth='1.5'
                          />
                        </svg>
                      </button>
                    </div>
                    <div className='g-mobile-modal__content-wrapper'>
                      <div className='profile-card is-mobile'>
                        <h3>Share Profile</h3>
                        <div className='link-item link-item--qr'>
                          <Image
                            src='https://gravatar.com/donminzzi.qr'
                            width='230'
                            height='230'
                            alt='QR Code'
                          />
                          <a
                            className='link-item__download'
                            href='https://gravatar.com/donminzzi.qr'
                            download='dongmin-yu.png'
                            data-mobile-modal-close=''>
                            Download
                          </a>
                        </div>
                        <div className='link-item link-item--share-buttons'>
                          <button
                            id='copy-link'
                            className='profile-button profile-button--outline'
                            data-mobile-modal-close=''>
                            Copy Link
                          </button>
                          <button
                            id='send-link'
                            className='profile-button profile-button--outline'
                            data-mobile-modal-close=''>
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='lightbox-modal' aria-modal='true'>
                  <div className='lightbox-modal__close' aria-label='Close modal'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width={32}
                      height={32}
                      viewBox='0 0 24 24'>
                      <path
                        fill='currentColor'
                        d='M12 13.06l3.712 3.713 1.061-1.06L13.061 12l3.712-3.712-1.06-1.06L12 10.938 8.288 7.227l-1.061 1.06L10.939 12l-3.712 3.712 1.06 1.061L12 13.061z'
                      />
                    </svg>
                  </div>
                  <div className='lightbox-modal__navigation-left' aria-label='Previous'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width={32}
                      height={32}
                      viewBox='0 0 24 24'>
                      <path fill='currentColor' d='M14.6 7l-1.2-1L8 12l5.4 6 1.2-1-4.6-5z' />
                    </svg>
                  </div>
                  <div className='lightbox-modal__navigation-right' aria-label='Next'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width={32}
                      height={32}
                      viewBox='0 0 24 24'>
                      <path fill='currentColor' d='M10.6 6L9.4 7l4.6 5-4.6 5 1.2 1 5.4-6z' />
                    </svg>
                  </div>
                  <div className='lightbox-modal__content'>
                    <div className='lightbox-modal__image'>
                      <Image src={laundry} alt='Gallery image' />
                    </div>
                  </div>
                </div>
              </div>{' '}
              <span className='clear'></span>
            </div>{' '}
            <span className='clear'></span>
          </div>{' '}
          <span className='clear'></span>
        </div>{' '}
        <span className='clear'></span>
      </div>
    </>
  );
}

function VerifiedLink({
  icon,
  link,
  title,
  trusted = true,
}: {
  icon: StaticImport;
  link: string;
  trusted?: boolean;
  title: string;
}) {
  return (
    <>
      <div className='link-item'>
        <Image className='link-item__icon' src={icon} alt={title} />
        <div className='link-item__info'>
          <div className='link-label'>
            <span className='link-label__text'>{title} </span>
            {trusted ? (
              <a
                className='verified-link'
                href='https://support.gravatar.com/profiles/verified-accounts/'>
                <Image className='verified-icon' alt='verified icon' src={verified} />
              </a>
            ) : null}
          </div>
          <a
            className='profile-link'
            href={link}
            title={link}
            target='_blank'
            rel='me nofollow noreferrer'>
            {link}
          </a>
        </div>
      </div>
    </>
  );
}
