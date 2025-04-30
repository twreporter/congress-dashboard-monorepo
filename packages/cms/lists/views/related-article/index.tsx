import React, { useState, useEffect, ChangeEvent } from 'react'
import styled from '@emotion/styled'
// config
import env from '../../../environment-variables'
// type
import type {
  FieldControllerConfig,
  FieldController,
  FieldProps,
} from '@keystone-6/core/types'
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
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  border: 1px solid #cdcdcd;
  border-radius: 8px;
  margin-top: 4px;
  &:first-child {
    margin-top: 0;
  }
`
const boxStyle = {
  border: '1px solid #e2e2e2',
}

const getTwreporterArticle = async (slug: string) => {
  const url = `${env.twreporterApiUrl}/v2/posts/${slug}?full=false`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`article not found, slug: ${slug}`)
  }

  const data = await res.json()
  return data?.data
}

type Slugs = string[]
export const Field = ({
  value,
  field,
  onChange,
}: FieldProps<typeof controller>) => {
  const [inputSlug, setInputSlug] = useState('')
  const [slugs, setSlugs] = useState<Slugs>(value || [])
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputSlug(e.target.value)
  }
  const addSlug = async () => {
    try {
      const article = await getTwreporterArticle(inputSlug)
      alert(`
        新增報導者相關文章:
          ${article.title}
      `)
      setSlugs([inputSlug].concat(slugs))
      setInputSlug('')
    } catch (err) {
      alert(`
        無法加入此文章，重新輸入文章 slug 再試一次。
        error code: ${err}
      `)
    }
  }
  const removeSlug = (slug: string) => {
    setSlugs(_.without(slugs, slug))
  }

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(slugs)
    }
  }, [slugs])

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <InputBox>
        <TextInput value={inputSlug} onChange={onInputChange} />
        <Button onClick={addSlug}>
          <SearchIcon />
        </Button>
      </InputBox>
      {slugs.length > 0 ? (
        <Box
          background={'neutral100'}
          rounding={'medium'}
          padding={'medium'}
          style={boxStyle}
        >
          {slugs.map((slug) => (
            <Item key={`slug-${slug}`}>
              <Text textAlign={'left'}>{slug}</Text>
              <Button
                isBlock={false}
                tone={'passive'}
                size={'small'}
                weight={'light'}
                onClick={() => removeSlug(slug)}
              >
                <TrashIcon />
              </Button>
            </Item>
          ))}
        </Box>
      ) : null}
    </FieldContainer>
  )
}

export const controller = (
  config: FieldControllerConfig<any>
): FieldController<Slugs> => {
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
