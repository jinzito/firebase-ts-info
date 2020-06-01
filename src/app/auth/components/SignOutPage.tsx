import React, { useEffect } from 'react';
import { auth } from 'firebase/app';

const SignOutPage = () => {

  useEffect(() => {
    (async () => {
      try {
        await auth().signOut();
      } catch (e) {
        console.log("error", e);
      }
    })();
  }, []);


  return (
    <div>
      <h3>Выходим из системы...</h3>
    </div>
  )
};

export { SignOutPage };