import { useState, useReducer, memo, useCallback } from "react";
import "./index.css";
import {
  requestInitialState,
  requestReducer,
  REQUEST_ACTION_TYPE,
} from "../../util/request";

import FieldForm from "../../component/fieldform";
import Grid from "../../component/grid";

import { Alert, Loader, LOAD_STATUS } from "../../component/load";

function Container({ onCreate, placeholder, button, id = null }) {
  const [state, dispatch] = useReducer(requestReducer, requestInitialState);

  const convertData = useCallback(
    ({ value }) =>
      JSON.stringify({
        text: value,
        username: "user",
        postId: id,
      }),
    [id]
  );

  const sendData = useCallback(
    async (dataToSend) => {
      dispatch({ type: REQUEST_ACTION_TYPE.PROGRESS });

      try {
        const res = await fetch("http://localhost:4000/post-create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: convertData(dataToSend),
        });

        const data = await res.json();

        if (res.ok) {
          dispatch({ type: REQUEST_ACTION_TYPE.RESET });
          if (onCreate) onCreate();
        } else {
          dispatch({ type: REQUEST_ACTION_TYPE.ERROR, message: data.message });
        }
      } catch (error) {
        dispatch({ type: REQUEST_ACTION_TYPE.ERROR, message: error.message });
      }
    },
    [convertData, onCreate]
  );

  const handleSubmit = useCallback(
    (value) => {
      return sendData({ value });
    },
    [sendData]
  );
  return (
    <Grid>
      <FieldForm
        placeholder={placeholder}
        button={button}
        onSubmit={handleSubmit}
      />
      {state.status === LOAD_STATUS.ERROR && (
        <Alert status={state.status} message={state.message} />
      )}
      {state.status === LOAD_STATUS.PROGRESS && <Loader />}
    </Grid>
  );
}

export default memo(Container, (prev, next) => {
  return true;
});
