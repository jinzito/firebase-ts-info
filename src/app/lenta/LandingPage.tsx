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
import InfoView from "../../components/info/InfoView";
import InfoEdit from "../../components/info/InfoEdit";

interface ReduxStateProps {
  isAdmin?: boolean;
}

type Props = RouteComponentProps & ReduxStateProps & RouteProps;

enum EditableItem {
  EMPTY ,
  INFO,
  VOTE
}

const LandingPage:React.FC<Props> = ({isAdmin}: Props) => {

  const [votesList, setVotesList] = useState([]);
  const [infosList, setInfosList] = useState([]);

  const [editableItem, setEditableItem] = useState<EditableItem>(EditableItem.EMPTY)

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
            onClick={() => setEditableItem(EditableItem.INFO) }
          >
              Добавить новость
          </Button>
          <Button
            className="landing-page__button"
            variant="contained"
            onClick={() => setEditableItem(EditableItem.VOTE) }
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
        {votesList.map((voteVO, i) => <VoteView vote={voteVO} key={`vote-${i}`}/>)}
      </>
      <>
        {infosList.map((infoVO, i) => <InfoView info={infoVO} key={`info-${i}`}/>)}
      </>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  isAdmin: state?.auth?.isAdmin,
});

const LandingPageConnected = connect(mapStateToProps)(withRouter(LandingPage));

export default LandingPageConnected;