'use client'

import React, { FC, useContext, useState, useMemo } from 'react'
// context
import { FeedbackContext } from '@/components/feedback/context'
// util
import { emailValidator } from '@/utils/validate-email'
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
  const [deviceType, setDeviceType] = useState<DeviceType>()
  const [osType, setOSType] = useState<OSType>()
  const [osOther, setOSOther] = useState('')
  const [browserType, setBrowserType] = useState<BrowserType>()
  const [browserOther, setBrowserOther] = useState('')
  const [problem, setProblem] = useState('')

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
      !deviceType ||
      !osType ||
      !browserType ||
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
        osType: osType! === OSType.Other ? osOther || osType! : osType!,
        browserType:
          browserType! === BrowserType.Other
            ? browserOther || browserType!
            : browserType!,
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
              checked: deviceType === DeviceType.Desktop,
              onChange: () => setDeviceType(DeviceType.Desktop),
            },
            {
              label: '手機',
              checked: deviceType === DeviceType.Mobile,
              onChange: () => setDeviceType(DeviceType.Mobile),
            },
            {
              label: '平板',
              checked: deviceType === DeviceType.Tablet,
              onChange: () => setDeviceType(DeviceType.Tablet),
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
              checked: osType === OSType.Windows,
              onChange: () => setOSType(OSType.Windows),
            },
            {
              label: 'MacOS',
              checked: osType === OSType.Mac,
              onChange: () => setOSType(OSType.Mac),
            },
            {
              label: 'iOS',
              checked: osType === OSType.Ios,
              onChange: () => setOSType(OSType.Ios),
            },
            {
              label: 'Android',
              checked: osType === OSType.Android,
              onChange: () => setOSType(OSType.Android),
            },
            {
              label: 'Linux',
              checked: osType === OSType.Linux,
              onChange: () => setOSType(OSType.Linux),
            },
            {
              label: '其他',
              checked: osType === OSType.Other,
              onChange: () => setOSType(OSType.Other),
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
              checked: browserType === BrowserType.Chrome,
              onChange: () => setBrowserType(BrowserType.Chrome),
            },
            {
              label: 'Safari',
              checked: browserType === BrowserType.Safari,
              onChange: () => setBrowserType(BrowserType.Safari),
            },
            {
              label: 'Firefox',
              checked: browserType === BrowserType.Firefox,
              onChange: () => setBrowserType(BrowserType.Firefox),
            },
            {
              label: 'Edge',
              checked: browserType === BrowserType.Edge,
              onChange: () => setBrowserType(BrowserType.Edge),
            },
            {
              label: 'Opera',
              checked: browserType === BrowserType.Opera,
              onChange: () => setBrowserType(BrowserType.Opera),
            },
            {
              label: '其他',
              checked: browserType === BrowserType.Other,
              onChange: () => setBrowserType(BrowserType.Other),
              showInputOnChecked: true,
              onInputChange: (e) => setBrowserOther(e.target.value),
            },
          ]}
        />
        <TextareaOption
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
