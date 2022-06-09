import PropagateLoader from "react-spinners/PropagateLoader";
import s from "./Loader.module.css";


export default function Loader() {
  return (
    <div className={s.wrapper}>
      <div className={s.wrapper2}>
        <PropagateLoader color={"#3f51b5"} loading={true}  size={15} />
      </div>
    </div>
  );
}