'use client'
import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
// @twreporter
import {
  DesktopAndAbove,
  TabletAndBelow,
} from '@twreporter/react-components/lib/rwd'
import { Report, Video } from '@twreporter/react-components/lib/icon'
import mq from '@twreporter/core/lib/utils/media-query'
// styles
import {
  SpeechContainer,
  LeadingContainer,
  IvodBlock,
  IvodSwitchBlock,
  IvodSwitchButtonContainer,
  P1Gray600,
  BodyContainer,
  AsideBlock,
  ContentBlock,
  Feedback,
  ControlTabContainer,
  ControlTab,
  DateAndTitle,
  ControlTabDate,
  ControlTabTitle,
  ControlItems,
  Spacing,
} from '@/components/speech/styles'
// components
import SpeechDate from '@/components/speech/speech-date'
import SpeechTitle from '@/components/speech/speech-title'
import SpeechAsideInfo from '@/components/speech/speech-aside-info'
import SpeechAsideToolBar from '@/components/speech/speech-aside-toolbar'
import SpeechSummary from '@/components/speech/speech-summary'
import SeparationCurve from '@/components/speech/separation-curve'
import SpeechContent from '@/components/speech/speech-content'
import SpeechMobileToolbar from '@/components/speech/speech-mobile-toolbar'
import IconButton from '@/components/button/icon-button'
import CustomPillButton from '@/components/button/pill-button'
// context
import { useScrollContext } from '@/contexts/scroll-context'
// lodash
import throttle from 'lodash/throttle'
const _ = {
  throttle,
}

const DesktopAndAboveWithFlex = styled(DesktopAndAbove)`
  ${mq.desktopAndAbove`
    display: flex !important;
    flex: 1;
  `}
`
const TabletAndBelowWithFlex = styled(TabletAndBelow)`
  ${mq.tabletAndBelow`
    display: flex !important;
  `}
`

const testSpeechData = {
  'test-1': {
    date: '2024/12/7',
    title: '行政院院長提出施政方針及施政報告並備質詢',
    legislator: { name: '邱臣遠', slug: 'legislator-1' },
    attendee: '列席質詢對象／陳建仁院長、農業部代理部長陳部長、衛福部薛部長',
    relatedTopics: [
      { title: '國會改革', slug: 'topic-1' },
      { title: '人工生殖法修法', slug: 'topic-2' },
      { title: '沈伯洋', slug: 'topic-3' },
      { title: '國家科技發展策略', slug: 'topic-4' },
      { title: '美中台關係', slug: 'topic-5' },
    ],
    summary:
      '邱臣遠質詢行政院院長施政方針及施政報告，提問內容包括國會改革、人工生殖法修法、沈伯洋案、國家科技發展策略、美中台關係等。',
    content: `邱委員臣遠：（11時5分）謝謝游院長，我們邀請行政院陳建仁院長、農業部代理部長陳部長以及衛福部薛部長。\n主席：陳院長請。\n陳院長建仁：邱委員早。\n邱委員臣遠：院長，我想這次雞蛋的事件，您稍早也作出道歉，雖然來得有點晚，不過我們還是肯定你的態度，但是我們必須還是要非常嚴正地來面對這次的問題。我想這次雞蛋的問題，我們先就教院長，今天最新的狀況就是勤億蛋品，就是在9月15號聲稱百分之百來源國為國產蛋的這個廠商，事實上後來在流向的追蹤上，發現了他實質購買了進口蛋1.6萬箱，高達600萬顆的巴西蛋，比台農買得還多，更被發現當時該篇聲稱百分之百國產蛋的這個聲明，其實昨天晚上9點已經從網路上下架了，請問現在目前院長有沒有掌握這個最新的狀況？\n陳院長建仁：我想任何的進口蛋，如果把它標示為國產蛋，這是不合法的，然後應該要立刻地下架。\n邱委員臣遠：立刻下架？所以你認為這是業者的標示不實，所以該罰就罰？\n陳院長建仁：當然啊！\n邱委員臣遠：當時他們配合國家的政策，在相關的，剛剛農業部的代理部長有提到，你們所謂的這個「實質轉型」，這是我們今年度聽到最奇葩的一個形容詞，你們當時沸沸揚揚講「雞蛋國家隊」，但是我在這次進口蛋的專案看到的是，不管是政府、廠商還是業者，甚至是進口上的、市場上的產銷的掌握都不足，才會造成這樣這麼多的破洞。第二個問題，我們看到現在地方政府人人自危。根據嘉義市衛生局調查稽查的結果，勤億公司3月到5月已經從菲律賓、土耳其、美國跟泰國總共進口了二百多萬顆殼蛋，而且已經全部做成洗選蛋售出了，但是卻對外還是宣稱是本土蛋，這中間有沒有標示不符的狀況？\n陳院長建仁：跟委員報告，他所用的進口蛋，實際上在政府專案進口之後，確實有23家的廠商也自行進口，不是透過這個專案進口，那他的這一些進口蛋實際上……\n邱委員臣遠：那你們當時都沒有辦法掌握這個數量嗎？除了專案進口的，一般的廠商在進口上，你們沒有辦法做一個總量管理嗎？\n陳院長建仁：我們不可能禁止廠商去……\n邱委員臣遠：不可能禁止，但是你可以掌握嘛，可以掌握吧？\n陳院長建仁：我們確實是……\n邱委員臣遠：而且現在的問題是，你進來了之後還要透過洗選、加工、延長效期，既然是這樣，那為什麼當時在進口的時候不以這些加工的為主？或者是本土的這些國產蛋以加工的為主，要把它混充到現在在食安上造成這麼大混淆的一個破口？\n陳院長建仁：以我們專案進口蛋進來的這個部分，確實到6月以後，我們就大部分都轉為加工蛋了，但是廠商自行進口的會進入殼蛋，這個時候因為他是自行進口，就完全要符合衛福部的規定。相關的標示都要符合規定，那這個標示規定講得很清楚，就是外國進口的蛋它的效期到什麼時候要標到什麼時候，而且要標示它的進口國……\n邱委員臣遠：我想這一次的事件充分……\n陳院長建仁：所以如果他沒有這樣標示的話，那是他違法。\n邱委員臣遠：充分延伸出一個問題。其實這次有三個重點：第一個超思的事情，其實這次的專案進口有三個國人要瞭解的疑慮，第一個，有沒有圖利特定廠商？\n陳院長建仁：沒有。\n邱委員臣遠：當時一個50萬元資本額的公司有辦法去進口八千多萬顆的雞蛋，甚至是巴西的，中間的採購過程有沒有透明？相關的金流、合約的內容、相關專案進口的法源依據，其實就是前言不對後語才造成這麼大的一個社會紛擾。第二個階段，就是農委會在整個產銷上對數量掌握的精準度就不夠，如果說當時1天的需求有2,400萬顆，1天缺的蛋大概是200萬顆，其實你們當時有二個方式：一個是放任市場機制，讓他們自己去逼這些囤蛋的蛋……\n陳院長建仁：報告，那這個蛋價會狂飆。\n邱委員臣遠：沒有錯，但是你要去控制，但是你有沒有必要全部都透過專案進口，這是選擇，我們沒有說它一定錯，但是當時你們既然選擇了這條路，你就應該要掌握好相關國內國產蛋的產能，包含這些如果要冷凍……\n陳院長建仁：確實是有掌握。\n邱委員臣遠：有掌握，那回到第二個問題……\n陳院長建仁：在3、4、5月的時候專案進口蛋都完全銷售完，而且都是以殼蛋的方式。\n邱委員臣遠：院長，那我們就要回到……\n陳院長建仁：在6月份的時候，因為蛋雞復養上升了，而且蛋雞復養很快到8月份的時候已經回復到原來的這個目標，而且再加上剛才你講的23家蛋商自己進口的這個部分，所以才會使得我們當時的估算，我們沒有算到這個蛋商在6月份會有進口的這個區塊。\n邱委員臣遠：我們回歸事實的本質，現在確實就是有5,402萬顆蛋必須要銷毀，這也造成非常多的成本損耗，甚至有延伸到第三個問題是食安的問題，現在這一些所謂的過期蛋有沒有淪入加工市場？\n邱委員臣遠：好，我們希望你評估畜產會收回公務機關的相關評估，好不好？\n陳院長建仁：好。實際上，畜產會的董事等等，我們可以安排相關的……\n邱委員臣遠：這個部分提出一個改善報告給本席辦公室，好不好？\n陳院長建仁：好，我們來看怎麼樣來改善畜產會的功能。\n邱委員臣遠：OK！兩個禮拜。\n陳院長建仁：好，我們來規劃。\n邱委員臣遠：好。\n主席：謝謝邱委員。接下來請王委員鴻薇質詢。\n`,
    iVODLink: 'https://ivod.ly.gov.tw/Play/VOD/115865/300K',
  },
  'test-2': {
    date: '2024/12/8',
    title: '行政院院長提出施政方針及施政報告並備質詢2',
    legislator: { name: '邱臣遠', slug: 'legislator-1' },
    attendee: '列席質詢對象／陳建仁院長、農業部代理部長陳部長、衛福部薛部長',
    relatedTopics: [
      { title: '國會改革', slug: 'topic-1' },
      { title: '人工生殖法修法', slug: 'topic-2' },
      { title: '沈伯洋', slug: 'topic-3' },
      { title: '國家科技發展策略', slug: 'topic-4' },
      { title: '美中台關係', slug: 'topic-5' },
    ],
    summary: [
      '邱臣遠委員提及勤億蛋品9月公告誤標國產蛋，陳建仁院長強調標示不符應依法處罰並立即下架。',
      '邱臣遠委員批評政府未掌握進口蛋產銷數據，陳建仁院長回應進口蛋僅佔市場2%，且多用於加工。',
      '邱臣遠委員強調進口蛋標示清楚的重要性，陳建仁院長承諾中央與地方聯合稽查以重建信心。',
    ],
    content: `邱委員臣遠：（11時5分）謝謝游院長，我們邀請行政院陳建仁院長、農業部代理部長陳部長以及衛福部薛部長。\n主席：陳院長請。\n陳院長建仁：邱委員早。\n邱委員臣遠：院長，我想這次雞蛋的事件，您稍早也作出道歉，雖然來得有點晚，不過我們還是肯定你的態度，但是我們必須還是要非常嚴正地來面對這次的問題。我想這次雞蛋的問題，我們先就教院長，今天最新的狀況就是勤億蛋品，就是在9月15號聲稱百分之百來源國為國產蛋的這個廠商，事實上後來在流向的追蹤上，發現了他實質購買了進口蛋1.6萬箱，高達600萬顆的巴西蛋，比台農買得還多，更被發現當時該篇聲稱百分之百國產蛋的這個聲明，其實昨天晚上9點已經從網路上下架了，請問現在目前院長有沒有掌握這個最新的狀況？\n陳院長建仁：我想任何的進口蛋，如果把它標示為國產蛋，這是不合法的，然後應該要立刻地下架。\n邱委員臣遠：立刻下架？所以你認為這是業者的標示不實，所以該罰就罰？\n陳院長建仁：當然啊！\n邱委員臣遠：當時他們配合國家的政策，在相關的，剛剛農業部的代理部長有提到，你們所謂的這個「實質轉型」，這是我們今年度聽到最奇葩的一個形容詞，你們當時沸沸揚揚講「雞蛋國家隊」，但是我在這次進口蛋的專案看到的是，不管是政府、廠商還是業者，甚至是進口上的、市場上的產銷的掌握都不足，才會造成這樣這麼多的破洞。第二個問題，我們看到現在地方政府人人自危。根據嘉義市衛生局調查稽查的結果，勤億公司3月到5月已經從菲律賓、土耳其、美國跟泰國總共進口了二百多萬顆殼蛋，而且已經全部做成洗選蛋售出了，但是卻對外還是宣稱是本土蛋，這中間有沒有標示不符的狀況？\n陳院長建仁：跟委員報告，他所用的進口蛋，實際上在政府專案進口之後，確實有23家的廠商也自行進口，不是透過這個專案進口，那他的這一些進口蛋實際上……\n邱委員臣遠：那你們當時都沒有辦法掌握這個數量嗎？除了專案進口的，一般的廠商在進口上，你們沒有辦法做一個總量管理嗎？\n陳院長建仁：我們不可能禁止廠商去……\n邱委員臣遠：不可能禁止，但是你可以掌握嘛，可以掌握吧？\n陳院長建仁：我們確實是……\n邱委員臣遠：而且現在的問題是，你進來了之後還要透過洗選、加工、延長效期，既然是這樣，那為什麼當時在進口的時候不以這些加工的為主？或者是本土的這些國產蛋以加工的為主，要把它混充到現在在食安上造成這麼大混淆的一個破口？\n陳院長建仁：以我們專案進口蛋進來的這個部分，確實到6月以後，我們就大部分都轉為加工蛋了，但是廠商自行進口的會進入殼蛋，這個時候因為他是自行進口，就完全要符合衛福部的規定。相關的標示都要符合規定，那這個標示規定講得很清楚，就是外國進口的蛋它的效期到什麼時候要標到什麼時候，而且要標示它的進口國……\n邱委員臣遠：我想這一次的事件充分……\n陳院長建仁：所以如果他沒有這樣標示的話，那是他違法。\n邱委員臣遠：充分延伸出一個問題。其實這次有三個重點：第一個超思的事情，其實這次的專案進口有三個國人要瞭解的疑慮，第一個，有沒有圖利特定廠商？\n陳院長建仁：沒有。\n邱委員臣遠：當時一個50萬元資本額的公司有辦法去進口八千多萬顆的雞蛋，甚至是巴西的，中間的採購過程有沒有透明？相關的金流、合約的內容、相關專案進口的法源依據，其實就是前言不對後語才造成這麼大的一個社會紛擾。第二個階段，就是農委會在整個產銷上對數量掌握的精準度就不夠，如果說當時1天的需求有2,400萬顆，1天缺的蛋大概是200萬顆，其實你們當時有二個方式：一個是放任市場機制，讓他們自己去逼這些囤蛋的蛋……\n陳院長建仁：報告，那這個蛋價會狂飆。\n邱委員臣遠：沒有錯，但是你要去控制，但是你有沒有必要全部都透過專案進口，這是選擇，我們沒有說它一定錯，但是當時你們既然選擇了這條路，你就應該要掌握好相關國內國產蛋的產能，包含這些如果要冷凍……\n陳院長建仁：確實是有掌握。\n邱委員臣遠：有掌握，那回到第二個問題……\n陳院長建仁：在3、4、5月的時候專案進口蛋都完全銷售完，而且都是以殼蛋的方式。\n邱委員臣遠：院長，那我們就要回到……\n陳院長建仁：在6月份的時候，因為蛋雞復養上升了，而且蛋雞復養很快到8月份的時候已經回復到原來的這個目標，而且再加上剛才你講的23家蛋商自己進口的這個部分，所以才會使得我們當時的估算，我們沒有算到這個蛋商在6月份會有進口的這個區塊。\n邱委員臣遠：我們回歸事實的本質，現在確實就是有5,402萬顆蛋必須要銷毀，這也造成非常多的成本損耗，甚至有延伸到第三個問題是食安的問題，現在這一些所謂的過期蛋有沒有淪入加工市場？\n邱委員臣遠：好，我們希望你評估畜產會收回公務機關的相關評估，好不好？\n陳院長建仁：好。實際上，畜產會的董事等等，我們可以安排相關的……\n邱委員臣遠：這個部分提出一個改善報告給本席辦公室，好不好？\n陳院長建仁：好，我們來看怎麼樣來改善畜產會的功能。\n邱委員臣遠：OK！兩個禮拜。\n陳院長建仁：好，我們來規劃。\n邱委員臣遠：好。\n主席：謝謝邱委員。接下來請王委員鴻薇質詢。\n`,
    iVODLink: 'https://ivod.ly.gov.tw/Play/VOD/115865/300K',
  },
  'test-3': {
    date: '2024/12/9',
    title: '行政院院長提出施政方針及施政報告並備質詢3',
    legislator: { name: '邱臣遠', slug: 'legislator-1' },
    attendee: '列席質詢對象／陳建仁院長、農業部代理部長陳部長、衛福部薛部長',
    relatedTopics: [
      { title: '國會改革', slug: 'topic-1' },
      { title: '人工生殖法修法', slug: 'topic-2' },
      { title: '沈伯洋', slug: 'topic-3' },
      { title: '國家科技發展策略', slug: 'topic-4' },
      { title: '美中台關係', slug: 'topic-5' },
    ],
    summary: [
      '邱臣遠委員提及勤億蛋品9月公告誤標國產蛋，陳建仁院長強調標示不符應依法處罰並立即下架。',
      '邱臣遠委員批評政府未掌握進口蛋產銷數據，陳建仁院長回應進口蛋僅佔市場2%，且多用於加工。',
      '邱臣遠委員強調進口蛋標示清楚的重要性，陳建仁院長承諾中央與地方聯合稽查以重建信心。',
    ],
    content: `邱委員臣遠：（11時5分）謝謝游院長，我們邀請行政院陳建仁院長、農業部代理部長陳部長以及衛福部薛部長。\n主席：陳院長請。\n陳院長建仁：邱委員早。\n邱委員臣遠：院長，我想這次雞蛋的事件，您稍早也作出道歉，雖然來得有點晚，不過我們還是肯定你的態度，但是我們必須還是要非常嚴正地來面對這次的問題。我想這次雞蛋的問題，我們先就教院長，今天最新的狀況就是勤億蛋品，就是在9月15號聲稱百分之百來源國為國產蛋的這個廠商，事實上後來在流向的追蹤上，發現了他實質購買了進口蛋1.6萬箱，高達600萬顆的巴西蛋，比台農買得還多，更被發現當時該篇聲稱百分之百國產蛋的這個聲明，其實昨天晚上9點已經從網路上下架了，請問現在目前院長有沒有掌握這個最新的狀況？\n陳院長建仁：我想任何的進口蛋，如果把它標示為國產蛋，這是不合法的，然後應該要立刻地下架。\n邱委員臣遠：立刻下架？所以你認為這是業者的標示不實，所以該罰就罰？\n陳院長建仁：當然啊！\n邱委員臣遠：當時他們配合國家的政策，在相關的，剛剛農業部的代理部長有提到，你們所謂的這個「實質轉型」，這是我們今年度聽到最奇葩的一個形容詞，你們當時沸沸揚揚講「雞蛋國家隊」，但是我在這次進口蛋的專案看到的是，不管是政府、廠商還是業者，甚至是進口上的、市場上的產銷的掌握都不足，才會造成這樣這麼多的破洞。第二個問題，我們看到現在地方政府人人自危。根據嘉義市衛生局調查稽查的結果，勤億公司3月到5月已經從菲律賓、土耳其、美國跟泰國總共進口了二百多萬顆殼蛋，而且已經全部做成洗選蛋售出了，但是卻對外還是宣稱是本土蛋，這中間有沒有標示不符的狀況？\n陳院長建仁：跟委員報告，他所用的進口蛋，實際上在政府專案進口之後，確實有23家的廠商也自行進口，不是透過這個專案進口，那他的這一些進口蛋實際上……\n邱委員臣遠：那你們當時都沒有辦法掌握這個數量嗎？除了專案進口的，一般的廠商在進口上，你們沒有辦法做一個總量管理嗎？\n陳院長建仁：我們不可能禁止廠商去……\n邱委員臣遠：不可能禁止，但是你可以掌握嘛，可以掌握吧？\n陳院長建仁：我們確實是……\n邱委員臣遠：而且現在的問題是，你進來了之後還要透過洗選、加工、延長效期，既然是這樣，那為什麼當時在進口的時候不以這些加工的為主？或者是本土的這些國產蛋以加工的為主，要把它混充到現在在食安上造成這麼大混淆的一個破口？\n陳院長建仁：以我們專案進口蛋進來的這個部分，確實到6月以後，我們就大部分都轉為加工蛋了，但是廠商自行進口的會進入殼蛋，這個時候因為他是自行進口，就完全要符合衛福部的規定。相關的標示都要符合規定，那這個標示規定講得很清楚，就是外國進口的蛋它的效期到什麼時候要標到什麼時候，而且要標示它的進口國……\n邱委員臣遠：我想這一次的事件充分……\n陳院長建仁：所以如果他沒有這樣標示的話，那是他違法。\n邱委員臣遠：充分延伸出一個問題。其實這次有三個重點：第一個超思的事情，其實這次的專案進口有三個國人要瞭解的疑慮，第一個，有沒有圖利特定廠商？\n陳院長建仁：沒有。\n邱委員臣遠：當時一個50萬元資本額的公司有辦法去進口八千多萬顆的雞蛋，甚至是巴西的，中間的採購過程有沒有透明？相關的金流、合約的內容、相關專案進口的法源依據，其實就是前言不對後語才造成這麼大的一個社會紛擾。第二個階段，就是農委會在整個產銷上對數量掌握的精準度就不夠，如果說當時1天的需求有2,400萬顆，1天缺的蛋大概是200萬顆，其實你們當時有二個方式：一個是放任市場機制，讓他們自己去逼這些囤蛋的蛋……\n陳院長建仁：報告，那這個蛋價會狂飆。\n邱委員臣遠：沒有錯，但是你要去控制，但是你有沒有必要全部都透過專案進口，這是選擇，我們沒有說它一定錯，但是當時你們既然選擇了這條路，你就應該要掌握好相關國內國產蛋的產能，包含這些如果要冷凍……\n陳院長建仁：確實是有掌握。\n邱委員臣遠：有掌握，那回到第二個問題……\n陳院長建仁：在3、4、5月的時候專案進口蛋都完全銷售完，而且都是以殼蛋的方式。\n邱委員臣遠：院長，那我們就要回到……\n陳院長建仁：在6月份的時候，因為蛋雞復養上升了，而且蛋雞復養很快到8月份的時候已經回復到原來的這個目標，而且再加上剛才你講的23家蛋商自己進口的這個部分，所以才會使得我們當時的估算，我們沒有算到這個蛋商在6月份會有進口的這個區塊。\n邱委員臣遠：我們回歸事實的本質，現在確實就是有5,402萬顆蛋必須要銷毀，這也造成非常多的成本損耗，甚至有延伸到第三個問題是食安的問題，現在這一些所謂的過期蛋有沒有淪入加工市場？\n邱委員臣遠：好，我們希望你評估畜產會收回公務機關的相關評估，好不好？\n陳院長建仁：好。實際上，畜產會的董事等等，我們可以安排相關的……\n邱委員臣遠：這個部分提出一個改善報告給本席辦公室，好不好？\n陳院長建仁：好，我們來看怎麼樣來改善畜產會的功能。\n邱委員臣遠：OK！兩個禮拜。\n陳院長建仁：好，我們來規劃。\n邱委員臣遠：好。\n主席：謝謝邱委員。接下來請王委員鴻薇質詢。\n`,
    iVODLink: 'https://ivod.ly.gov.tw/Play/VOD/115865/300K',
  },
}

const testSpeechOrder = ['test-1', 'test-2', 'test-3']

const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

export enum FontSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export const FontSizeOffset = Object.freeze({
  [FontSize.SMALL]: 0,
  [FontSize.MEDIUM]: 2,
  [FontSize.LARGE]: 4,
})

export enum Direction {
  PREV = 'prev',
  NEXT = 'next',
}

type SpeechPageProps = {
  slug: string
}
const SpeechPage: React.FC<SpeechPageProps> = ({ slug }) => {
  const router = useRouter()
  const leadingRef = useRef<HTMLDivElement>(null)
  const { setTabElement, isHeaderHidden } = useScrollContext()
  const [fontSize, setFontSize] = useState(FontSize.SMALL)
  const [isControllBarHidden, setIsControllBarHidden] = useState(true)
  const [scrollStage, setScrollStage] = useState(1)
  const lastY = useRef(0)
  const currentY = useRef(0)

  useEffect(() => {
    if (leadingRef.current) {
      setTabElement(leadingRef.current)
    }
  }, [setTabElement, leadingRef])

  useEffect(() => {
    if (!leadingRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsControllBarHidden(entry.isIntersecting)
      },
      {
        threshold: 0.5,
      }
    )
    observer.observe(leadingRef.current)
    return () => {
      observer.disconnect()
    }
  }, [leadingRef])

  useEffect(() => {
    const handleScroll = _.throttle(() => {
      const scrollThreshold = 16
      lastY.current = window.pageYOffset
      const scrollDistance = Math.abs(currentY.current - lastY.current)

      if (scrollDistance < scrollThreshold) {
        return
      }

      const scrollDirection = lastY.current > currentY.current ? 'down' : 'up'
      currentY.current = lastY.current

      if (scrollDirection === 'up') {
        setScrollStage((prevStage) => (prevStage - 1 < 1 ? 1 : prevStage - 1))
      } else {
        setScrollStage((prevStage) => (prevStage + 1 > 3 ? 3 : prevStage + 1))
      }
    }, 500)

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const isFirstSpeech = testSpeechOrder.indexOf(slug) === 0
  const isLastSpeech =
    testSpeechOrder.indexOf(slug) === testSpeechOrder.length - 1

  const cycleFontSize = () => {
    setFontSize((currentSize) => {
      switch (currentSize) {
        case FontSize.SMALL:
          return FontSize.MEDIUM
        case FontSize.MEDIUM:
          return FontSize.LARGE
        case FontSize.LARGE:
        default:
          return FontSize.SMALL
      }
    })
  }

  const handleSwitchSpeech = (direction: Direction) => {
    // TODO: need to changed
    const currentIndex = testSpeechOrder.indexOf(slug)
    if (direction === Direction.PREV && currentIndex > 0) {
      router.push(`/a/${testSpeechOrder[currentIndex - 1]}`)
    } else if (
      direction === Direction.NEXT &&
      currentIndex < testSpeechOrder.length - 1
    ) {
      router.push(`/a/${testSpeechOrder[currentIndex + 1]}`)
    }
  }

  return (
    <SpeechContainer>
      <ControlTabContainer
        $isHeaderHidden={isHeaderHidden}
        $isHidden={isControllBarHidden}
      >
        <ControlTab $isHeaderAbove={!isHeaderHidden && !isControllBarHidden}>
          <DateAndTitle>
            <ControlTabDate text={testSpeechData[slug].date} />
            <ControlTabTitle text={testSpeechData[slug].title} />
          </DateAndTitle>
          <DesktopAndAbove>
            <ControlItems>
              <CustomPillButton
                onClick={() =>
                  window.open(testSpeechData[slug].iVODLink, '_blank')
                }
                leftIconComponent={<Video releaseBranch={releaseBranch} />}
                text={'iVOD'}
              />
              <Spacing $width={24} />
              <P1Gray600 text="質詢片段切換" />
              <Spacing $width={12} />
              <IconButton
                disabled={isFirstSpeech}
                direction={IconButton.Direction.LEFT}
                onClick={() => handleSwitchSpeech(Direction.PREV)}
              />
              <Spacing $width={8} />
              <IconButton
                disabled={isLastSpeech}
                direction={IconButton.Direction.RIGHT}
                onClick={() => handleSwitchSpeech(Direction.NEXT)}
              />
            </ControlItems>
          </DesktopAndAbove>
        </ControlTab>
      </ControlTabContainer>
      <LeadingContainer ref={leadingRef}>
        <SpeechDate date={testSpeechData[slug].date} />
        <SpeechTitle title={testSpeechData[slug].title} />
        <DesktopAndAboveWithFlex>
          <IvodBlock>
            <CustomPillButton
              onClick={() =>
                window.open(testSpeechData[slug].iVODLink, '_blank')
              }
              leftIconComponent={<Video releaseBranch={releaseBranch} />}
              text={'iVOD'}
            />
            <IvodSwitchBlock>
              <P1Gray600 text="質詢片段切換" />
              <IvodSwitchButtonContainer>
                <IconButton
                  disabled={isFirstSpeech}
                  direction={IconButton.Direction.LEFT}
                  onClick={() => handleSwitchSpeech(Direction.PREV)}
                />
                <IconButton
                  disabled={isLastSpeech}
                  direction={IconButton.Direction.RIGHT}
                  onClick={() => handleSwitchSpeech(Direction.NEXT)}
                />
              </IvodSwitchButtonContainer>
            </IvodSwitchBlock>
          </IvodBlock>
        </DesktopAndAboveWithFlex>
      </LeadingContainer>
      <BodyContainer>
        <DesktopAndAboveWithFlex>
          <AsideBlock>
            <SpeechAsideInfo
              legislator={testSpeechData[slug].legislator}
              attendee={testSpeechData[slug].attendee}
              relatedTopics={testSpeechData[slug].relatedTopics}
            />
            <SpeechAsideToolBar
              onFontSizeChange={cycleFontSize}
              currentFontSize={fontSize}
            />
            <SpeechAsideInfo
              legislator={testSpeechData[slug].legislator}
              attendee={testSpeechData[slug].attendee}
              relatedTopics={testSpeechData[slug].relatedTopics}
            />
          </AsideBlock>
        </DesktopAndAboveWithFlex>
        <TabletAndBelowWithFlex>
          <SpeechAsideInfo
            legislator={testSpeechData[slug].legislator}
            attendee={testSpeechData[slug].attendee}
            relatedTopics={testSpeechData[slug].relatedTopics}
          />
        </TabletAndBelowWithFlex>
        <ContentBlock>
          <SpeechSummary summary={testSpeechData[slug].summary} />
          <SeparationCurve />
          <SpeechContent
            content={testSpeechData[slug].content}
            fontSizeOffset={FontSizeOffset[fontSize]}
          />
        </ContentBlock>
        <TabletAndBelowWithFlex>
          <SpeechAsideInfo
            legislator={testSpeechData[slug].legislator}
            attendee={testSpeechData[slug].attendee}
            relatedTopics={testSpeechData[slug].relatedTopics}
          />
        </TabletAndBelowWithFlex>
        <DesktopAndAboveWithFlex>
          <Feedback>
            <CustomPillButton
              leftIconComponent={<Report releaseBranch={releaseBranch} />}
              text={'問題回報'}
            />
          </Feedback>
        </DesktopAndAboveWithFlex>
      </BodyContainer>
      <TabletAndBelow>
        <SpeechMobileToolbar
          onFontSizeChange={cycleFontSize}
          iVODLink={testSpeechData[slug].iVODLink}
          isLastSpeech={isLastSpeech}
          isFirstSpeech={isFirstSpeech}
          onSwitchClick={handleSwitchSpeech}
          scrollStage={scrollStage}
        />
      </TabletAndBelow>
    </SpeechContainer>
  )
}

export default SpeechPage
