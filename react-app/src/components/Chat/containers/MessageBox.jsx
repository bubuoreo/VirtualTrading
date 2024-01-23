import { React, Fragment } from 'react';

const MessageBox = ({ userId, data }) => {
  let display;
  if (userId == data.emit) {
    display = (
      <Fragment>
        <a className="ui green right ribbon label">Me</a>
        <p>{data.msg}</p>
      </Fragment>
    );
  } else {
    display = (
      <Fragment>
        <a className="ui blue ribbon label">{data.name}</a>
        <p>{data.msg}</p>
      </Fragment>
    );
  }

  return (
    <div className="ui raised segment">
      {display}
    </div>
  );
};

export default MessageBox;