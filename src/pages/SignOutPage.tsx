import React, { useEffect } from 'react';
import { auth } from 'firebase/app';

const SignOutPage = () => {

  useEffect(() => {
    (async () => {
      try {
        await auth().signOut();
        console.log("currentUser:", auth().currentUser);
      } catch (e) {
        console.log("error", e);
      }
    })();
  }, []);


  return (
    <div>
      <h1>SignOut</h1>
    </div>
  )
};

export { SignOutPage };