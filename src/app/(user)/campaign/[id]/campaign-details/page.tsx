import React from 'react';
import SpaceRecap from './_sections/spaceRecap';
import SpaceFiles from './_sections/spaceFiles';

export default function Campaign() {
  return (
    <div className='space-y-20'>
      <SpaceRecap />
      <SpaceFiles />
    </div>
  );
}
