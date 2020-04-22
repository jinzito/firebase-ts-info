import React, { useEffect, useState } from "react";
import { firestore } from "firebase";
import { MemberVO } from "../app/model";
import MaterialTable from "material-table";
import { isEmpty } from "lodash";

import './MembersList.scss';


const membersRef = firestore().collection('members');
const addMember = (newData: MemberVO): Promise<any> => {

  const { apt, aptSquare, house, phone } = newData || {};

  if (isEmpty(apt) || isEmpty(aptSquare) || isEmpty(house) || isEmpty(phone)) {
    throw new Error("missed some Members params");
  }
  const id: string = `${house}-${apt}`;

  return membersRef.doc(id).set(newData);
};

const MembersList: React.FC = () => {

  const [list, setList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result: MemberVO[] = [];
      try {
        // tslint:disable:no-console
        // const qs: any = await firestore().collection('members').doc("6_145").get();
        // console.log("1qs:", qs.data());

        // const mm: any = await firestore().collection('phone_2_member_id').doc("+375291234567").get();
        // console.log(">mm:", mm.data());
        const mem: any = await firestore().collection('members').doc("+375293611358").get();
        console.log(">mem:", mem.data());

        const mem1: any = await firestore().collection('members').doc("+375291234567").get();
        console.log(">mem:", mem1.data());


        const qs: firestore.QuerySnapshot = await firestore().collection('members').get();
        qs.forEach((doc) => {
          result.push(doc.data() as MemberVO);
        });

      } catch (e) {
        setErrorMessage(e?.message);
      }
      setIsLoading(false);
      setList(result);

    })();
  }, []);

  return (<div>
    <div>{errorMessage}</div>
    <MaterialTable
      title="Members"
      isLoading={isLoading}
      options={{
        actionsColumnIndex: -1,
        paging: false
      }}
      columns={[
        { title: "Phone", field: "phone" },
        { title: "Name", field: "name" },
        { title: "House", field: "house", lookup: { 5: "5", 6: "6", 7: "7" } },
        { title: "Apt", field: "apt", type: "numeric" },
        { title: "AptSquare", field: "aptSquare", type: "numeric" },
        { title: "admin", field: "isAdmin", type: "boolean" },
        { title: "curator", field: "isCurator", type: "boolean" },
        { title: "member", field: "isMember", type: "boolean" },
      ]}
      data={list}
      editable={{
        isEditable: () => true,
        onRowAdd: addMember,
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 600);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 600);
          }),
      }}
    />
  </div>);
};

export { MembersList };


