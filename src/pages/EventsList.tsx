import React, { useEffect, useState } from 'react';
import { firestore } from 'firebase';

const EventsList: React.FC = () => {

  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const qs: firestore.QuerySnapshot = await firestore().collection('cities').get();
        const result = [];
        qs.forEach((doc) => {
          result.push({ ...doc.data()});
        });
        setList(result);
      } catch (e) {
        console.log("error:", e);
        setList([]);
      }
    })();
  }, []);

  return (<div>
    <h1>Events:{list?.length}</h1>
    {list.forEach(event =>
      <div>
        <li>
          {event?.name || "untitled"}
        </li>
      </div>
    )}
  </div>);
};

export { EventsList };