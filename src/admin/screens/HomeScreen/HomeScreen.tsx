import React from 'react';

export const HomeScreen: React.FC = () => {
  return (
    <>
      <div className="app-content-title">
        <h1>Dashboard</h1>
        <form encType="multipart/form-data" action="/api/upload" method="post">
          <input type="file" name="ololo" />
          <button>upload</button>
        </form>
      </div>
    </>
  );
};
