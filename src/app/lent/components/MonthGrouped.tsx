import { ItemVO } from "./LandingPage";
import React from 'react';
import './DateLabel.scss';
import DateLabel from "./DateLabel";
import InfoView from "../../../components/info/InfoView";
import { InfoVO, VoteVO } from "../../model";
import VoteView from "../../../components/votes/VoteView";

export interface MonthGroupedVO {
  month: Date;
  items: ItemVO[];
}

interface MonthGroupedProps {
  group: MonthGroupedVO;
}

const MonthGrouped: React.FC<MonthGroupedProps> = ({ group }: MonthGroupedProps) =>
  <>
    <DateLabel date={group.month} />
    {group?.items.map((itemVO, i) => !!itemVO.date ?
      <InfoView info={itemVO as InfoVO} key={`item-${i}`} /> :
      <VoteView vote={itemVO as VoteVO} key={`item-${i}`} />
    )}
  </>;

export default MonthGrouped;