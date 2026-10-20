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
  memberFollowingList,
  memberFollowingComboList,
  memberFollowingTopicList,
} from './utils/member-following'

export const listDefinition = {
  SystemUser,
  Member,
  MemberFollowingCouncilMember: memberFollowingList(
    'CouncilMember',
    '議員屆資',
    'labelForCMS'
  ),
  MemberFollowingLegislativeYuanMember: memberFollowingList(
    'LegislativeYuanMember',
    '立委屆資',
    'labelForCMS'
  ),
  MemberFollowingSpeech: memberFollowingList('Speech', '立法院逐字稿', 'title'),
  MemberFollowingCouncilSpeech: memberFollowingList(
    'CouncilSpeech',
    '縣市逐字稿',
    'title'
  ),
  MemberFollowingCouncilBill: memberFollowingList(
    'CouncilBill',
    '縣市議案',
    'title'
  ),
  MemberFollowingTopicLegislator: memberFollowingComboList('TopicLegislator'),
  MemberFollowingCouncilTopicCouncilor: memberFollowingComboList(
    'CouncilTopicCouncilor'
  ),
  MemberFollowingTopic: memberFollowingTopicList('Topic'),
  MemberFollowingCouncilTopic: memberFollowingTopicList('CouncilTopic'),
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
