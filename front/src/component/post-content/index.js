import { memo } from "react";
import "./index.css";

import Grid from "../grid";
function Component({ username, date, text }) {
  return (
    <Grid>
      <div className="post-content">
        <span className="post-content__username">@{username}</span>
        <span classame="post-content__date">{date}</span>
      </div>
      <p className="post-content__text">{text}</p>
    </Grid>
  );
}

export default memo(Component);
