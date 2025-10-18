import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';
import { Box, Flex } from '@chakra-ui/react';

// Keyframes for animations
export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

// Styled navigation components (existing)
export const StyledNavLink = styled.div<{ isActive?: boolean }>`
    position: relative;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;

    ${({ isActive }) =>
        isActive
            ? css`
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                  transform: translateY(-2px);
              `
            : css`
                  color: #4a5568;
                  background: transparent;

                  &:hover {
                      background: linear-gradient(
                          135deg,
                          #f7fafc 0%,
                          #edf2f7 100%
                      );
                      color: #2d3748;
                      transform: translateY(-1px);
                      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                  }
              `}

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 0.5rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: -1;
    }

    &:hover::before {
        opacity: ${({ isActive }) => (isActive ? 0 : 0.1)};
    }

    animation: ${fadeIn} 0.6s ease-out;
`;

// Styled header container
export const StyledHeader = styled(Flex)`
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(226, 232, 240, 0.8);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
    animation: ${slideIn} 0.8s ease-out;
`;

// Styled logo container
export const StyledLogo = styled(Box)`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border-radius: 0.75rem;
    transition: all 0.3s ease;

    &:hover {
        background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
        transform: scale(1.02);
        animation: ${pulse} 2s infinite;
    }

    img {
        transition: transform 0.3s ease;
    }

    &:hover img {
        transform: rotate(5deg) scale(1.1);
    }
`;

// Styled navigation container
export const StyledNavigation = styled(Flex)`
    gap: 0.5rem;
    padding: 0.5rem;
    background: rgba(247, 250, 252, 0.5);
    border-radius: 1rem;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(226, 232, 240, 0.6);
`;

// Styled action button
export const StyledActionButton = styled.button<{
    variant?: 'primary' | 'secondary';
}>`
    padding: 0.75rem 1.5rem;
    border-radius: 0.75rem;
    border: none;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    ${({ variant = 'primary' }) =>
        variant === 'primary'
            ? css`
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

                  &:hover {
                      transform: translateY(-2px);
                      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
                  }

                  &:active {
                      transform: translateY(0);
                  }
              `
            : css`
                  background: rgba(247, 250, 252, 0.8);
                  color: #4a5568;
                  border: 1px solid rgba(226, 232, 240, 0.8);

                  &:hover {
                      background: white;
                      color: #2d3748;
                      border-color: #cbd5e0;
                      transform: translateY(-1px);
                      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                  }
              `}

    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition:
            width 0.6s,
            height 0.6s;
    }

    &:active::before {
        width: 300px;
        height: 300px;
    }
`;

// Responsive breakpoints
export const APP_BREAKPOINTS = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
};

// Media query helper
export const mediaQuery = (breakpoint: keyof typeof APP_BREAKPOINTS) =>
    `@media (min-width: ${APP_BREAKPOINTS[breakpoint]})`;

// Styled responsive container
export const ResponsiveContainer = styled(Box)`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;

    ${mediaQuery('sm')} {
        padding: 0 1.5rem;
    }

    ${mediaQuery('md')} {
        padding: 0 2rem;
    }

    ${mediaQuery('lg')} {
        padding: 0 2.5rem;
    }
`;

// Styled card component
export const StyledCard = styled(Box)<{ hover?: boolean }>`
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(226, 232, 240, 0.8);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    ${({ hover = true }) =>
        hover &&
        css`
            &:hover {
                transform: translateY(-4px);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                border-color: rgba(102, 126, 234, 0.3);
            }
        `}
`;
