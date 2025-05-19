'use client'

import React, { FC, useContext, useState, useMemo, useCallback } from 'react'
// context
import { FeedbackContext } from '@/components/feedback/context'
// util
import { emailValidator } from '@/utils/validate-email'
import {
  createToggleFunc,
  createTypeWithOtherFormatter,
} from '@/components/feedback/util'
// enum
import {
  FeedbackType,
  ProductProblemType,
  DeviceType,
  OSType,
  BrowserType,
} from '@/components/feedback/enum'
// type
import type { ProductDetail } from '@/components/feedback/type'
// component
import {
  TextOption,
  TextareaOption,
  RadioGroupOption,
} from '@/components/feedback/option-group'
// style
import {
  Box,
  TitleBlock,
  OptionBlock,
  ActionBlock,
  Title,
  CloseButton,
  ActionButton,
} from '@/components/feedback/style'
// @twreporter
import { PillButton } from '@twreporter/react-components/lib/button'
import { Cross } from '@twreporter/react-components/lib/icon'
// lodash
import { includes } from 'lodash'

// global var
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

type ProductInfoProps = {
  submit?: (productDetail: ProductDetail) => void
}

const ProductInfo: FC<ProductInfoProps> = ({ submit }) => {
  const { prevStep, closeFeedback } = useContext(FeedbackContext)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [problemType, setProblemType] = useState<ProductProblemType>()
  const [deviceType, setDeviceType] = useState<DeviceType[]>([])
  const [osType, setOSType] = useState<OSType[]>([])
  const [osOther, setOSOther] = useState('')
  const [browserType, setBrowserType] = useState<BrowserType[]>([])
  const [browserOther, setBrowserOther] = useState('')
  const [problem, setProblem] = useState('')

  const noopFunc = useCallback(() => {}, [])
  // create toggle func
  const toggleDeviceType = useCallback(
    createToggleFunc<DeviceType>(deviceType, setDeviceType),
    [deviceType, setDeviceType]
  )
  const toggleOsType = useCallback(
    createToggleFunc<OSType>(osType, setOSType),
    [osType, setOSType]
  )
  const toggleBrowserType = useCallback(
    createToggleFunc<BrowserType>(browserType, setBrowserType),
    [browserType, setBrowserType]
  )
  // create formatter func
  const osTypeFormatter = useCallback(
    () => createTypeWithOtherFormatter<OSType>(osType, osOther, OSType.Other),
    [osType, osOther]
  )
  const browserTypeFormatter = useCallback(
    () =>
      createTypeWithOtherFormatter<BrowserType>(
        browserType,
        browserOther,
        BrowserType.Other
      ),
    [browserType, browserOther]
  )

  const emailError = useMemo(
    () => (!isEmailValid && email ? '電子信箱格式錯誤，請重新輸入' : ''),
    [email, isEmailValid]
  )

  const validateEmail = () => {
    if (!email) {
      setIsEmailValid(true)
      return
    }
    setIsEmailValid(emailValidator(email))
  }

  const cannotSubmit = useMemo(
    () =>
      !isEmailValid ||
      !problemType ||
      deviceType.length === 0 ||
      osType.length === 0 ||
      browserType.length === 0 ||
      !problem,
    [isEmailValid, problemType, deviceType, osType, browserType, problem]
  )

  const handleSubmit = () => {
    if (cannotSubmit) {
      return
    }

    if (typeof submit === 'function') {
      submit({
        type: FeedbackType.Product,
        username,
        email,
        problemType: problemType!,
        deviceType: deviceType!,
        osType: osTypeFormatter(),
        browserType: browserTypeFormatter(),
        problem,
      })
    }
  }

  return (
    <Box>
      <TitleBlock>
        <Title text={'選擇回報類型'} />
        <CloseButton
          iconComponent={<Cross releaseBranch={releaseBranch} />}
          onClick={closeFeedback}
        />
      </TitleBlock>
      <OptionBlock>
        <TextOption
          label={'希望報導者如何稱呼您'}
          placeholder={'王小明'}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextOption
          label={'Email（若需要處理進度回報，可留下您的聯繫方式）'}
          placeholder={'twreporter@gmail.com'}
          value={email}
          type={'email'}
          error={emailError}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={validateEmail}
        />
        <RadioGroupOption
          label={'問題類型'}
          required={true}
          columnNum={1}
          options={[
            {
              label: '功能異常（無法使用、錯誤訊息等）',
              checked: problemType === ProductProblemType.Feature,
              onChange: () => setProblemType(ProductProblemType.Feature),
            },
            {
              label: '使用體驗問題（操作不便、流程不順）',
              checked: problemType === ProductProblemType.UX,
              onChange: () => setProblemType(ProductProblemType.UX),
            },
            {
              label: '介面顯示問題（排版、元件異常）',
              checked: problemType === ProductProblemType.UI,
              onChange: () => setProblemType(ProductProblemType.UI),
            },
            {
              label: '產品改進建議（新功能或優化想法）',
              checked: problemType === ProductProblemType.Advice,
              onChange: () => setProblemType(ProductProblemType.Advice),
            },
          ]}
        />
        <RadioGroupOption
          label={'裝置類型'}
          required={true}
          columnNum={1}
          options={[
            {
              label: '桌機/筆電',
              checked: includes(deviceType, DeviceType.Desktop),
              onClick: (e) => toggleDeviceType(e, DeviceType.Desktop),
              onChange: noopFunc,
            },
            {
              label: '手機',
              checked: includes(deviceType, DeviceType.Mobile),
              onClick: (e) => toggleDeviceType(e, DeviceType.Mobile),
              onChange: noopFunc,
            },
            {
              label: '平板',
              checked: includes(deviceType, DeviceType.Tablet),
              onClick: (e) => toggleDeviceType(e, DeviceType.Tablet),
              onChange: noopFunc,
            },
          ]}
        />
        <RadioGroupOption
          label={'作業系統'}
          required={true}
          columnNum={2}
          options={[
            {
              label: 'Windows',
              checked: includes(osType, OSType.Windows),
              onClick: (e) => toggleOsType(e, OSType.Windows),
              onChange: noopFunc,
            },
            {
              label: 'MacOS',
              checked: includes(osType, OSType.Mac),
              onClick: (e) => toggleOsType(e, OSType.Mac),
              onChange: noopFunc,
            },
            {
              label: 'iOS',
              checked: includes(osType, OSType.Ios),
              onClick: (e) => toggleOsType(e, OSType.Ios),
              onChange: noopFunc,
            },
            {
              label: 'Android',
              checked: includes(osType, OSType.Android),
              onClick: (e) => toggleOsType(e, OSType.Android),
              onChange: noopFunc,
            },
            {
              label: 'Linux',
              checked: includes(osType, OSType.Linux),
              onClick: (e) => toggleOsType(e, OSType.Linux),
              onChange: noopFunc,
            },
            {
              label: '其他',
              checked: includes(osType, OSType.Other),
              onClick: (e) => toggleOsType(e, OSType.Other),
              onChange: noopFunc,
              showInputOnChecked: true,
              onInputChange: (e) => setOSOther(e.target.value),
            },
          ]}
        />
        <RadioGroupOption
          label={'瀏覽器'}
          required={true}
          columnNum={2}
          options={[
            {
              label: 'Chrome',
              checked: includes(browserType, BrowserType.Chrome),
              onClick: (e) => toggleBrowserType(e, BrowserType.Chrome),
              onChange: noopFunc,
            },
            {
              label: 'Safari',
              checked: includes(browserType, BrowserType.Safari),
              onClick: (e) => toggleBrowserType(e, BrowserType.Safari),
              onChange: noopFunc,
            },
            {
              label: 'Firefox',
              checked: includes(browserType, BrowserType.Firefox),
              onClick: (e) => toggleBrowserType(e, BrowserType.Firefox),
              onChange: noopFunc,
            },
            {
              label: 'Edge',
              checked: includes(browserType, BrowserType.Edge),
              onClick: (e) => toggleBrowserType(e, BrowserType.Edge),
              onChange: noopFunc,
            },
            {
              label: 'Opera',
              checked: includes(browserType, BrowserType.Opera),
              onClick: (e) => toggleBrowserType(e, BrowserType.Opera),
              onChange: noopFunc,
            },
            {
              label: '其他',
              checked: includes(browserType, BrowserType.Other),
              onClick: (e) => toggleBrowserType(e, BrowserType.Other),
              onChange: noopFunc,
              showInputOnChecked: true,
              onInputChange: (e) => setBrowserOther(e.target.value),
            },
          ]}
        />
        <TextareaOption
          required={true}
          label={'問題描述'}
          placeholder={'請描述您發現的異常內容'}
          value={problem}
          maxLength={250}
          onChange={(e) => setProblem(e.target.value)}
        />
      </OptionBlock>
      <ActionBlock>
        <ActionButton
          theme={PillButton.THEME.normal}
          type={PillButton.Type.SECONDARY}
          size={PillButton.Size.L}
          text={'上一步'}
          onClick={prevStep}
        />
        <ActionButton
          theme={PillButton.THEME.normal}
          type={PillButton.Type.PRIMARY}
          size={PillButton.Size.L}
          text={'完成送出'}
          disabled={cannotSubmit}
          onClick={handleSubmit}
        />
      </ActionBlock>
    </Box>
  )
}

export default ProductInfo
