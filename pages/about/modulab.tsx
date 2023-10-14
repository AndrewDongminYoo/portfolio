import { blog, github, homepage, instagram, linkedIn } from '@/constants';
import Image from 'next/image';
import profile from '@/public/images/profile.jpg';
import unsplash from '@//public/images/unsplash.jpeg';

export default function Modulab() {
  return (
    <>
      <style
        type='text/css'
        dangerouslySetInnerHTML={{
          __html:
            '\n    img.wp-smiley,\n    img.emoji {\n      display: inline !important;\n      border: none !important;\n      box-shadow: none !important;\n      height: 1em !important;\n      width: 1em !important;\n      margin: 0 0.07em !important;\n      vertical-align: -0.1em !important;\n      background: none !important;\n      padding: 0 !important;\n    }\n  ',
        }}
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='wp-block-library-css'
        href='https://modulabs.co.kr/wp-includes/css/dist/block-library/style.min.css?ver=1694385806'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='prismatic-blocks-css'
        href='https://modulabs.co.kr/wp-content/plugins/prismatic/css/styles-blocks.css?ver=1674571438'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='wc-blocks-vendors-style-css'
        href='https://modulabs.co.kr/wp-content/plugins/woocommerce/packages/woocommerce-blocks/build/wc-blocks-vendors-style.css?ver=1674568675'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='wc-blocks-style-css'
        href='https://modulabs.co.kr/wp-content/plugins/woocommerce/packages/woocommerce-blocks/build/wc-blocks-style.css?ver=1674568675'
        type='text/css'
        media='all'
      />
      <style
        id='classic-theme-styles-inline-css'
        type='text/css'
        dangerouslySetInnerHTML={{
          __html:
            '\n    .wp-block-button__link {\n      color: #fff;\n      background-color: #32373c;\n      border-radius: 9999px;\n      box-shadow: none;\n      text-decoration: none;\n      padding: calc(.667em + 2px) calc(1.333em + 2px);\n      font-size: 1.125em\n    }\n\n    .wp-block-file__button {\n      background: #32373c;\n      color: #fff;\n      text-decoration: none\n    }\n  ',
        }}
      />
      <style
        id='global-styles-inline-css'
        type='text/css'
        dangerouslySetInnerHTML={{
          __html:
            '\n    body {\n      --wp--preset--color--black: #000000;\n      --wp--preset--color--cyan-bluish-gray: #abb8c3;\n      --wp--preset--color--white: #ffffff;\n      --wp--preset--color--pale-pink: #f78da7;\n      --wp--preset--color--vivid-red: #cf2e2e;\n      --wp--preset--color--luminous-vivid-orange: #ff6900;\n      --wp--preset--color--luminous-vivid-amber: #fcb900;\n      --wp--preset--color--light-green-cyan: #7bdcb5;\n      --wp--preset--color--vivid-green-cyan: #00d084;\n      --wp--preset--color--pale-cyan-blue: #8ed1fc;\n      --wp--preset--color--vivid-cyan-blue: #0693e3;\n      --wp--preset--color--vivid-purple: #9b51e0;\n      --wp--preset--gradient--vivid-cyan-blue-to-vivid-purple: linear-gradient(135deg, rgba(6, 147, 227, 1) 0%, rgb(155, 81, 224) 100%);\n      --wp--preset--gradient--light-green-cyan-to-vivid-green-cyan: linear-gradient(135deg, rgb(122, 220, 180) 0%, rgb(0, 208, 130) 100%);\n      --wp--preset--gradient--luminous-vivid-amber-to-luminous-vivid-orange: linear-gradient(135deg, rgba(252, 185, 0, 1) 0%, rgba(255, 105, 0, 1) 100%);\n      --wp--preset--gradient--luminous-vivid-orange-to-vivid-red: linear-gradient(135deg, rgba(255, 105, 0, 1) 0%, rgb(207, 46, 46) 100%);\n      --wp--preset--gradient--very-light-gray-to-cyan-bluish-gray: linear-gradient(135deg, rgb(238, 238, 238) 0%, rgb(169, 184, 195) 100%);\n      --wp--preset--gradient--cool-to-warm-spectrum: linear-gradient(135deg, rgb(74, 234, 220) 0%, rgb(151, 120, 209) 20%, rgb(207, 42, 186) 40%, rgb(238, 44, 130) 60%, rgb(251, 105, 98) 80%, rgb(254, 248, 76) 100%);\n      --wp--preset--gradient--blush-light-purple: linear-gradient(135deg, rgb(255, 206, 236) 0%, rgb(152, 150, 240) 100%);\n      --wp--preset--gradient--blush-bordeaux: linear-gradient(135deg, rgb(254, 205, 165) 0%, rgb(254, 45, 45) 50%, rgb(107, 0, 62) 100%);\n      --wp--preset--gradient--luminous-dusk: linear-gradient(135deg, rgb(255, 203, 112) 0%, rgb(199, 81, 192) 50%, rgb(65, 88, 208) 100%);\n      --wp--preset--gradient--pale-ocean: linear-gradient(135deg, rgb(255, 245, 203) 0%, rgb(182, 227, 212) 50%, rgb(51, 167, 181) 100%);\n      --wp--preset--gradient--electric-grass: linear-gradient(135deg, rgb(202, 248, 128) 0%, rgb(113, 206, 126) 100%);\n      --wp--preset--gradient--midnight: linear-gradient(135deg, rgb(2, 3, 129) 0%, rgb(40, 116, 252) 100%);\n      --wp--preset--font-size--small: 13px;\n      --wp--preset--font-size--medium: 20px;\n      --wp--preset--font-size--large: 36px;\n      --wp--preset--font-size--x-large: 42px;\n      --wp--preset--spacing--20: 0.44rem;\n      --wp--preset--spacing--30: 0.67rem;\n      --wp--preset--spacing--40: 1rem;\n      --wp--preset--spacing--50: 1.5rem;\n      --wp--preset--spacing--60: 2.25rem;\n      --wp--preset--spacing--70: 3.38rem;\n      --wp--preset--spacing--80: 5.06rem;\n      --wp--preset--shadow--natural: 6px 6px 9px rgba(0, 0, 0, 0.2);\n      --wp--preset--shadow--deep: 12px 12px 50px rgba(0, 0, 0, 0.4);\n      --wp--preset--shadow--sharp: 6px 6px 0px rgba(0, 0, 0, 0.2);\n      --wp--preset--shadow--outlined: 6px 6px 0px -3px rgba(255, 255, 255, 1), 6px 6px rgba(0, 0, 0, 1);\n      --wp--preset--shadow--crisp: 6px 6px 0px rgba(0, 0, 0, 1);\n    }\n\n    :where(.is-layout-flex) {\n      gap: 0.5em;\n    }\n\n    :where(.is-layout-grid) {\n      gap: 0.5em;\n    }\n\n    body .is-layout-flow>.alignleft {\n      float: left;\n      margin-inline-start: 0;\n      margin-inline-end: 2em;\n    }\n\n    body .is-layout-flow>.alignright {\n      float: right;\n      margin-inline-start: 2em;\n      margin-inline-end: 0;\n    }\n\n    body .is-layout-flow>.aligncenter {\n      margin-left: auto !important;\n      margin-right: auto !important;\n    }\n\n    body .is-layout-constrained>.alignleft {\n      float: left;\n      margin-inline-start: 0;\n      margin-inline-end: 2em;\n    }\n\n    body .is-layout-constrained>.alignright {\n      float: right;\n      margin-inline-start: 2em;\n      margin-inline-end: 0;\n    }\n\n    body .is-layout-constrained>.aligncenter {\n      margin-left: auto !important;\n      margin-right: auto !important;\n    }\n\n    body .is-layout-constrained> :where(:not(.alignleft):not(.alignright):not(.alignfull)) {\n      max-width: var(--wp--style--global--content-size);\n      margin-left: auto !important;\n      margin-right: auto !important;\n    }\n\n    body .is-layout-constrained>.alignwide {\n      max-width: var(--wp--style--global--wide-size);\n    }\n\n    body .is-layout-flex {\n      display: flex;\n    }\n\n    body .is-layout-flex {\n      flex-wrap: wrap;\n      align-items: center;\n    }\n\n    body .is-layout-flex>* {\n      margin: 0;\n    }\n\n    body .is-layout-grid {\n      display: grid;\n    }\n\n    body .is-layout-grid>* {\n      margin: 0;\n    }\n\n    :where(.wp-block-columns.is-layout-flex) {\n      gap: 2em;\n    }\n\n    :where(.wp-block-columns.is-layout-grid) {\n      gap: 2em;\n    }\n\n    :where(.wp-block-post-template.is-layout-flex) {\n      gap: 1.25em;\n    }\n\n    :where(.wp-block-post-template.is-layout-grid) {\n      gap: 1.25em;\n    }\n\n    .has-black-color {\n      color: var(--wp--preset--color--black) !important;\n    }\n\n    .has-cyan-bluish-gray-color {\n      color: var(--wp--preset--color--cyan-bluish-gray) !important;\n    }\n\n    .has-white-color {\n      color: var(--wp--preset--color--white) !important;\n    }\n\n    .has-pale-pink-color {\n      color: var(--wp--preset--color--pale-pink) !important;\n    }\n\n    .has-vivid-red-color {\n      color: var(--wp--preset--color--vivid-red) !important;\n    }\n\n    .has-luminous-vivid-orange-color {\n      color: var(--wp--preset--color--luminous-vivid-orange) !important;\n    }\n\n    .has-luminous-vivid-amber-color {\n      color: var(--wp--preset--color--luminous-vivid-amber) !important;\n    }\n\n    .has-light-green-cyan-color {\n      color: var(--wp--preset--color--light-green-cyan) !important;\n    }\n\n    .has-vivid-green-cyan-color {\n      color: var(--wp--preset--color--vivid-green-cyan) !important;\n    }\n\n    .has-pale-cyan-blue-color {\n      color: var(--wp--preset--color--pale-cyan-blue) !important;\n    }\n\n    .has-vivid-cyan-blue-color {\n      color: var(--wp--preset--color--vivid-cyan-blue) !important;\n    }\n\n    .has-vivid-purple-color {\n      color: var(--wp--preset--color--vivid-purple) !important;\n    }\n\n    .has-black-background-color {\n      background-color: var(--wp--preset--color--black) !important;\n    }\n\n    .has-cyan-bluish-gray-background-color {\n      background-color: var(--wp--preset--color--cyan-bluish-gray) !important;\n    }\n\n    .has-white-background-color {\n      background-color: var(--wp--preset--color--white) !important;\n    }\n\n    .has-pale-pink-background-color {\n      background-color: var(--wp--preset--color--pale-pink) !important;\n    }\n\n    .has-vivid-red-background-color {\n      background-color: var(--wp--preset--color--vivid-red) !important;\n    }\n\n    .has-luminous-vivid-orange-background-color {\n      background-color: var(--wp--preset--color--luminous-vivid-orange) !important;\n    }\n\n    .has-luminous-vivid-amber-background-color {\n      background-color: var(--wp--preset--color--luminous-vivid-amber) !important;\n    }\n\n    .has-light-green-cyan-background-color {\n      background-color: var(--wp--preset--color--light-green-cyan) !important;\n    }\n\n    .has-vivid-green-cyan-background-color {\n      background-color: var(--wp--preset--color--vivid-green-cyan) !important;\n    }\n\n    .has-pale-cyan-blue-background-color {\n      background-color: var(--wp--preset--color--pale-cyan-blue) !important;\n    }\n\n    .has-vivid-cyan-blue-background-color {\n      background-color: var(--wp--preset--color--vivid-cyan-blue) !important;\n    }\n\n    .has-vivid-purple-background-color {\n      background-color: var(--wp--preset--color--vivid-purple) !important;\n    }\n\n    .has-black-border-color {\n      border-color: var(--wp--preset--color--black) !important;\n    }\n\n    .has-cyan-bluish-gray-border-color {\n      border-color: var(--wp--preset--color--cyan-bluish-gray) !important;\n    }\n\n    .has-white-border-color {\n      border-color: var(--wp--preset--color--white) !important;\n    }\n\n    .has-pale-pink-border-color {\n      border-color: var(--wp--preset--color--pale-pink) !important;\n    }\n\n    .has-vivid-red-border-color {\n      border-color: var(--wp--preset--color--vivid-red) !important;\n    }\n\n    .has-luminous-vivid-orange-border-color {\n      border-color: var(--wp--preset--color--luminous-vivid-orange) !important;\n    }\n\n    .has-luminous-vivid-amber-border-color {\n      border-color: var(--wp--preset--color--luminous-vivid-amber) !important;\n    }\n\n    .has-light-green-cyan-border-color {\n      border-color: var(--wp--preset--color--light-green-cyan) !important;\n    }\n\n    .has-vivid-green-cyan-border-color {\n      border-color: var(--wp--preset--color--vivid-green-cyan) !important;\n    }\n\n    .has-pale-cyan-blue-border-color {\n      border-color: var(--wp--preset--color--pale-cyan-blue) !important;\n    }\n\n    .has-vivid-cyan-blue-border-color {\n      border-color: var(--wp--preset--color--vivid-cyan-blue) !important;\n    }\n\n    .has-vivid-purple-border-color {\n      border-color: var(--wp--preset--color--vivid-purple) !important;\n    }\n\n    .has-vivid-cyan-blue-to-vivid-purple-gradient-background {\n      background: var(--wp--preset--gradient--vivid-cyan-blue-to-vivid-purple) !important;\n    }\n\n    .has-light-green-cyan-to-vivid-green-cyan-gradient-background {\n      background: var(--wp--preset--gradient--light-green-cyan-to-vivid-green-cyan) !important;\n    }\n\n    .has-luminous-vivid-amber-to-luminous-vivid-orange-gradient-background {\n      background: var(--wp--preset--gradient--luminous-vivid-amber-to-luminous-vivid-orange) !important;\n    }\n\n    .has-luminous-vivid-orange-to-vivid-red-gradient-background {\n      background: var(--wp--preset--gradient--luminous-vivid-orange-to-vivid-red) !important;\n    }\n\n    .has-very-light-gray-to-cyan-bluish-gray-gradient-background {\n      background: var(--wp--preset--gradient--very-light-gray-to-cyan-bluish-gray) !important;\n    }\n\n    .has-cool-to-warm-spectrum-gradient-background {\n      background: var(--wp--preset--gradient--cool-to-warm-spectrum) !important;\n    }\n\n    .has-blush-light-purple-gradient-background {\n      background: var(--wp--preset--gradient--blush-light-purple) !important;\n    }\n\n    .has-blush-bordeaux-gradient-background {\n      background: var(--wp--preset--gradient--blush-bordeaux) !important;\n    }\n\n    .has-luminous-dusk-gradient-background {\n      background: var(--wp--preset--gradient--luminous-dusk) !important;\n    }\n\n    .has-pale-ocean-gradient-background {\n      background: var(--wp--preset--gradient--pale-ocean) !important;\n    }\n\n    .has-electric-grass-gradient-background {\n      background: var(--wp--preset--gradient--electric-grass) !important;\n    }\n\n    .has-midnight-gradient-background {\n      background: var(--wp--preset--gradient--midnight) !important;\n    }\n\n    .has-small-font-size {\n      font-size: var(--wp--preset--font-size--small) !important;\n    }\n\n    .has-medium-font-size {\n      font-size: var(--wp--preset--font-size--medium) !important;\n    }\n\n    .has-large-font-size {\n      font-size: var(--wp--preset--font-size--large) !important;\n    }\n\n    .has-x-large-font-size {\n      font-size: var(--wp--preset--font-size--x-large) !important;\n    }\n\n    .wp-block-navigation a:where(:not(.wp-element-button)) {\n      color: inherit;\n    }\n\n    :where(.wp-block-post-template.is-layout-flex) {\n      gap: 1.25em;\n    }\n\n    :where(.wp-block-post-template.is-layout-grid) {\n      gap: 1.25em;\n    }\n\n    :where(.wp-block-columns.is-layout-flex) {\n      gap: 2em;\n    }\n\n    :where(.wp-block-columns.is-layout-grid) {\n      gap: 2em;\n    }\n\n    .wp-block-pullquote {\n      font-size: 1.5em;\n      line-height: 1.6;\n    }\n  ',
        }}
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='dashicons-css'
        href='https://modulabs.co.kr/wp-includes/css/dashicons.min.css?ver=1628740980'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='wp-jquery-ui-dialog-css'
        href='https://modulabs.co.kr/wp-includes/css/jquery-ui-dialog.min.css?ver=1628740980'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='jquery-ui-style-css'
        href='https://modulabs.co.kr/wp-content/themes/modustudy/assets/jquery-ui/jquery-ui.css?ver=1631620542'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='jquery-ui-theme-style-css'
        href='https://modulabs.co.kr/wp-content/themes/modustudy/assets/jquery-ui/jquery-ui.theme.css?ver=1631620543'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='modulabs-mypage-design-style-css'
        href='https://modulabs.co.kr/wp-content/plugins/modulabs-mypage/assets/css/modulabs-mypage-design.css?ver=1683359408'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='modulabs-mypage-dev-style-css'
        href='https://modulabs.co.kr/wp-content/plugins/modulabs-mypage/assets/css/modulabs-mypage-dev.css?ver=1648551766'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='woocommerce-layout-css'
        href='https://modulabs.co.kr/wp-content/plugins/woocommerce/assets/css/woocommerce-layout.css?ver=1674568673'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='woocommerce-smallscreen-css'
        href='https://modulabs.co.kr/wp-content/plugins/woocommerce/assets/css/woocommerce-smallscreen.css?ver=1674568673'
        type='text/css'
        media='only screen and (max-width: 768px)'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='woocommerce-general-css'
        href='https://modulabs.co.kr/wp-content/plugins/woocommerce/assets/css/woocommerce.css?ver=1674568673'
        type='text/css'
        media='all'
      />
      <style
        id='woocommerce-inline-inline-css'
        type='text/css'
        dangerouslySetInnerHTML={{
          __html:
            '\n    .woocommerce form .form-row .required {\n      visibility: visible;\n    }\n  ',
        }}
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='parent-style-css'
        href='https://modulabs.co.kr/wp-content/themes/Divi/style.css?ver=1652972289'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='divi-style-css'
        href='https://modulabs.co.kr/wp-content/themes/modustudy/style.css?ver=1694386517'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='theme-customizer-additional-style-css'
        href='https://modulabs.co.kr/wp-content/themes/modustudy/assets/css/mlf-divi-customizer-additional.css?ver=1671969865'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='mlf-style-css'
        href='https://modulabs.co.kr/wp-content/themes/modustudy/assets/css/mlf-style.css?ver=1659102720'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='child-style-css'
        href='https://modulabs.co.kr/wp-content/themes/modustudy/assets/css/child.css?ver=1556792573'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='modulabs-tax-style-css'
        href='https://modulabs.co.kr/wp-content/themes/modustudy/assets/css/modulabs.css?ver=1669136796'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='et-gf-korean-css'
        href='//fonts.googleapis.com/earlyaccess/hanna.css?ver=1697265628'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='divi_cpt_layout_injector-styles-css'
        href='https://modulabs.co.kr/wp-content/plugins/divi_cpt_layout_injector/styles/style.min.css?ver=1628858496'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='um_fonticons_ii-css'
        href='https://modulabs.co.kr/wp-content/plugins/ultimate-member/assets/css/um-fonticons-ii.css?ver=1688437988'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='um_fonticons_fa-css'
        href='https://modulabs.co.kr/wp-content/plugins/ultimate-member/assets/css/um-fonticons-fa.css?ver=1688437988'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='select2-css'
        href='https://modulabs.co.kr/wp-content/plugins/ultimate-member/assets/css/select2/select2.min.css?ver=1688437988'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='um_crop-css'
        href='https://modulabs.co.kr/wp-content/plugins/ultimate-member/assets/css/um-crop.css?ver=1688437988'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='um_modal-css'
        href='https://modulabs.co.kr/wp-content/plugins/ultimate-member/assets/css/um-modal.css?ver=1688437988'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='um_styles-css'
        href='https://modulabs.co.kr/wp-content/plugins/ultimate-member/assets/css/um-styles.css?ver=1688437988'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='um_profile-css'
        href='https://modulabs.co.kr/wp-content/plugins/ultimate-member/assets/css/um-profile.css?ver=1688437988'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='um_account-css'
        href='https://modulabs.co.kr/wp-content/plugins/ultimate-member/assets/css/um-account.css?ver=1688437988'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='um_misc-css'
        href='https://modulabs.co.kr/wp-content/plugins/ultimate-member/assets/css/um-misc.css?ver=1688437988'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='um_fileupload-css'
        href='https://modulabs.co.kr/wp-content/plugins/ultimate-member/assets/css/um-fileupload.css?ver=1688437988'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='um_datetime-css'
        href='https://modulabs.co.kr/wp-content/plugins/ultimate-member/assets/css/pickadate/default.css?ver=1688437988'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='um_datetime_date-css'
        href='https://modulabs.co.kr/wp-content/plugins/ultimate-member/assets/css/pickadate/default.date.css?ver=1688437988'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='um_datetime_time-css'
        href='https://modulabs.co.kr/wp-content/plugins/ultimate-member/assets/css/pickadate/default.time.css?ver=1688437988'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='um_raty-css'
        href='https://modulabs.co.kr/wp-content/plugins/ultimate-member/assets/css/um-raty.css?ver=1688437988'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='um_scrollbar-css'
        href='https://modulabs.co.kr/wp-content/plugins/ultimate-member/assets/css/simplebar.css?ver=1688437988'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='um_tipsy-css'
        href='https://modulabs.co.kr/wp-content/plugins/ultimate-member/assets/css/um-tipsy.css?ver=1688437988'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='um_responsive-css'
        href='https://modulabs.co.kr/wp-content/plugins/ultimate-member/assets/css/um-responsive.css?ver=1688437988'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='um_default_css-css'
        href='https://modulabs.co.kr/wp-content/plugins/ultimate-member/assets/css/um-old-default.css?ver=1688437988'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='sb_et_cpt_li_css-css'
        href='https://modulabs.co.kr/wp-content/plugins/divi_cpt_layout_injector/styles/style.min.css?ver=1628858496'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='sb_et_tax_li_css-css'
        href='https://modulabs.co.kr/wp-content/plugins/divi_taxonomy_layout_injector/style.css?ver=1547714794'
        type='text/css'
        media='all'
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='sb_et_woo_li_css-css'
        href='https://modulabs.co.kr/wp-content/plugins/divi_woo_layout_injector/includes/css/style.css?ver=1628858454'
        type='text/css'
        media='all'
      />
      <style
        type='text/css'
        dangerouslySetInnerHTML={{
          __html: '\n    .um_request_name {\n      display: none !important;\n    }\n  ',
        }}
      />
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link
        rel='stylesheet'
        id='font-awesome'
        href='//netdna.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css'
        type='text/css'
        media='all'
      />
      <style
        id='et-divi-customizer-global-cached-inline-styles'
        dangerouslySetInnerHTML={{
          __html:
            "\n    body,\n    .et_pb_column_1_2 .et_quote_content blockquote cite,\n    .et_pb_column_1_2 .et_link_content a.et_link_main_url,\n    .et_pb_column_1_3 .et_quote_content blockquote cite,\n    .et_pb_column_3_8 .et_quote_content blockquote cite,\n    .et_pb_column_1_4 .et_quote_content blockquote cite,\n    .et_pb_blog_grid .et_quote_content blockquote cite,\n    .et_pb_column_1_3 .et_link_content a.et_link_main_url,\n    .et_pb_column_3_8 .et_link_content a.et_link_main_url,\n    .et_pb_column_1_4 .et_link_content a.et_link_main_url,\n    .et_pb_blog_grid .et_link_content a.et_link_main_url,\n    body .et_pb_bg_layout_light .et_pb_post p,\n    body .et_pb_bg_layout_dark .et_pb_post p {\n      font-size: 15px\n    }\n\n    .et_pb_slide_content,\n    .et_pb_best_value {\n      font-size: 17px\n    }\n\n    body {\n      color: #232323\n    }\n\n    h1,\n    h2,\n    h3,\n    h4,\n    h5,\n    h6 {\n      color: #232323\n    }\n\n    .woocommerce #respond input#submit,\n    .woocommerce-page #respond input#submit,\n    .woocommerce #content input.button,\n    .woocommerce-page #content input.button,\n    .woocommerce-message,\n    .woocommerce-error,\n    .woocommerce-info {\n      background: #ec185e !important\n    }\n\n    #et_search_icon:hover,\n    .mobile_menu_bar:before,\n    .mobile_menu_bar:after,\n    .et_toggle_slide_menu:after,\n    .et-social-icon a:hover,\n    .et_pb_sum,\n    .et_pb_pricing li a,\n    .et_pb_pricing_table_button,\n    .et_overlay:before,\n    .entry-summary p.price ins,\n    .woocommerce div.product span.price,\n    .woocommerce-page div.product span.price,\n    .woocommerce #content div.product span.price,\n    .woocommerce-page #content div.product span.price,\n    .woocommerce div.product p.price,\n    .woocommerce-page div.product p.price,\n    .woocommerce #content div.product p.price,\n    .woocommerce-page #content div.product p.price,\n    .et_pb_member_social_links a:hover,\n    .woocommerce .star-rating span:before,\n    .woocommerce-page .star-rating span:before,\n    .et_pb_widget li a:hover,\n    .et_pb_filterable_portfolio .et_pb_portfolio_filters li a.active,\n    .et_pb_filterable_portfolio .et_pb_portofolio_pagination ul li a.active,\n    .et_pb_gallery .et_pb_gallery_pagination ul li a.active,\n    .wp-pagenavi span.current,\n    .wp-pagenavi a:hover,\n    .nav-single a,\n    .tagged_as a,\n    .posted_in a {\n      color: #ec185e\n    }\n\n    .et_pb_contact_submit,\n    .et_password_protected_form .et_submit_button,\n    .et_pb_bg_layout_light .et_pb_newsletter_button,\n    .comment-reply-link,\n    .form-submit .et_pb_button,\n    .et_pb_bg_layout_light .et_pb_promo_button,\n    .et_pb_bg_layout_light .et_pb_more_button,\n    .woocommerce a.button.alt,\n    .woocommerce-page a.button.alt,\n    .woocommerce button.button.alt,\n    .woocommerce button.button.alt.disabled,\n    .woocommerce-page button.button.alt,\n    .woocommerce-page button.button.alt.disabled,\n    .woocommerce input.button.alt,\n    .woocommerce-page input.button.alt,\n    .woocommerce #respond input#submit.alt,\n    .woocommerce-page #respond input#submit.alt,\n    .woocommerce #content input.button.alt,\n    .woocommerce-page #content input.button.alt,\n    .woocommerce a.button,\n    .woocommerce-page a.button,\n    .woocommerce button.button,\n    .woocommerce-page button.button,\n    .woocommerce input.button,\n    .woocommerce-page input.button,\n    .et_pb_contact p input[type=\"checkbox\"]:checked+label i:before,\n    .et_pb_bg_layout_light.et_pb_module.et_pb_button {\n      color: #ec185e\n    }\n\n    .footer-widget h4 {\n      color: #ec185e\n    }\n\n    .et-search-form,\n    .nav li ul,\n    .et_mobile_menu,\n    .footer-widget li:before,\n    .et_pb_pricing li:before,\n    blockquote {\n      border-color: #ec185e\n    }\n\n    .et_pb_counter_amount,\n    .et_pb_featured_table .et_pb_pricing_heading,\n    .et_quote_content,\n    .et_link_content,\n    .et_audio_content,\n    .et_pb_post_slider.et_pb_bg_layout_dark,\n    .et_slide_in_menu_container,\n    .et_pb_contact p input[type=\"radio\"]:checked+label i:before {\n      background-color: #ec185e\n    }\n\n    .container,\n    .et_pb_row,\n    .et_pb_slider .et_pb_container,\n    .et_pb_fullwidth_section .et_pb_title_container,\n    .et_pb_fullwidth_section .et_pb_title_featured_container,\n    .et_pb_fullwidth_header:not(.et_pb_fullscreen) .et_pb_fullwidth_header_container {\n      max-width: 1200px\n    }\n\n    .et_boxed_layout #page-container,\n    .et_boxed_layout.et_non_fixed_nav.et_transparent_nav #page-container #top-header,\n    .et_boxed_layout.et_non_fixed_nav.et_transparent_nav #page-container #main-header,\n    .et_fixed_nav.et_boxed_layout #page-container #top-header,\n    .et_fixed_nav.et_boxed_layout #page-container #main-header,\n    .et_boxed_layout #page-container .container,\n    .et_boxed_layout #page-container .et_pb_row {\n      max-width: 1360px\n    }\n\n    a {\n      color: #ec185e\n    }\n\n    #top-header,\n    #et-secondary-nav li ul {\n      background-color: #ffffff\n    }\n\n    #top-header,\n    #top-header a {\n      color: #757575\n    }\n\n    #et-secondary-nav li ul a {\n      color: rgba(0, 0, 0, 0.6)\n    }\n\n    .et_header_style_centered .mobile_nav .select_page,\n    .et_header_style_split .mobile_nav .select_page,\n    .et_nav_text_color_light #top-menu>li>a,\n    .et_nav_text_color_dark #top-menu>li>a,\n    #top-menu a,\n    .et_mobile_menu li a,\n    .et_nav_text_color_light .et_mobile_menu li a,\n    .et_nav_text_color_dark .et_mobile_menu li a,\n    #et_search_icon:before,\n    .et_search_form_container input,\n    span.et_close_search_field:after,\n    #et-top-navigation .et-cart-info {\n      color: #000000\n    }\n\n    .et_search_form_container input::-moz-placeholder {\n      color: #000000\n    }\n\n    .et_search_form_container input::-webkit-input-placeholder {\n      color: #000000\n    }\n\n    .et_search_form_container input:-ms-input-placeholder {\n      color: #000000\n    }\n\n    #main-header .nav li ul a {\n      color: rgba(0, 0, 0, 0.6)\n    }\n\n    #top-header,\n    #top-header a,\n    #et-secondary-nav li li a,\n    #top-header .et-social-icon a:before {\n      font-size: 13px\n    }\n\n    #top-menu li a {\n      font-size: 17px\n    }\n\n    body.et_vertical_nav .container.et_search_form_container .et-search-form input {\n      font-size: 17px !important\n    }\n\n    #top-menu li.current-menu-ancestor>a,\n    #top-menu li.current-menu-item>a,\n    #top-menu li.current_page_item>a,\n    .et_color_scheme_red #top-menu li.current-menu-ancestor>a,\n    .et_color_scheme_red #top-menu li.current-menu-item>a,\n    .et_color_scheme_red #top-menu li.current_page_item>a,\n    .et_color_scheme_pink #top-menu li.current-menu-ancestor>a,\n    .et_color_scheme_pink #top-menu li.current-menu-item>a,\n    .et_color_scheme_pink #top-menu li.current_page_item>a,\n    .et_color_scheme_orange #top-menu li.current-menu-ancestor>a,\n    .et_color_scheme_orange #top-menu li.current-menu-item>a,\n    .et_color_scheme_orange #top-menu li.current_page_item>a,\n    .et_color_scheme_green #top-menu li.current-menu-ancestor>a,\n    .et_color_scheme_green #top-menu li.current-menu-item>a,\n    .et_color_scheme_green #top-menu li.current_page_item>a {\n      color: #ec185e\n    }\n\n    #main-footer {\n      background-color: #efefef\n    }\n\n    #footer-widgets .footer-widget a,\n    #footer-widgets .footer-widget li a,\n    #footer-widgets .footer-widget li a:hover {\n      color: rgba(0, 0, 0, 0.5)\n    }\n\n    .footer-widget {\n      color: #7a7a7a\n    }\n\n    #main-footer .footer-widget h4 {\n      color: #111111\n    }\n\n    .footer-widget li:before {\n      border-color: #eaeaea\n    }\n\n    .footer-widget,\n    .footer-widget li,\n    .footer-widget li a,\n    #footer-info {\n      font-size: 14px\n    }\n\n    .footer-widget h4 {\n      font-weight: normal;\n      font-style: normal;\n      text-transform: uppercase;\n      text-decoration: none\n    }\n\n    .footer-widget .et_pb_widget div,\n    .footer-widget .et_pb_widget ul,\n    .footer-widget .et_pb_widget ol,\n    .footer-widget .et_pb_widget label {\n      line-height: 1.2em\n    }\n\n    #footer-widgets .footer-widget li:before {\n      top: 5.4px\n    }\n\n    .bottom-nav,\n    .bottom-nav a,\n    .bottom-nav li.current-menu-item a {\n      color: #666666\n    }\n\n    #et-footer-nav .bottom-nav li.current-menu-item a {\n      color: #666666\n    }\n\n    #footer-bottom {\n      background-color: #dfdfdf\n    }\n\n    #footer-info,\n    #footer-info a {\n      color: rgba(0, 0, 0, 0.49)\n    }\n\n    #footer-bottom .et-social-icon a {\n      color: #7f7f7f\n    }\n\n    body .et_pb_button,\n    .woocommerce a.button.alt,\n    .woocommerce-page a.button.alt,\n    .woocommerce button.button.alt,\n    .woocommerce button.button.alt.disabled,\n    .woocommerce-page button.button.alt,\n    .woocommerce-page button.button.alt.disabled,\n    .woocommerce input.button.alt,\n    .woocommerce-page input.button.alt,\n    .woocommerce #respond input#submit.alt,\n    .woocommerce-page #respond input#submit.alt,\n    .woocommerce #content input.button.alt,\n    .woocommerce-page #content input.button.alt,\n    .woocommerce a.button,\n    .woocommerce-page a.button,\n    .woocommerce button.button,\n    .woocommerce-page button.button,\n    .woocommerce input.button,\n    .woocommerce-page input.button,\n    .woocommerce #respond input#submit,\n    .woocommerce-page #respond input#submit,\n    .woocommerce #content input.button,\n    .woocommerce-page #content input.button,\n    .woocommerce-message a.button.wc-forward {\n      font-size: 17px;\n      border-width: 1px !important;\n      border-radius: 1px\n    }\n\n    body.et_pb_button_helper_class .et_pb_button,\n    body.et_pb_button_helper_class .et_pb_module.et_pb_button,\n    .woocommerce.et_pb_button_helper_class a.button.alt,\n    .woocommerce-page.et_pb_button_helper_class a.button.alt,\n    .woocommerce.et_pb_button_helper_class button.button.alt,\n    .woocommerce.et_pb_button_helper_class button.button.alt.disabled,\n    .woocommerce-page.et_pb_button_helper_class button.button.alt,\n    .woocommerce-page.et_pb_button_helper_class button.button.alt.disabled,\n    .woocommerce.et_pb_button_helper_class input.button.alt,\n    .woocommerce-page.et_pb_button_helper_class input.button.alt,\n    .woocommerce.et_pb_button_helper_class #respond input#submit.alt,\n    .woocommerce-page.et_pb_button_helper_class #respond input#submit.alt,\n    .woocommerce.et_pb_button_helper_class #content input.button.alt,\n    .woocommerce-page.et_pb_button_helper_class #content input.button.alt,\n    .woocommerce.et_pb_button_helper_class a.button,\n    .woocommerce-page.et_pb_button_helper_class a.button,\n    .woocommerce.et_pb_button_helper_class button.button,\n    .woocommerce-page.et_pb_button_helper_class button.button,\n    .woocommerce.et_pb_button_helper_class input.button,\n    .woocommerce-page.et_pb_button_helper_class input.button,\n    .woocommerce.et_pb_button_helper_class #respond input#submit,\n    .woocommerce-page.et_pb_button_helper_class #respond input#submit,\n    .woocommerce.et_pb_button_helper_class #content input.button,\n    .woocommerce-page.et_pb_button_helper_class #content input.button {\n      color: #ffffff\n    }\n\n    body .et_pb_button:after,\n    .woocommerce a.button.alt:after,\n    .woocommerce-page a.button.alt:after,\n    .woocommerce button.button.alt:after,\n    .woocommerce-page button.button.alt:after,\n    .woocommerce input.button.alt:after,\n    .woocommerce-page input.button.alt:after,\n    .woocommerce #respond input#submit.alt:after,\n    .woocommerce-page #respond input#submit.alt:after,\n    .woocommerce #content input.button.alt:after,\n    .woocommerce-page #content input.button.alt:after,\n    .woocommerce a.button:after,\n    .woocommerce-page a.button:after,\n    .woocommerce button.button:after,\n    .woocommerce-page button.button:after,\n    .woocommerce input.button:after,\n    .woocommerce-page input.button:after,\n    .woocommerce #respond input#submit:after,\n    .woocommerce-page #respond input#submit:after,\n    .woocommerce #content input.button:after,\n    .woocommerce-page #content input.button:after {\n      font-size: 27.2px\n    }\n\n    body .et_pb_bg_layout_light.et_pb_button:hover,\n    body .et_pb_bg_layout_light .et_pb_button:hover,\n    body .et_pb_button:hover {\n      color: #ffffff !important;\n      border-radius: 1px\n    }\n\n    .woocommerce a.button.alt:hover,\n    .woocommerce-page a.button.alt:hover,\n    .woocommerce button.button.alt:hover,\n    .woocommerce button.button.alt.disabled:hover,\n    .woocommerce-page button.button.alt:hover,\n    .woocommerce-page button.button.alt.disabled:hover,\n    .woocommerce input.button.alt:hover,\n    .woocommerce-page input.button.alt:hover,\n    .woocommerce #respond input#submit.alt:hover,\n    .woocommerce-page #respond input#submit.alt:hover,\n    .woocommerce #content input.button.alt:hover,\n    .woocommerce-page #content input.button.alt:hover,\n    .woocommerce a.button:hover,\n    .woocommerce-page a.button:hover,\n    .woocommerce button.button:hover,\n    .woocommerce-page button.button:hover,\n    .woocommerce input.button:hover,\n    .woocommerce-page input.button:hover,\n    .woocommerce #respond input#submit:hover,\n    .woocommerce-page #respond input#submit:hover,\n    .woocommerce #content input.button:hover,\n    .woocommerce-page #content input.button:hover {\n      color: #ffffff !important;\n      border-radius: 1px\n    }\n\n    @media only screen and (min-width:981px) {\n      .et_pb_section {\n        padding: 3% 0\n      }\n\n      .et_pb_fullwidth_section {\n        padding: 0\n      }\n\n      .footer-widget h4 {\n        font-size: 16px\n      }\n\n      .et_header_style_left #et-top-navigation,\n      .et_header_style_split #et-top-navigation {\n        padding: 38px 0 0 0\n      }\n\n      .et_header_style_left #et-top-navigation nav>ul>li>a,\n      .et_header_style_split #et-top-navigation nav>ul>li>a {\n        padding-bottom: 38px\n      }\n\n      .et_header_style_split .centered-inline-logo-wrap {\n        width: 75px;\n        margin: -75px 0\n      }\n\n      .et_header_style_split .centered-inline-logo-wrap #logo {\n        max-height: 75px\n      }\n\n      .et_pb_svg_logo.et_header_style_split .centered-inline-logo-wrap #logo {\n        height: 75px\n      }\n\n      .et_header_style_centered #top-menu>li>a {\n        padding-bottom: 14px\n      }\n\n      .et_header_style_slide #et-top-navigation,\n      .et_header_style_fullscreen #et-top-navigation {\n        padding: 29px 0 29px 0 !important\n      }\n\n      .et_header_style_centered #main-header .logo_container {\n        height: 75px\n      }\n\n      #logo {\n        max-height: 30%\n      }\n\n      .et_pb_svg_logo #logo {\n        height: 30%\n      }\n\n      .et_header_style_centered.et_hide_primary_logo #main-header:not(.et-fixed-header) .logo_container,\n      .et_header_style_centered.et_hide_fixed_logo #main-header.et-fixed-header .logo_container {\n        height: 13.5px\n      }\n\n      .et-fixed-header#top-header,\n      .et-fixed-header#top-header #et-secondary-nav li ul {\n        background-color: #ffffff\n      }\n\n      .et-fixed-header #top-menu a,\n      .et-fixed-header #et_search_icon:before,\n      .et-fixed-header #et_top_search .et-search-form input,\n      .et-fixed-header .et_search_form_container input,\n      .et-fixed-header .et_close_search_field:after,\n      .et-fixed-header #et-top-navigation .et-cart-info {\n        color: #000000 !important\n      }\n\n      .et-fixed-header .et_search_form_container input::-moz-placeholder {\n        color: #000000 !important\n      }\n\n      .et-fixed-header .et_search_form_container input::-webkit-input-placeholder {\n        color: #000000 !important\n      }\n\n      .et-fixed-header .et_search_form_container input:-ms-input-placeholder {\n        color: #000000 !important\n      }\n\n      .et-fixed-header #top-menu li.current-menu-ancestor>a,\n      .et-fixed-header #top-menu li.current-menu-item>a,\n      .et-fixed-header #top-menu li.current_page_item>a {\n        color: #ec185e !important\n      }\n\n      .et-fixed-header#top-header a {\n        color: #757575\n      }\n    }\n\n    @media only screen and (min-width:1500px) {\n      .et_pb_row {\n        padding: 30px 0\n      }\n\n      .et_pb_section {\n        padding: 45px 0\n      }\n\n      .single.et_pb_pagebuilder_layout.et_full_width_page .et_post_meta_wrapper {\n        padding-top: 90px\n      }\n\n      .et_pb_fullwidth_section {\n        padding: 0\n      }\n    }\n\n    @media only screen and (max-width:767px) {\n      h1 {\n        font-size: 26px\n      }\n\n      h2,\n      .product .related h2,\n      .et_pb_column_1_2 .et_quote_content blockquote p {\n        font-size: 22px\n      }\n\n      h3 {\n        font-size: 18px\n      }\n\n      h4,\n      .et_pb_circle_counter h3,\n      .et_pb_number_counter h3,\n      .et_pb_column_1_3 .et_pb_post h2,\n      .et_pb_column_1_4 .et_pb_post h2,\n      .et_pb_blog_grid h2,\n      .et_pb_column_1_3 .et_quote_content blockquote p,\n      .et_pb_column_3_8 .et_quote_content blockquote p,\n      .et_pb_column_1_4 .et_quote_content blockquote p,\n      .et_pb_blog_grid .et_quote_content blockquote p,\n      .et_pb_column_1_3 .et_link_content h2,\n      .et_pb_column_3_8 .et_link_content h2,\n      .et_pb_column_1_4 .et_link_content h2,\n      .et_pb_blog_grid .et_link_content h2,\n      .et_pb_column_1_3 .et_audio_content h2,\n      .et_pb_column_3_8 .et_audio_content h2,\n      .et_pb_column_1_4 .et_audio_content h2,\n      .et_pb_blog_grid .et_audio_content h2,\n      .et_pb_column_3_8 .et_pb_audio_module_content h2,\n      .et_pb_column_1_3 .et_pb_audio_module_content h2,\n      .et_pb_gallery_grid .et_pb_gallery_item h3,\n      .et_pb_portfolio_grid .et_pb_portfolio_item h2,\n      .et_pb_filterable_portfolio_grid .et_pb_portfolio_item h2 {\n        font-size: 15px\n      }\n\n      .et_pb_slider.et_pb_module .et_pb_slides .et_pb_slide_description .et_pb_slide_title {\n        font-size: 39px\n      }\n\n      .woocommerce ul.products li.product h3,\n      .woocommerce-page ul.products li.product h3,\n      .et_pb_gallery_grid .et_pb_gallery_item h3,\n      .et_pb_portfolio_grid .et_pb_portfolio_item h2,\n      .et_pb_filterable_portfolio_grid .et_pb_portfolio_item h2,\n      .et_pb_column_1_4 .et_pb_audio_module_content h2 {\n        font-size: 13px\n      }\n\n      h5 {\n        font-size: 13px\n      }\n\n      h6 {\n        font-size: 12px\n      }\n\n      .et_pb_section {\n        padding: 4px 0\n      }\n\n      .et_pb_section.et_pb_fullwidth_section {\n        padding: 0\n      }\n\n      .et_pb_row,\n      .et_pb_column .et_pb_row_inner {\n        padding: 15px 0\n      }\n    }\n\n    h1,\n    h2,\n    h3,\n    h4,\n    h5,\n    h6 {\n      font-family: 'Poppins', Helvetica, Arial, Lucida, sans-serif\n    }\n\n    body,\n    input,\n    textarea,\n    select {\n      font-family: 'Poppins', Helvetica, Arial, Lucida, sans-serif\n    }\n\n    .et_pb_button {\n      font-family: 'Hanna', sans-serif\n    }\n\n    #main-header,\n    #et-top-navigation {\n      font-family: 'Poppins', Helvetica, Arial, Lucida, sans-serif\n    }\n\n    #top-header .container {\n      font-family: 'Hanna', sans-serif\n    }\n\n    .et_slide_in_menu_container,\n    .et_slide_in_menu_container .et-search-field {\n      font-family: 'Hanna', sans-serif\n    }\n\n    .et_pb_widget_area h4 {\n      font-size: 20px\n    }\n  ",
        }}
      />
      <div id='page-container'>
        <div id='et-boc' className='et-boc'>
          <div id='et-main-area'>
            <div id='main-content'>
              <article id='post-35831' className='post-35831 page type-page status-publish hentry'>
                <div className='entry-content'>
                  <div className='et-l et-l--post'>
                    <div className='et_builder_inner_content et_pb_gutters2'>
                      <div className='et_pb_section et_pb_section_0 et_section_regular'>
                        <div className='et_pb_row et_pb_row_0'>
                          <div className='et_pb_column et_pb_column_4_4 et_pb_column_0  et_pb_css_mix_blend_mode_passthrough et-last-child'>
                            <div className='et_pb_module et_pb_code et_pb_code_0'>
                              <div className='et_pb_code_inner'>
                                <div className='realProfileWrap'>
                                  <div className='realProfileBg'>
                                    <Image width='971' height='546' src={unsplash} alt='배경사진' />
                                  </div>
                                  <div className='realProfile'>
                                    <div className='realProfile_wrap pad_bot_0 border_none'>
                                      <div className='realProfilePic'>
                                        <Image
                                          width='200'
                                          height='200'
                                          src={profile}
                                          alt='프로필사진'
                                        />
                                      </div>
                                    </div>
                                    <div className='realProfile_wrap border_none'>
                                      <div className='realProfileInfo'>
                                        <h6 className='realProfileName'>유동민</h6>
                                        <p className='realProfileCon'>
                                          <span>소속</span>
                                          이직준비중
                                        </p>
                                        <p className='realProfileCon'>
                                          <span>직업</span>앱 개발자
                                        </p>
                                        <p className='realProfileCon'>
                                          <span>E-mail</span>
                                          ydm2790@gmail.com
                                        </p>
                                        <p className='realProfileCon'>
                                          <span>자기소개</span>
                                        </p>
                                        <p className='realProfileIntro'>
                                          평범하고 지루한걸 못 참는 버릇이 있어서 요리사였을 때나
                                          지금 개발에서나 하고 싶은 일은 일단 해보는 타입입니다.
                                          요리사로 일할 때도 쉬는 날에 다른 일 알바 해보고 사진 모델
                                          그림 모델, 마트 장난감 코너, 서빙 등등 이것저것 해봤어서
                                          다양한 경험을 들려드릴 수 있습니다 🤩
                                          뉴진스,고양이,맛집리뷰 등등 좋아합니다.
                                        </p>
                                        <p />
                                      </div>
                                    </div>
                                    <div className='realProfile_wrap'>
                                      <div className='realProfileTit'>
                                        <p>상세 프로필</p>
                                      </div>
                                      <div className='realProfileTxt'>
                                        <p className='realProfileCon'>
                                          전공은 서양요리, 20대 내내 했습니다. 소질과 열정은 있는데
                                          동작도 느리고 반응도 느려서 여러모로 고통 받았었지만,
                                          세계적인 셰프들의 영혼을 담은 원서들을 찾아 읽으면서 느낀
                                          게 많아서인지, 개발을 학습할 때도 가능한 한 원전을 찾아
                                          읽으려고 합니다. 필요한 도구가 있으면 만들어서 쓰는 걸
                                          좋아합니다. 탕수육도 개발 언어도 찍먹 좋아합니다. 1인 1묘
                                          가정의 가장입니다.
                                        </p>
                                      </div>
                                    </div>
                                    <div className='realProfile_wrap'>
                                      <div className='realProfileTit'>
                                        <p>모두연 활동내역</p>
                                      </div>
                                      <div className='realProfileTxt'>
                                        <p className='realProfileTxt_tit'>LAB</p>
                                        <p />
                                        <p className='realProfileTxt_tit'>풀잎스쿨</p>
                                        <p />
                                      </div>
                                    </div>
                                    <div className='realProfile_wrap'>
                                      <div className='realProfileTit'>
                                        <p>전공분야/보유기술</p>
                                      </div>
                                      <div className='realProfileTxt'>
                                        <p className='realProfileCon'>
                                          파이썬으로 개발에 입문해 장고, 스프링, 익스프레스 등의
                                          백엔드 개발과 리액트, 리액트 네이티브, 플러터 등의 프론트
                                          애플리케이션, 그 외 궁금한 건 다 해보는 편이라 이것저것
                                          써보기만 한 건 많은 것 같아요 😀
                                          <br />
                                          모듈 개발, 웹스크래퍼 개발, 자동화 스크립트 및 아이폰
                                          단축어 개발, GPT 잘 쓰는 법 관심 많습니다.
                                        </p>
                                      </div>
                                    </div>
                                    <div className='realProfile_wrap'>
                                      <div className='realProfileTit'>
                                        <p>SNS</p>
                                      </div>
                                      <div className='realProfileTxt'>
                                        <p className='realProfileCon'>
                                          <span>Blog</span>
                                          <a href={blog}>https://cat-minzzi.tistory.com/</a>
                                        </p>
                                        <p className='realProfileCon'>
                                          <span>homepage</span>
                                          <a href={homepage}>{homepage}</a>
                                        </p>
                                        <p className='realProfileCon'>
                                          <span>Facebook</span>
                                          <a href='세상돌아가는진지한얘기만공유함'>
                                            세상돌아가는진지한얘기만공유함
                                          </a>
                                        </p>
                                        <p className='realProfileCon'>
                                          <span>Instagram</span>
                                          <a href={instagram}>{instagram}</a>
                                        </p>
                                        <p className='realProfileCon'>
                                          <span>Twitter</span>
                                          <a href='뉴진스팔로우하는빈계정밖에없음'>
                                            뉴진스팔로우하는빈계정밖에없음
                                          </a>
                                        </p>
                                        <p className='realProfileCon'>
                                          <span>LinkedIn</span>
                                          <a href={linkedIn}>{linkedIn}</a>
                                        </p>
                                        <p className='realProfileCon'>
                                          <span>Github</span>
                                          <a href={github}>{github}</a>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
