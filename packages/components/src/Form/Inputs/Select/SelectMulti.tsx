/*

 MIT License

 Copyright (c) 2020 Looker Data Sciences, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

import React, { forwardRef, Ref, ReactNode } from 'react'
import styled from 'styled-components'
import { CustomizableAttributes } from '@looker/design-tokens'
import { Box } from '../../../Layout'
import { ListItem } from '../../../List'
import { Heading, Paragraph } from '../../../Text'
import { ValidationType } from '../../ValidationMessage'
import {
  ComboboxMulti,
  ComboboxMultiInput,
  ComboboxMultiList,
  ComboboxMultiOption,
  ComboboxMultiProps,
  comboboxOptionGrid,
  ComboboxOptionText,
  getComboboxText,
} from '../Combobox'
import { SelectOptionObject, SelectOptionProps } from './Select'

export const CustomizableSelectMultiAttributes: CustomizableAttributes = {
  borderRadius: 'medium',
  fontSize: 'small',
  height: '28px',
  px: 'xsmall',
  py: 'none',
}

export interface SelectMultiOptionGroupProps {
  options: SelectOptionObject[]
  title: string | ReactNode
}

export interface SelectMultiProps
  extends Omit<ComboboxMultiProps, 'values' | 'defaultValues' | 'onChange'> {
  options?: SelectOptionProps[]
  /**
   * Displays an example value or short hint to the user. Should not replace a label.
   */
  placeholder?: string
  /**
   * The user can type in the input (default false to mimic traditional select tag)
   */
  isFilterable?: boolean
  /**
   * The user can clear the current value by clicking an x icon button
   */
  isClearable?: boolean
  /**
   * Handle when the user types in the field,
   * or the menu opens with a pre-populated value
   */
  onFilter?: (term: string) => void

  validationType?: ValidationType
  /**
   * Value of the current selected option (controlled)
   */
  values?: string[]
  /**
   * Value of the initial option
   */
  defaultValues?: string[]
  /**
   * Handle an option being selected
   */
  onChange?: (values?: string[]) => void
}

function flattenOptions(options: SelectOptionProps[]) {
  return options.reduce(
    (acc: SelectOptionObject[], option: SelectOptionProps) => {
      const optionAsGroup = option as SelectMultiOptionGroupProps
      if (optionAsGroup.title) {
        return [...acc, ...optionAsGroup.options]
      }
      return [...acc, option as SelectOptionObject]
    },
    []
  )
}

function getOptions(
  values?: string[],
  options?: SelectOptionProps[]
): SelectOptionObject[] | undefined {
  if (!values) return undefined
  const flattenedOptions = options && flattenOptions(options)
  return values.map(value => ({
    label: getComboboxText(value, flattenedOptions),
    value,
  }))
}

const renderOption = (option: SelectOptionObject, index: number) => {
  if (option.description) {
    return (
      <ComboboxMultiOption {...option} key={index} py="xxsmall">
        <Box>
          <Heading fontSize="small" fontWeight="semiBold" pb="xxsmall">
            <ComboboxOptionText />
          </Heading>
          <Paragraph variant="subdued" fontSize="small">
            {option.description}
          </Paragraph>
        </Box>
      </ComboboxMultiOption>
    )
  }
  return <ComboboxMultiOption {...option} key={index} />
}

const SelectMultiOptionGroupTitle = styled(Heading)`
  ${comboboxOptionGrid}
`

SelectMultiOptionGroupTitle.defaultProps = {
  fontSize: 'xxsmall',
  fontWeight: 'semiBold',
  px: 'xsmall',
  py: 'xxsmall',
  variant: 'subdued',
}

const SelectMultiOptionGroup = ({
  options,
  title,
}: SelectMultiOptionGroupProps) => (
  <Box py="xxsmall">
    <SelectMultiOptionGroupTitle>
      <span />
      {title}
    </SelectMultiOptionGroupTitle>
    {options.map(renderOption)}
  </Box>
)

const SelectMultiComponent = forwardRef(
  (
    {
      options,
      disabled,
      isFilterable,
      isClearable,
      placeholder,
      onFilter,
      onChange,
      values,
      defaultValues,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      validationType,
      ...props
    }: SelectMultiProps,
    ref: Ref<HTMLInputElement>
  ) => {
    const optionValues = getOptions(values, options)
    const nullDefault = (isClearable || placeholder) && !defaultValues
    const defaultOptionValues = nullDefault
      ? undefined
      : getOptions(defaultValues, options)

    function handleChange(options?: SelectOptionObject[]) {
      const newValues = options && options.map(option => option.value)
      onChange && onChange(newValues)
      onFilter && onFilter('')
    }

    function handleInputChange(value: string) {
      onFilter && onFilter(value)
    }

    function handleClose() {
      // when the list closes, the input's value reverts to the current option
      onFilter && onFilter('')
    }

    const ariaProps = {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
    }

    const inputProps = {
      disabled,
      placeholder,
      validationType,
    }

    return (
      <ComboboxMulti
        {...props}
        values={optionValues}
        defaultValues={defaultOptionValues}
        onChange={handleChange}
        onClose={handleClose}
      >
        <ComboboxMultiInput
          {...inputProps}
          {...ariaProps}
          autoComplete={false}
          readOnly={!isFilterable}
          onInputChange={handleInputChange}
          hideControls={!isClearable}
          selectOnClick={isFilterable}
          ref={ref}
        />
        {!disabled && (
          <ComboboxMultiList
            persistSelection
            closeOnSelect={false}
            {...ariaProps}
          >
            {options && options.length > 0 ? (
              options.map((option: SelectOptionProps, index: number) => {
                const optionAsGroup = option as SelectMultiOptionGroupProps
                return optionAsGroup.title ? (
                  <SelectMultiOptionGroup key={index} {...optionAsGroup} />
                ) : (
                  renderOption(option as SelectOptionObject, index)
                )
              })
            ) : (
              <ListItem fontSize="small" px="medium" py="xxsmall">
                No options
              </ListItem>
            )}
          </ComboboxMultiList>
        )}
      </ComboboxMulti>
    )
  }
)

SelectMultiComponent.displayName = 'SelectMultiComponent'

export const SelectMulti = styled(SelectMultiComponent)``
