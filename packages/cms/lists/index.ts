import SystemUser from './SystemUser'
import Photo from './Photo'
import Party from './Party'
import LegislativeMeeting from './LegislativeMeeting'
import LegislativeMeetingSession from './LegislativeMeetingSession'
import Legislator from './Legislator'
import LegislativeYuanMember from './LegislativeYuanMember'
import Committee from './Committee'
import Topic from './Topic'
import Speech from './Speech'
import CommitteeMember from './CommitteeMember'
import Selected from './Selected'
import ImportRecord from './ImportRecord'
import Councilor from './Councilor'
import CouncilMeeting from './CouncilMeeting'
import CouncilMember from './CouncilMember'
import CouncilTopic from './CouncilTopic'
import CouncilBill from './CouncilBill'
import CouncilSpeech from './CouncilSpeech'
import CouncilImportRecord from './CouncilImportRecord'
import Member from './Member'
import {
  memberFavoriteList,
  memberFavoriteComboList,
} from './utils/member-favorite'

export const listDefinition = {
  SystemUser,
  Member,
  MemberFavoriteCouncilMember: memberFavoriteList(
    'CouncilMember',
    '議員屆資',
    'labelForCMS'
  ),
  MemberFavoriteLegislativeYuanMember: memberFavoriteList(
    'LegislativeYuanMember',
    '立委屆資',
    'labelForCMS'
  ),
  MemberFavoriteSpeech: memberFavoriteList('Speech', '立法院逐字稿', 'title'),
  MemberFavoriteCouncilSpeech: memberFavoriteList(
    'CouncilSpeech',
    '縣市逐字稿',
    'title'
  ),
  MemberFavoriteCouncilBill: memberFavoriteList(
    'CouncilBill',
    '縣市議案',
    'title'
  ),
  MemberFavoriteTopicLegislator: memberFavoriteComboList('TopicLegislator'),
  MemberFavoriteCouncilTopicCouncilor: memberFavoriteComboList(
    'CouncilTopicCouncilor'
  ),
  Photo,
  Selected,
  Speech,
  Topic,
  Legislator,
  LegislativeYuanMember,
  LegislativeMeeting,
  LegislativeMeetingSession,
  Committee,
  CommitteeMember,
  CouncilSpeech,
  CouncilBill,
  CouncilTopic,
  Councilor,
  CouncilMember,
  CouncilMeeting,
  Party,
  ImportRecord,
  CouncilImportRecord,
}
