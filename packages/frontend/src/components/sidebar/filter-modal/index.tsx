'use client'
import React, { useEffect, useState, useMemo, useRef, MouseEvent } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
// util
import { openFeedback } from '@/utils/feedback'
// type
import type { FilterOption } from '@/components/sidebar/type'
// components
import SelectTag from '@/components/sidebar/filter-modal/select-tag'
import Search from '@/components/sidebar/filter-modal/search'
import { Loader } from '@/components/loader'
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
import { H5 } from '@twreporter/react-components/lib/text/headline'
import {
  SnackBar,
  useSnackBar,
} from '@twreporter/react-components/lib/snack-bar'
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
const maxSelectedCount = {
  count: 10,
  snackBarText: '至多可有十個篩選項目',
}
const minSelectedCount = {
  count: 1,
  snackBarText: '至少需保留一個篩選項目',
}

// Error Component
const ErrorBox = styled.div`
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 8px;
`
const ErrorTitle = styled(H5)`
  color: ${colorGrayscale.gray800};
`
const Desc = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const TextButtonInP = styled.p`
  text-decoration: underline ${colorGrayscale.gray700};
  text-underline-offset: 1px;
  text-underline-position: from-font;
`
const ErrorDesc = styled(P1)`
  color: ${colorGrayscale.gray700};
`
const Error: React.FC = () => (
  <ErrorBox>
    <ErrorTitle text={'資料載入失敗'} />
    <Desc>
      <ErrorDesc text={'請嘗試重新整理頁面。若仍無法正常顯示，'} />
      <ErrorDesc>
        歡迎點此
        <TextButtonInP onClick={openFeedback}>回報問題</TextButtonInP>
        以協助我們改善。
      </ErrorDesc>
    </Desc>
  </ErrorBox>
)

// Filter Modal Component
const TopBox = styled(FlexColumn)<{ $show: boolean }>`
  padding: 16px 16px 16px 24px;
  border-bottom: 1px solid ${colorGrayscale.gray300};
  position: sticky;
  top: 0;
  background-color: ${colorGrayscale.white};
  z-index: 1;
  ${(props) => (props.$show ? '' : 'transform: translateY(-100%);')}
  transition: transform 0.4s ease-in-out;
`
const TitleBox = styled(FlexRow)`
  align-items: center;
`
const bottomHeight = 92 // confirm box height
const ContentBox = styled.div<{
  $topBoxHeight: number
  $isSearchMode: boolean
}>`
  overflow-y: scroll;
  height: 100%;
  max-height: calc(100% - ${(props) => props.$topBoxHeight + bottomHeight}px);
  transition: all 0.4s ease-in-out;
  ${(props) =>
    props.$isSearchMode
      ? `
    transform: translateY(-${props.$topBoxHeight}px);
    max-height: calc(100% - ${bottomHeight}px);
  `
      : `
    transform: translateY(0);  
  `}
`
const HorizontalLine = styled.div<{ $show: boolean }>`
  border-bottom: 1px solid ${colorGrayscale.gray300};
  ${(props) => (props.$show ? '' : `display: none;`)}
`
const SearchBox = styled(FlexRow)<{ $isSearchMode: boolean }>`
  padding: 24px 24px 0 24px;
  background-color: ${colorGrayscale.white};

  ${(props) =>
    props.$isSearchMode
      ? `
    position: sticky;
    top: 0;
    padding: 16px 24px 16px 16px;
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
const ConfirmBox = styled.div<{ $isLoading: boolean }>`
  position: ${(props) => (props.$isLoading ? 'fixed' : 'sticky')};
  bottom: 0;
  z-index: 1;
  width: 100%;
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

const ConfirmBoxRelative = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-top: 1px solid ${colorGrayscale.gray300};
  background-color: ${colorGrayscale.white};
`

const ConfirmButtonContainer = styled.div`
  width: 100%;
  padding: 24px;
`

const SnackBarContainer = styled.div<{ $showSnackBar?: boolean }>`
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%) translateY(-100%);
  transition: opacity 100ms ease-in-out;
  opacity: ${(props) => (props.$showSnackBar ? 1 : 0)};
`

type FilterModalProps = {
  slug: string
  title: string
  subtitle?: string
  initialOption?: FilterOption[]
  placeholder?: string
  initialSelectedOption?: FilterOption[]
  fetcher?: (slug: string) => Promise<FilterOption[]>
  onClose: () => void
  onConfirmSelection: (selectedOptions: FilterOption[]) => void
}
const filterByKeyword = (
  options: FilterOption[],
  keyword: string
): FilterOption[] => {
  return keyword
    ? _.filter(options, (option) =>
        Boolean(option.name && option.name.includes(keyword))
      )
    : options
}
const FilterModal: React.FC<FilterModalProps> = ({
  title,
  slug,
  subtitle,
  initialOption = [],
  placeholder,
  initialSelectedOption = [],
  fetcher,
  onClose,
  onConfirmSelection,
}) => {
  const topBoxRef = useRef<HTMLDivElement>(null)
  const [options, setOptions] = useState<FilterOption[]>(
    _.map(initialOption, (option) => {
      const isSelected =
        _.findIndex(
          initialSelectedOption,
          (selectedOption) => selectedOption.slug === option.slug
        ) !== -1
      return { ...option, selected: isSelected }
    })
  )
  const [selectedOptions, setSelectedOptions] = useState(initialSelectedOption)
  const [hasLoaded, setHasLoaded] = useState(!fetcher) // Set to true if no fetcher
  const [keyword, setKeyword] = useState('')
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [isShowLoading, setIsShowLoading] = useState(!!fetcher) // Only show loading if fetcher exists
  const [isShowError, setIsShowError] = useState(false)
  const { data, error } = useSWR(
    fetcher ? slug : null,
    () => fetcher && fetcher(slug)
  )
  const selectedOptionsForShow = useMemo(
    () => selectedOptions,
    [selectedOptions]
  )
  const optionsForShow = useMemo<FilterOption[]>(
    () => (isSearchMode ? filterByKeyword(options, keyword) : options),
    [options, keyword, isSearchMode]
  )
  const topBoxHeight = useMemo(
    () => (topBoxRef.current ? topBoxRef.current.offsetHeight : 0),
    [topBoxRef]
  )

  const { toastr, showSnackBar, snackBarText } = useSnackBar()
  // If no fetcher is provided, use initialSelectedOption as options
  useEffect(() => {
    if (!fetcher && !hasLoaded) {
      setOptions(
        _.map(initialSelectedOption, (option) => ({
          selected: true,
          ...option,
        }))
      )
      setHasLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (hasLoaded) {
      setIsShowLoading(false)
    }
  }, [hasLoaded])

  useEffect(() => {
    if (hasLoaded) {
      setIsShowError(false)
    } else if (error) {
      console.error(`fetch options failed. err: ${error}`)
      setIsShowError(true)
      setIsShowLoading(false)
    }
  }, [hasLoaded, error])

  useEffect(() => {
    if (!data || hasLoaded) return
    const newOptions = _.unionBy(
      options,
      _.map(data, (item) => {
        const isSelected =
          _.findIndex(
            initialSelectedOption,
            (selectedOption) => selectedOption.slug === item.slug
          ) !== -1
        return { selected: isSelected, ...item }
      }),
      'slug'
    )
    setOptions(newOptions)
    setHasLoaded(true)
  }, [data, hasLoaded, options, initialSelectedOption])

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
    if (!newSelected && selectedOptions.length === minSelectedCount.count) {
      toastr({ text: minSelectedCount.snackBarText })
      return
    }
    if (newSelected && selectedOptions.length === maxSelectedCount.count) {
      toastr({ text: maxSelectedCount.snackBarText })
      return
    }

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
    if (selectedOptions.length === minSelectedCount.count) {
      toastr({ text: minSelectedCount.snackBarText })
      return
    }

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
  const confirmSelect = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    onConfirmSelection(selectedOptions)
    onClose()
  }

  return (
    <>
      <TopBox $show={!isSearchMode} ref={topBoxRef}>
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
      {isShowLoading ? (
        <Loader />
      ) : isShowError ? (
        <Error />
      ) : (
        <ContentBox $topBoxHeight={topBoxHeight} $isSearchMode={isSearchMode}>
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
              placeholder={placeholder}
              handleChange={setKeyword}
              handleFocus={() => {
                setIsSearchMode(true)
              }}
            />
          </SearchBox>
          <HorizontalLine $show={isSearchMode} />
          <SelectBox>
            <Seleted>
              <Text
                text={`已選 (${selectedOptions.length}/${maxSelectedCount.count})`}
              />
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
        </ContentBox>
      )}
      <ConfirmBox $isLoading={isShowLoading}>
        <ConfirmBoxRelative>
          <SnackBarContainer $showSnackBar={showSnackBar}>
            <SnackBar text={snackBarText} />
          </SnackBarContainer>
          <ConfirmButtonContainer>
            <ConfirmButton
              text={'確定'}
              size={PillButton.Size.L}
              theme={PillButton.THEME.normal}
              type={PillButton.Type.PRIMARY}
              onClick={confirmSelect}
            />
          </ConfirmButtonContainer>
        </ConfirmBoxRelative>
      </ConfirmBox>
    </>
  )
}

export default FilterModal
