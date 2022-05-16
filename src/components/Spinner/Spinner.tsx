import s from './Spinner.module.scss';

export function Spinner() {
  return (
    <div className={s.spinner}>
      <div className={s['spinner_content']}>
        <div className={s['spinner']}></div>
        <label className={s.spinner_text}>Please wait bro...</label>
      </div>
    </div>
  );
}
