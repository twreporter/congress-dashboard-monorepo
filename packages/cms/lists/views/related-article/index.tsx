'use client'

import React, { useState, useEffect, ChangeEvent } from 'react'
import styled from '@emotion/styled'
// utils
import { getTwreporterArticle, getTwreporterTopic } from './util'
// types
import type {
  FieldControllerConfig,
  FieldController,
  FieldProps,
} from '@keystone-6/core/types'
import type { RelatedType } from './types'
// constants
import {
  RELATED_TYPE,
  RELATED_TYPE_LABEL,
  RELATED_TYPE_OPTION,
  MAX_RELATED_ITEM,
} from './constants'
// components
import { FieldLabel, FieldContainer, TextInput } from '@keystone-ui/fields'
import { Button } from '@keystone-ui/button'
import { SearchIcon, TrashIcon } from '@keystone-ui/icons'
import { Box, Text } from '@keystone-ui/core'
// lodash
import { without } from 'lodash'
const _ = {
  without,
}

const InputBox = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`
const Item = styled.div`
  background-color: white;
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 4px 8px;
  border: 1px solid #cdcdcd;
  border-radius: 8px;
  margin-top: 4px;
  &:first-child {
    margin-top: 0;
  }
`
const DeleteButton = styled(Button)`
  margin-left: auto;
`
const TypeSelector = styled.select`
  font-size: 1rem;
  height: 38px;
  background-color: inherit;
  cursor: pointer;
`
const TypeBadge = styled.div`
  color: #6b7280;
  background-color: #eff3f6;
  padding: 1px 12px;
  flex-shrink: 0;
`
const boxStyle = {
  border: '1px solid #e2e2e2',
}

type Relateds = {
  type: RelatedType
  slug: string
}[]
export const Field = ({
  value,
  field,
  onChange,
}: FieldProps<typeof controller>) => {
  const [selectedType, setSelectedType] = useState<RelatedType>(
    RELATED_TYPE.wwwArticle
  )
  const [inputSlug, setInputSlug] = useState('')
  const [relateds, setRelateds] = useState<Relateds>(value || [])

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputSlug(e.target.value)
  }

  const onSelectTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value as RelatedType)
  }

  const addRelated = async () => {
    if (relateds.length === MAX_RELATED_ITEM) {
      alert(`已達五筆相關文章上限，請先刪除後再新增。`)
      return
    }
    const relatedTypeLabel =
      selectedType === RELATED_TYPE.wwwTopic ? '專題' : '文章'
    try {
      const fetcher =
        selectedType === RELATED_TYPE.wwwTopic
          ? getTwreporterTopic
          : getTwreporterArticle
      const item = await fetcher(inputSlug)
      alert(`
        新增報導者相關${relatedTypeLabel}:
          ${item.title}
      `)
      // todo: add check for duplicate items & only take top 5 recent item
      setRelateds((relateds) =>
        [{ type: selectedType, slug: inputSlug }].concat(relateds)
      )
      setInputSlug('')
    } catch (err) {
      console.error(
        `Failed to add ${selectedType}. slug: ${inputSlug}, err: ${err}`
      )
      alert(`
        查無此${relatedTypeLabel}，請檢查${relatedTypeLabel} slug 和類別並再試一次。
        如資料正確請截圖回報產品經理。
      `)
    }
  }

  const removeRelatedItem = (type: RelatedType, slug: string) => {
    setRelateds(
      relateds.filter((item) => !(item.type === type && item.slug === slug))
    )
  }

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(relateds)
    }
  }, [relateds])

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <InputBox>
        <Button
          isBlock={false}
          tone={'passive'}
          size={'small'}
          weight={'light'}
        >
          <TypeSelector onChange={onSelectTypeChange} name="相關文章類別">
            {RELATED_TYPE_OPTION.map(({ value, label }) => (
              <option value={value} key={`type-option-${value}`}>
                {label}
              </option>
            ))}
          </TypeSelector>
        </Button>
        <TextInput value={inputSlug} onChange={onInputChange} />
        <Button onClick={addRelated}>
          <SearchIcon />
        </Button>
      </InputBox>
      {relateds.length > 0 ? (
        <Box
          background={'neutral100'}
          rounding={'medium'}
          padding={'medium'}
          style={boxStyle}
        >
          {relateds.map(({ type, slug }) => (
            <Item key={`${type}-slug-${slug}`}>
              <TypeBadge>{RELATED_TYPE_LABEL[type]}</TypeBadge>
              <Text textAlign={'left'}>{slug}</Text>
              <DeleteButton
                isBlock={false}
                tone={'passive'}
                size={'small'}
                weight={'light'}
                onClick={() => removeRelatedItem(type, slug)}
              >
                <TrashIcon />
              </DeleteButton>
            </Item>
          ))}
        </Box>
      ) : null}
    </FieldContainer>
  )
}

export const controller = (
  config: FieldControllerConfig<any>
): FieldController<Relateds> => {
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: config.path,
    defaultValue: [],
    deserialize: (data) => {
      const value = data[config.path]
      return value
    },
    serialize: (value) => ({ [config.path]: value }),
  }
}
