'use client'
import React, { useState } from 'react'
import styled from 'styled-components'
// @twerporter
import {
  colorOpacity,
  colorGrayscale,
} from '@twreporter/core/lib/constants/color'
import { H5 } from '@twreporter/react-components/lib/text/headline'
import { Cross } from '@twreporter/react-components/lib/icon'
import { PillButton } from '@twreporter/react-components/lib/button'
import mq from '@twreporter/core/lib/utils/media-query'
import { P2 } from '@twreporter/react-components/lib/text/paragraph'
import {
  MemberType,
  MEMBER_TYPE_LABEL,
  CITY_OPTIONS,
} from '@twreporter/congress-dashboard-shared/lib/constants/legislative-yuan-member'
// fetcher
import useParty, { type partyData, type stateType } from '@/fetchers/party'
// component
import {
  SelectorType,
  SingleSelect,
  MultipleSelect,
} from '@/components/selector'
import PartyTag, { TagSize } from '@/components/dashboard/card/party-tag'
// z-index
import { ZIndex } from '@/styles/z-index'
// lodash
import { findIndex, clone, map } from 'lodash'
const _ = {
  findIndex,
  clone,
  map,
}

const ModalContainer = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0px;
  right: 0px;
  width: 100vw;
  height: 100vh;
  background-color: ${colorOpacity['black_0.2']};
  justify-content: center;
  align-items: center;
  z-index: ${ZIndex.FilterModal};
`

const Filter = styled.div`
  background-color: ${colorGrayscale.white};
  width: 100%;
  ${mq.tabletAndAbove`
    max-width: 480px;
    border-radius: 8px;
    box-shadow: 0px 0px 24px 0px ${colorOpacity['black_0.1']};
    `}
  ${mq.mobileOnly`
    height: 100%;
    overflow: auto;
  `}
`

const Header = styled.div`
  display: flex;
  padding: 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: ${colorGrayscale.gray800};
  position: relative;
  background-color: ${colorGrayscale.white};
  ${mq.mobileOnly`
    border-bottom: 1px solid ${colorGrayscale.gray300};
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    z-index: 1;
  `}
`

const CrossIcon = styled.div`
  position: absolute;
  right: 16px;
  height: 24px;
  width: 24px;
  svg {
    background-color: ${colorGrayscale.gray600};
  }
  &:hover {
    cursor: pointer;
  }
`

const Footer = styled.div`
  display: flex;
  padding: 16px 24px;
  justify-content: center;
  align-items: center;
  gap: 16px;
  background-color: ${colorGrayscale.white};
  ${mq.mobileOnly`
    padding: 24px;
    gap: 10px;
    border-top: 1px solid ${colorGrayscale.gray300};
    position:fixed;
    width: 100%;
    bottom: 0;
  `}
`

const StyledPillButton = styled(PillButton)`
  width: 144px !important;
  justify-content: center;
  ${mq.mobileOnly`
    width: 100% !important;
  `}
`

const SelectorsContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 16px 24px;
  gap: 24px;
  flex-direction: column;
  ${mq.mobileOnly`
    gap: 20px;
    margin-bottom: 91px;
    margin-top: 58.5px;
  `}
`

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  ${mq.mobileOnly`
    flex-direction: column;
    gap: 8px;
    align-items: start;
  `}
`

const Label = styled(P2)`
  color: ${colorGrayscale.gray800};
  flex: 0 0 25%;
  max-width: 42px;
  ${mq.tabletAndAbove`
    display: block !important;
    text-align: justify;
    text-align-last: justify;
  `}
  ${mq.mobileOnly`
    width: 100%;
  `}
`

const SelectorContainer = styled.div`
  flex: 1;
  width: 100%;
`

type OptionIconProps = {
  url: string
}
const OptionIcon: React.FC<OptionIconProps> = ({ url }) => {
  return <PartyTag size={TagSize.S} avatar={url} />
}

const defaultOptions = [
  {
    type: SelectorType.Single,
    disabled: true,
    label: '單位',
    value: 'department',
    options: [{ label: '立法院', value: 'legislativeYuan' }],
  },
  {
    type: SelectorType.Single,
    disabled: false,
    label: '屆期',
    value: 'meeting',
    options: [
      { label: '第 10 屆', value: '10' },
      { label: '第 11 屆', value: '11' },
    ], //TODO: get from api
  },
  {
    type: SelectorType.Multiple,
    disabled: false,
    defaultValue: ['all'],
    label: '會期',
    value: 'meetingSession',
    options: [
      { label: '全部會期', value: 'all', isDeletable: false },
      { label: '第 1 會期(2020/9-2022/10)', value: '1' },
      { label: '第 2 會期(2022/10-2023/2)', value: '2' },
      { label: '第 3 會期(2023/2-2023/6)', value: '3' },
    ], //TODO: get from api
  },
  {
    type: SelectorType.Multiple,
    disabled: false,
    label: '選區',
    value: 'constituency',
    options: [
      {
        groupName: '不分區',
        options: [{ label: '不分區', value: MemberType.NationwideAndOverseas }],
      },
      {
        groupName: '原住民',
        options: [
          {
            label: MEMBER_TYPE_LABEL[MemberType.LowlandAboriginal],
            value: MemberType.LowlandAboriginal,
          },
          {
            label: MEMBER_TYPE_LABEL[MemberType.HighlandAboriginal],
            value: MemberType.HighlandAboriginal,
          },
        ],
      },
      { groupName: '區域', options: CITY_OPTIONS },
    ],
  },
  {
    type: SelectorType.Multiple,
    disabled: false,
    label: '黨籍',
    value: 'party',
    isLoading: true,
    options: [],
  },
  {
    type: SelectorType.Multiple,
    disabled: false,
    label: '委員會',
    value: 'committee',
    options: [
      {
        groupName: '常設',
        options: [
          { label: '內政委員會', value: 'committee-1' },
          { label: '社會福利及衛生環境委員會', value: 'committee-3' },
        ],
      },
      {
        groupName: '特種',
        options: [
          { label: '經費稽核委員會', value: 'committee-2' },
          { label: '紀律委員會', value: 'committee-4' },
        ],
      },
    ], //TODO: get from api
  },
]

const generateOptions = (partyState: stateType<partyData>) => {
  const partyFieldIndex = _.findIndex(
    defaultOptions,
    ({ value }) => value === 'party'
  )
  if (partyFieldIndex < 0) {
    return defaultOptions
  }

  const filterOptions = _.clone(defaultOptions)
  filterOptions[partyFieldIndex].isLoading = partyState.isLoading
  filterOptions[partyFieldIndex].options = _.map(
    partyState.party,
    ({ slug, name, imageLink, image }: partyData) => {
      const selfHostImage = image?.imageFile?.url
      const imageUrl =
        imageLink ||
        (selfHostImage
          ? `${process.env.NEXT_PUBLIC_IMAGE_HOST}${selfHostImage}`
          : '')
      const prefixIcon = <OptionIcon url={imageUrl} />
      return {
        label: name,
        value: slug,
        prefixIcon,
      }
    }
  )

  return filterOptions
}

export type FilterModalValueType = {
  department: string
  meeting: string
  meetingSession: string[]
  constituency: string[]
  party: string[]
  committee: string[]
}

type FilterModelProps = {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  onSubmit: (v: FilterModalValueType) => void
}
const FilterModal: React.FC<FilterModelProps> = ({
  isOpen,
  setIsOpen,
  onSubmit,
}) => {
  const defaultValue = {
    department: 'legislativeYuan',
    meeting: '11',
    meetingSession: ['all'],
    constituency: [],
    party: [],
    committee: [],
  }
  const [filterValue, setFilterValue] =
    useState<FilterModalValueType>(defaultValue)

  const handleSubmitClick = () => {
    onSubmit(filterValue)
    setIsOpen(false)
  }

  const handleResetClick = () => {
    setFilterValue(defaultValue)
  }
  const handleCrossClick = () => {
    setIsOpen(false)
  }

  const partyOptionStates = useParty()
  const filterOptions = generateOptions(partyOptionStates)

  return (
    <ModalContainer $isOpen={isOpen}>
      <Filter>
        <Header>
          <H5 text="篩選" />
          <CrossIcon onClick={handleCrossClick}>
            <Cross />
          </CrossIcon>
        </Header>
        <SelectorsContainer>
          {filterOptions.map(
            (
              {
                type,
                disabled,
                label,
                value,
                options,
                defaultValue,
                isLoading,
              },
              idx
            ) => {
              if (type === SelectorType.Single) {
                return (
                  <SelectContainer key={`single-select-${value}-${idx}`}>
                    <Label text={label} />
                    <SelectorContainer>
                      <SingleSelect
                        disabled={disabled}
                        options={options}
                        value={filterValue[value]}
                        onChange={(optionValue) =>
                          setFilterValue((v) => ({
                            ...v,
                            [value]: optionValue,
                          }))
                        }
                        loading={isLoading}
                      />
                    </SelectorContainer>
                  </SelectContainer>
                )
              } else if (type === SelectorType.Multiple) {
                return (
                  <SelectContainer key={`multi-select-${value}-${idx}`}>
                    <Label text={label} />
                    <SelectorContainer>
                      <MultipleSelect
                        defaultValue={defaultValue}
                        disabled={disabled}
                        options={options}
                        value={filterValue[value]}
                        onChange={(optionValue) =>
                          setFilterValue((v) => ({
                            ...v,
                            [value]: optionValue,
                          }))
                        }
                        loading={isLoading}
                      />
                    </SelectorContainer>
                  </SelectContainer>
                )
              }
            }
          )}
        </SelectorsContainer>
        <Footer>
          <StyledPillButton
            text="重設"
            size={PillButton.Size.L}
            type={PillButton.Type.SECONDARY}
            onClick={handleResetClick}
          />
          <StyledPillButton
            text="確定"
            size={PillButton.Size.L}
            onClick={handleSubmitClick}
          />
        </Footer>
      </Filter>
    </ModalContainer>
  )
}

export default FilterModal
