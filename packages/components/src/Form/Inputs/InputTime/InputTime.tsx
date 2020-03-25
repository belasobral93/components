import React, { KeyboardEvent, FC, useState } from 'react'
import styled from 'styled-components'

import {
  BorderProps,
  SpaceProps,
  border,
  space,
  reset,
} from '@looker/design-tokens'
import {
  InputText,
  inputTextHover,
  inputTextFocus,
  inputTextDisabled,
  inputTextValidation,
  inputTextDefaults,
  CustomizableInputTextAttributes,
} from '../InputText'
import { formatTimeString, timeFormats, parseBase10Int } from '../utils'

import { ValidationType } from '../../ValidationMessage'

interface InputTimeProps extends SpaceProps, BorderProps {
  format?: timeFormats
  defaultValue?: string
  value?: string
  onChange?: (time?: string) => void
  validationType?: ValidationType
  onValidationFail?: (value: string) => void
}

const isNumericKeycode = (e: KeyboardEvent) =>
  (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)

export const InputTime: FC<InputTimeProps> = ({ format = '12h' }) => {
  const [hour, setHour] = useState('')
  const [minute, setMinute] = useState('')
  const [period, setPeriod] = useState('')

  const handleHourKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isNumericKeycode(e)) {
      setHour(formatTimeString(parseBase10Int(e.key)))
    }
  }

  const handleMinuteKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isNumericKeycode(e)) {
      setMinute(formatTimeString(parseBase10Int(e.key)))
    }
  }

  const handlePeriodKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const key = e.key.toUpperCase()
    key === 'P' && setPeriod('PM')
    key === 'A' && setPeriod('AM')
  }

  return (
    <InputTimeWrapper>
      <InputTimeLayout>
        <InputText
          maxLength={2}
          placeholder="--"
          value={hour}
          onKeyDown={handleHourKeyDown}
        />
        <div>:</div>
        <InputText
          maxLength={2}
          placeholder="--"
          value={minute}
          onKeyDown={handleMinuteKeyDown}
        />
        {format === '12h' ? (
          <InputText
            maxLength={2}
            placeholder="--"
            value={period}
            onKeyDown={handlePeriodKeyDown}
          />
        ) : (
          <span />
        )}
      </InputTimeLayout>
    </InputTimeWrapper>
  )
}

const InputTimeWrapper = styled.div.attrs({
  ...inputTextDefaults,
  ...CustomizableInputTextAttributes,
})`
  ${reset}
  ${border}
  ${space}

  display: inline-block;
  padding: ${({ theme }) => theme.space.xxsmall};

  &:hover {
    ${inputTextHover}
  }

  &:focus-within {
    ${inputTextFocus}
  }

  &:disabled {
    ${inputTextDisabled}
  }

  ${inputTextValidation}

  ${InputText} {
    border: none;
    border-radius: 0;
    padding: ${({ theme }) => theme.space.xxxsmall} 0;
    margin: 0;
    box-shadow: none;
    background: transparent;
    width: 2rem;
    height: auto;
    line-height: ${({ theme }) => theme.lineHeights.medium};
    text-align: center;
    &:focus {
      background: ${({ theme }) => theme.colors.palette.purple100};
    }
  }
`

const InputTimeLayout = styled.div`
  display: grid;
  grid-gap: 0.25rem;
  grid-template-columns: repeat(4, auto);
  align-items: center;
`
