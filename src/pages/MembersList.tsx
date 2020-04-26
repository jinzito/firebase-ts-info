import React, { useEffect, useState } from "react";
import { firestore } from "firebase";
import { MemberVO } from "../app/model";
import MaterialTable from "material-table";
import { isEmpty } from "lodash";

import './MembersList.scss';
import { createMember, updateMember, deleteMember } from "../config/firebase";

const MembersList: React.FC = () => {

  const [list, setList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const onAddMember = async (newData: MemberVO): Promise<any> => {
    const { apt, aptSquare, house, phoneNumber } = newData || {};
    if (isEmpty(apt) || isEmpty(aptSquare) || isEmpty(house) || isEmpty(phoneNumber)) {
      throw new Error("missed some Members params");
    }
    try {
      setIsLoading(true);
      const result = await createMember(newData);
      return new Promise((resolve) => {
        setList([...list, result?.data]);
        setIsLoading(false);
        resolve();
      });
    } catch (e) {
      setIsLoading(false);
      setErrorMessage(e.message);
    }
  };

  const onUpdateMember = async (newData: MemberVO): Promise<any> => {
    const { apt, aptSquare, house, phoneNumber } = newData || {};
    if (isEmpty(apt) || isEmpty(aptSquare) || isEmpty(house) || isEmpty(phoneNumber)) {
      throw new Error("missed some Members params");
    }
    try {
      setIsLoading(true);
      const result = await updateMember(newData);
      return new Promise((resolve) => {
        const updatedMember: MemberVO = result?.data;
        const newList: MemberVO[] = list.map(m => m.uid === updatedMember.uid ? updatedMember : m);
        setList(newList);
        setIsLoading(false);
        resolve();
      });
    } catch (e) {
      setIsLoading(false);
      setErrorMessage(e.message);
    }
  };

  const onDeleteMember = async(data: MemberVO): Promise<any> => {
    const { uid } = data || {};
    try {
      setIsLoading(true);
      const result = await deleteMember(uid);
      return new Promise((resolve) => {
        const deletedUid: string = result?.data;
        const newList: MemberVO[] = list.filter((m => m.uid !== deletedUid));
        setList(newList);
        setIsLoading(false);
        resolve();
      });
    } catch (e) {
      setErrorMessage(e.message);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      const result: MemberVO[] = [];
      try {
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
        paging: false,
        addRowPosition: "first",
        loadingType: "linear",
        draggable: false
      }}
      columns={[
        { title: "Phone", field: "phoneNumber" },
        { title: "Name", field: "displayName" },
        { title: "House", field: "house", lookup: { 5: "5", 6: "6", 7: "7" } },
        { title: "Apt", field: "apt", type: "numeric" },
        { title: "AptSquare", field: "aptSquare", type: "numeric" },
        { title: "admin", field: "isAdmin", type: "boolean" },
        { title: "curator", field: "isCurator", type: "boolean" },
        { title: "member", field: "isMember", type: "boolean", initialEditValue: true },
      ]}
      data={list}
      editable={{
        isEditable: () => true,
        onRowAdd: (data) => onAddMember(data),
        onRowUpdate: (data) => onUpdateMember(data),
        onRowDelete: (data) => onDeleteMember(data)
      }}
    />
  </div>);
};

export { MembersList };


