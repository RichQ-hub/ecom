import React from 'react';

const TitleHeaderLayout = ({ children, title }: { children: React.ReactNode; title: string }) => {
  return (
    <>
      <div className="h-20 bg-ecom-header-blue font-title text-ecom-light-blue font-bold flex items-center text-4xl px-14 shadow-ecom-header">
        <h1>{title}</h1>
      </div>
      <main className="py-10 px-14">{children}</main>
    </>
  );
};

export default TitleHeaderLayout;
