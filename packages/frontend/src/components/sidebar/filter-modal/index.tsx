'use client'
import React, { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
// type
import { FilterOption } from '@/components/sidebar/type'
// components
import SelectTag from '@/components/sidebar/filter-modal/select-tag'
import Search from '@/components/sidebar/filter-modal/search'
// style
import {
  FlexColumn,
  FlexRow,
  ButtonGroup,
  Title,
  Button,
} from '@/components/sidebar/style'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { Cross, Arrow } from '@twreporter/react-components/lib/icon'
import { IconButton, PillButton } from '@twreporter/react-components/lib/button'
import { P2, P1 } from '@twreporter/react-components/lib/text/paragraph'
// lodash
import { filter, map, findIndex, unionBy, without, find } from 'lodash'
const _ = {
  filter,
  map,
  findIndex,
  unionBy,
  without,
  find,
}

// global var
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const maxSelectedCount = 10

// todo: add animation
const TopBox = styled(FlexColumn)<{ $show: boolean }>`
  padding: 16px 16px 16px 24px;
  border-bottom: 1px solid ${colorGrayscale.gray300};
  position: sticky;
  top: 0;
  background-color: ${colorGrayscale.white};
  z-index: 1;
  ${(props) => (props.$show ? '' : 'display: none;')}
`
const TitleBox = styled(FlexRow)``
const HorizontalLine = styled.div<{ $show: boolean }>`
  border-bottom: 1px solid ${colorGrayscale.gray300};
  ${(props) => (props.$show ? '' : `display: none;`)}
`
const SearchBox = styled(FlexRow)<{ $isSearchMode: boolean }>`
  padding: 24px 24px 0 24px;

  ${(props) =>
    props.$isSearchMode
      ? `
    position: sticky;
    top: 0;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    gap: 8px;
  `
      : `
    ${Button} {
      display: none;
    }
  `}
`
const SelectBox = styled(FlexColumn)`
  padding: 24px;
  overflow-y: scroll;

  ${HorizontalLine} {
    margin: 24px 0;
  }
`
const Seleted = styled(FlexColumn)`
  gap: 12px;
`
const UnSelected = styled(FlexColumn)`
  gap: 12px;
`
const TagBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`
const Text = styled(P2)`
  color: ${colorGrayscale.gray800};
`
const ConfirmBox = styled.div`
  padding: 24px;
  position: sticky;
  bottom: 0;
  border-top: 1px solid ${colorGrayscale.gray300};
  background-color: ${colorGrayscale.white};
  z-index: 1;
`
const ConfirmButton = styled(PillButton)`
  width: 100% !important;
  justify-content: center;
`
const Subtitle = styled(P2)`
  color: ${colorGrayscale.gray800};
  margin-top: 4px;
`
const EmptyText = styled(P1)`
  color: ${colorGrayscale.gray700};
  margin: auto;
  padding: 80px 0;
`

type FilterModalProps = {
  slug: string
  title: string
  subtitle?: string
  initialSelectedOption?: FilterOption[]
  fetcher: (slug: string) => Promise<FilterOption[]>
  onClose: () => void
  onConfirmSelection: (selectedOptions: FilterOption[]) => void
}
const filterByKeyword = (options: FilterOption[], keyword: string) => {
  return keyword
    ? _.filter(options, (option) => option.name.includes(keyword))
    : options
}
const FilterModal: React.FC<FilterModalProps> = ({
  title,
  slug,
  subtitle,
  initialSelectedOption = [],
  fetcher,
  onClose,
  onConfirmSelection,
}) => {
  const [options, setOptions] = useState(
    _.map(initialSelectedOption, (option) => ({ selected: true, ...option }))
  )
  const [selectedOptions, setSelectedOptions] = useState(initialSelectedOption)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [isSearchMode, setIsSearchMode] = useState(false)
  const { data } = useSWR(slug, () => fetcher(slug)) //todo: add loading & error handling
  const selectedOptionsForShow = useMemo(
    () => selectedOptions,
    [selectedOptions]
  )
  const optionsForShow = useMemo(
    () => (isSearchMode ? filterByKeyword(options, keyword) : options),
    [options, keyword, isSearchMode]
  )

  useEffect(() => {
    if (!data || hasLoaded) return
    const newOptions = _.unionBy(
      options,
      _.map(data, (item) => ({ selected: false, ...item })),
      'slug'
    )
    setOptions(newOptions)
    setHasLoaded(true)
  }, [data, hasLoaded])

  useEffect(() => {
    if (!isSearchMode) {
      setKeyword('')
    }
  }, [isSearchMode])

  const toggleSelect = (e: React.MouseEvent<HTMLElement>, index: number) => {
    e.stopPropagation()
    e.preventDefault()
    const targetOption = optionsForShow[index]
    const newSelected = !targetOption.selected
    if (!newSelected && selectedOptions.length === 1) return
    if (newSelected && selectedOptions.length === maxSelectedCount) return

    const updatedOptions = [...options]
    const indexInOptions = _.findIndex(
      updatedOptions,
      (option) => option.slug === targetOption.slug
    )
    if (indexInOptions < 0) return
    updatedOptions[indexInOptions].selected = newSelected
    setOptions(updatedOptions)

    let newSelectedOptions: FilterOption[]
    if (newSelected) {
      newSelectedOptions = [updatedOptions[indexInOptions], ...selectedOptions]
      setSelectedOptions(newSelectedOptions)
    } else {
      const targetOptionInSelected = _.find(
        selectedOptions,
        (selected) => selected.slug === options[indexInOptions].slug
      )
      if (targetOptionInSelected) {
        newSelectedOptions = _.without(selectedOptions, targetOptionInSelected)
        setSelectedOptions(newSelectedOptions)
      }
    }
  }
  const unSelect = (e: React.MouseEvent<HTMLElement>, index: number) => {
    e.stopPropagation()
    e.preventDefault()
    if (selectedOptions.length === 1) return

    const targetOptionInSelected = selectedOptionsForShow[index]
    const newSelectedOptions = _.without(
      selectedOptions,
      targetOptionInSelected
    )
    setSelectedOptions(newSelectedOptions)

    const targetIndex = _.findIndex(
      options,
      (option) => option.slug === targetOptionInSelected.slug
    )
    if (targetIndex > -1) {
      const updatedOptions = [...options]
      updatedOptions[targetIndex].selected = false
      setOptions(updatedOptions)
    }
  }
  const confirmSelect = () => {
    const selected = _.map(selectedOptions, (item) => {
      const selectedItem = { ...item }
      selectedItem.selected = false
      return selectedItem
    })
    onConfirmSelection(selected)
    onClose()
  }

  return (
    <>
      <TopBox $show={!isSearchMode}>
        <TitleBox>
          <Title text={title} />
          <ButtonGroup>
            <Button
              iconComponent={<Cross releaseBranch={releaseBranch} />}
              theme={IconButton.THEME.normal}
              type={IconButton.Type.PRIMARY}
              onClick={onClose}
            />
          </ButtonGroup>
        </TitleBox>
        {subtitle ? <Subtitle text={subtitle} /> : null}
      </TopBox>
      <SearchBox $isSearchMode={isSearchMode}>
        <Button
          iconComponent={
            <Arrow
              direction={Arrow.Direction.LEFT}
              releaseBranch={releaseBranch}
            />
          }
          theme={IconButton.THEME.normal}
          type={IconButton.Type.PRIMARY}
          onClick={() => {
            setIsSearchMode(false)
          }}
        />
        <Search
          handleChange={setKeyword}
          handleFocus={() => {
            setIsSearchMode(true)
          }}
        />
      </SearchBox>
      <HorizontalLine $show={isSearchMode} />
      <SelectBox>
        <Seleted>
          <Text text={`已選 (${selectedOptions.length}/${maxSelectedCount})`} />
          <TagBox>
            {_.map(selectedOptionsForShow, (selectedOption, index) => (
              <SelectTag
                key={`selected-tag-${index}`}
                withDelete={true}
                isLast={selectedOptions.length === 1}
                {...selectedOption}
                selected={true}
                onClick={(e) => unSelect(e, index)}
              />
            ))}
          </TagBox>
        </Seleted>
        <HorizontalLine $show={true} />
        <UnSelected>
          <Text text={`全部`} />
          <TagBox>
            {_.map(optionsForShow, (option, index) => (
              <SelectTag
                key={`all-options-${index}`}
                withDelete={false}
                {...option}
                onClick={(e) => toggleSelect(e, index)}
              />
            ))}
            {optionsForShow.length === 0 ? (
              <EmptyText text={'找不到任何結果'} />
            ) : null}
          </TagBox>
        </UnSelected>
      </SelectBox>
      <ConfirmBox>
        <ConfirmButton
          text={'確定'}
          size={PillButton.Size.L}
          theme={PillButton.THEME.normal}
          type={PillButton.Type.PRIMARY}
          onClick={confirmSelect}
        />
      </ConfirmBox>
    </>
  )
}

export default FilterModal
