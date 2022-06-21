import s from './Footer.module.scss';
import g from './../../App.module.scss';

export const Footer = () => {
  return (
    <footer className={`${g.wrapper} ${s.footer}`}>
      <a href="https://rs.school/">
        <img
          className={s.rs_logo}
          src="https://rs.school/images/rs_school_js.svg"
          alt="rs.school logo"
        />
      </a>
      <div className={s.copyright}>
        <p className={s.copyright__text}>(c)2022</p>
        <a href="https://github.com/l1irik-rbk">
          <img
            className={s.avatar}
            src="https://avatars.githubusercontent.com/u/36926728"
            alt="avatar l1irik-rbk"
          />
        </a>
        <a href="https://github.com/u1f5a4">
          <img
            className={s.avatar}
            src="https://avatars.githubusercontent.com/u/73600007"
            alt="avatar u1f5a4"
          />
        </a>
      </div>
    </footer>
  );
};
