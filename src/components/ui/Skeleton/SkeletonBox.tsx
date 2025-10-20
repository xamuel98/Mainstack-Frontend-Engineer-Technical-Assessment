import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

const shimmerKeyframes = `
  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
`;

interface SkeletonBoxProps extends BoxProps {
    width?: string | number | Record<string, string | number>;
    height?: string | number | Record<string, string | number>;
    borderRadius?: string | number | Record<string, string | number>;
}

const SkeletonBox: React.FC<SkeletonBoxProps> = ({
    width = '100%',
    height = '20px',
    borderRadius = 'md',
    ...props
}) => {
    return (
        <>
            <style>{shimmerKeyframes}</style>
            <Box
                width={width}
                height={height}
                borderRadius={borderRadius}
                background='linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)'
                backgroundSize='200px 100%'
                position='relative'
                overflow='hidden'
                css={{
                    animation: 'shimmer 1.2s ease-in-out infinite',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                            'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.4) 50%, transparent 75%)',
                        backgroundSize: '200px 100%',
                        animation: 'shimmer 1.2s ease-in-out infinite',
                    },
                }}
                {...props}
            />
        </>
    );
};

export default SkeletonBox;
