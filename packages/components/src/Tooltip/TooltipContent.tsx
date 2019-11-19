import styled from 'styled-components'
import { Link } from '../Link'
import { Paragraph } from '../Text'
import { TooltipProps } from './Tooltip'
export const TooltipContent = styled(Paragraph).attrs(
  (props: TooltipProps) => ({
    fontSize: 'xsmall',
    lineHeight: 'xsmall',
    m: 'none',
    maxWidth: props.width,
    p: 'xsmall',
    width: 'auto',
  })
)`
  hyphens: auto;
  overflow-wrap: anywhere;

  ${Link} {
    color: ${props => props.theme.colors.palette.blue200};
  }
`

TooltipContent.defaultProps = { textAlign: 'center', width: '16rem' }
