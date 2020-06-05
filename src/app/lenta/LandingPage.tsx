import React, { useEffect, useState } from 'react';
import VoteEdit from "../../components/votes/VoteEdit";
import { getVotes, getInfos } from "../../config/firebase";
import { VoteVO, InfoVO } from "../model";
import VoteView from "../../components/votes/VoteView";
import { RootState } from "../../rootReducer";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps, RouteProps } from "react-router";
import './LandingPage.scss';
import Button from '@material-ui/core/Button';
import { AppRoutes } from "../../config/routes";
import InfoEdit from "../../components/info/InfoEdit";
import dateFormat from "dateformat";
import { Timestamp } from '@firebase/firestore-types';
import { keys } from 'lodash';
import MonthGrouped, { MonthGroupedVO } from "./MonthGrouped";
import {isEmpty} from "lodash";


interface ReduxStateProps {
  isAdmin?: boolean;
}

type Props = RouteComponentProps & ReduxStateProps & RouteProps;

enum EditableItem {
  EMPTY,
  INFO,
  VOTE
}

export type ItemVO = VoteVO | InfoVO;

const getMapKey = (t: Timestamp): string =>
  dateFormat(t.toDate(), "yyyy-mm");


const LandingPage: React.FC<Props> = ({ isAdmin }: Props) => {

  const [votesList, setVotesList] = useState<VoteVO[]>([]);
  const [infosList, setInfosList] = useState<InfoVO[]>([]);

  const [sortedList, setSortedList] = useState<MonthGroupedVO[]>([]);
  const [topItems, setTopItems] = useState<VoteVO[]>([]);

  const [editableItem, setEditableItem] = useState<EditableItem>(EditableItem.EMPTY);

  useEffect(() => {

    if (!isEmpty(votesList) && !isEmpty(infosList)) {
      console.log(">>>>");
    }
    const topItemsResult: VoteVO[] = [];
    const map: { [key: string]: MonthGroupedVO } = {};
    const nowInSeconds: number = new Date().getTime() / 1000;
    infosList.forEach(infoVO => {
      const mapKey: string = getMapKey(infoVO?.date);
      if (!!map[mapKey]) {
        map[mapKey].items.push(infoVO);
      } else {
        map[mapKey] = { month: infoVO?.date?.toDate(), items: [infoVO] };
      }
    });
    votesList.forEach(voteVO => {
      const isNotCompleted: boolean = voteVO.endDate.seconds - nowInSeconds > 0;
      if (isNotCompleted) {
        topItemsResult.push(voteVO);
      } else {
        const mapKey: string = getMapKey(voteVO?.endDate);
        if (!!map[mapKey]) {
          map[mapKey].items.push(voteVO);
        } else {
          map[mapKey] = { month: voteVO.endDate.toDate(), items: [voteVO] };
        }
      }
    });
    const result: MonthGroupedVO[] = keys(map)
      .map(key => map[key])
      .sort((a: MonthGroupedVO, b: MonthGroupedVO) => a.month > b.month);
    result.forEach(mg => mg.items.sort((a: ItemVO, b: ItemVO) => {
        const t1: Timestamp = a?.date || a?.endDate;
        const t2: Timestamp = b?.date || b?.endDate;
        return t1.seconds - t2.seconds;
      }
    ));
    setSortedList(result);
    setTopItems(topItemsResult);
  }, [votesList, infosList]);

  //TODO: move it to redux
  useEffect(() => {
    (async () => {
      try {
        const votesList: VoteVO[] = await getVotes();
        setVotesList(votesList);
      } catch (e) {
        console.log("error", e);
      }
    })();
    (async () => {
      try {
        const infosList: InfoVO[] = await getInfos();
        setInfosList(infosList);
      } catch (e) {
        console.log(">>> error", e);
      }
    })();
  }, []);

  return (
    <div className="landing-page">
      {isAdmin && (
        <div className="landing-page__buttons-bar">
          <Button
            className="landing-page__button"
            variant="contained"
            onClick={() => setEditableItem(EditableItem.INFO)}
          >
            Добавить новость
          </Button>
          <Button
            className="landing-page__button"
            variant="contained"
            onClick={() => setEditableItem(EditableItem.VOTE)}
          >
            Добавить голосвание
          </Button>
          <Button
            className="landing-page__button"
            variant="contained"
            href={AppRoutes.MEMBERS}
          >
            Список пользователей
          </Button>
        </div>
      )}
      {editableItem === EditableItem.VOTE && (
        <VoteEdit key="voteEdit" onCancel={() => setEditableItem(EditableItem.EMPTY)} />
      )}
      {editableItem === EditableItem.INFO && (
        <InfoEdit key="infoEdit" onCancel={() => setEditableItem(EditableItem.EMPTY)} />
      )}
      <>
      {topItems.map((voteVO, i) => <VoteView vote={voteVO} key={`top-vote-${i}`} />)}
      </>
      {sortedList.map((mg, i) =>
        <MonthGrouped group={mg} key={`mg-${i}`}/>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  isAdmin: state?.auth?.isAdmin,
});

const LandingPageConnected = connect(mapStateToProps)(withRouter(LandingPage));

export default LandingPageConnected;