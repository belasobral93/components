import React, { FC } from 'react'
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
import { timeFormats } from '../utils'

import { ValidationType } from '../../ValidationMessage'

interface InputTimeProps extends SpaceProps, BorderProps {
  format?: timeFormats
  defaultValue?: string
  value?: string
  onChange?: (time?: string) => void
  validationType?: ValidationType
  onValidationFail?: (value: string) => void
}

export const InputTime: FC<InputTimeProps> = ({ format = '12h' }) => {
  return (
    <InputTimeWrapper>
      <InputTimeLayout>
        <InputText maxLength={2} placeholder="--" />
        <div>:</div>
        <InputText maxLength={2} placeholder="--" />
        {format === '12h' ? (
          <InputText maxLength={2} placeholder="--" />
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
